/*jshint node:true;strict:false*/

/**
 * groundskeeper
 *
 * A small utility to remove declared pragmas and console declarations from
 * string files
 * Please see: http://upload.wikimedia.org/wikipedia/en/d/dc/GroundskeeperWillie.png
 *
 * @author Luis Couto
 * @organization 15minuteslate.net
 * @contact couto@15minuteslate.net
 * @version 0.1.11
 * @requires falafel, stream, util, esprima
 * @license ISC 2014, Luis Couto
 */


// Dependencies
var stream = require('stream'),
    util = require('util'),
    esprima = require('esprima'),
    falafel = require('falafel'),
    type = esprima.Syntax;

// Debug
if (process.env.NODE_DEBUG) { console.dir = require('cdir'); }

/**
 * Groundskeeper
 *
 * @constructor
 * @extends Stream
 * @param {Object} options
 * @example
 *      var cleaner = new Groundskeepr({
 *          console: true,                          // Keep console logs
 *          debugger: true                          // Keep debugger; statements
 *          pragmas: ['validation', 'development'], // Keep pragmas with the following identifiers
 *          namespace: ['App.logger']               // Instead of console search for functions in the given namespaces
 *      });
 *
 * @TODO esprima doesn't support streams as far as I can tell, which is a shame
 *       so... or Groundskeeper makes up for it... or I should take a look at
 *       esprima to see how hard it is to support streams (luls...)
 *        => http://code.google.com/p/esprima/issues/detail?id=92&q=Enhancement
 */
function Groundskeeper(options) {
    stream.Stream.call(this);
    this.buffer = '';
    this.writable = true;
    this.options = options || {};

    // Accept string or array. Don't break backward compatibility.
    if (typeof this.options.namespace === 'string') {
        this.options.namespace = [this.options.namespace];
    }

    if (!this.options.replace) {
        this.options.replace = '';
    }
}

util.inherits(Groundskeeper, stream.Stream);

/**
 * [write description]
 * @method
 * @param   {[type]} data [description]
 * @returns {[type]}      [description]
 * @public
 */
Groundskeeper.prototype.write = function (data) {
    if (data && data.length) {
        this.buffer += this.clean(data.toString());
        this.emit('data', this.buffer);
    }
};

/**
 * [end description]
 * @method
 * @param   {[type]} data [description]
 * @returns {[type]}      [description]
 * @public
 */
Groundskeeper.prototype.end = function (data) {
    if (data && data.length) { this.write(data); }
    this.emit('end', this.buffer);
};

/**
 * [clean description]
 * @method
 * @param   {[type]} data [description]
 * @returns {[type]}      [description]
 * @public
 */
Groundskeeper.prototype.clean = function (data) {

    var ast = esprima.parse(data, {
            comment: true,
            tolerant: true,
            range: true
        }),

        source = this.removePragmas(
            ast.comments,
            data,
            (this.options.pragmas || [])
        );

    return falafel(source, function (node) {

        if (this.options.namespace) {
            this.removeNamespace(node, this.options.namespace);
        }

        if (!this.options.console) {
            this.removeConsole(node);
        }

        if (!this.options['debugger']) {
            this.removeDebugger(node);
        }

    }.bind(this));

};

/**
 * [removeConsole description]
 * @method
 * @param   {[type]} node [description]
 * @returns {[type]}      [description]
 * @api private
 */
Groundskeeper.prototype.removeConsole = function (node) {

    if (node.type === type.Identifier && node.source() === 'console') {
        while (node && node.type !== type.MemberExpression) {
            node = node.parent;
        }

        if (node &&
            node.parent.type === type.MemberExpression &&
            (
                node.parent.source().indexOf('window') !== -1 ||
                node.parent.source().indexOf('global') !== -1
            )
        ) {
            node = node.parent;
        }


        if (node && node.parent.type === type.CallExpression) {
            node = node.parent;

            if (node.parent.type === type.ExpressionStatement) {
                node = node.parent;
            }

            node.update(this.options.replace);
        }
    }
};

/**
 * [removeNamespace description]
 * @method
 * @param   {[type]} node      [description]
 * @param   {[type]} namespace [description]
 * @returns {[type]}           [description]
 * @api private
 */
Groundskeeper.prototype.removeNamespace = function (node, namespace) {

    if ([type.MemberExpression, type.Identifier].indexOf(node.type) !== -1 &&
        namespace.indexOf(node.source()) !== -1) {

        while ([type.CallExpression, type.AssignmentExpression, type.FunctionDeclaration,
                type.VariableDeclaration].indexOf(node.type) === -1) {
            node = node.parent;
        }

        // Remove the whole call expression group like `func().bFunc().cFunc()`.
        // We can recognize such structure by checking `CallExpression` and
        // `MemberExpression` occurrence (in this order),
        // where there are not two `CallExpression`s in a row.
        var TYPES = [type.CallExpression, type.MemberExpression],
            CALL_EXPR_TYPE_INDEX = TYPES.indexOf(type.CallExpression);

        // `CallExpression` has to be recognized firstly to keep `alert()` in `alert(log())`
        var last = CALL_EXPR_TYPE_INDEX;

        while (node.parent) {
            // recognize `node.parent` type
            var index = TYPES.indexOf(node.parent.type);

            // require that index has been recognized and it's not second `CallExpression` again
            if (index === -1 || (index === CALL_EXPR_TYPE_INDEX && index === last)) break;

            // go forward
            node = node.parent;
            last = index;
        }

        if (node.parent.type === type.ExpressionStatement) {
            node = node.parent;
        }

        node.update(this.options.replace);

    }

};

/**
 * [removeDebugger description]
 *
 * @api private
 * @method
 * @param   {[type]} node [description]
 * @returns {[type]}      [description]
 */
Groundskeeper.prototype.removeDebugger = function (node) {

    if (node.type === type.DebuggerStatement) {
        node.update('');
    }
};

/**
 * [removePragmas description]
 *
 * @api private
 * @method
 * @param   {[type]} comments [description]
 * @param   {[type]} source   [description]
 * @param   {[type]} pragmas  [description]
 * @returns {[type]}          [description]
 */
Groundskeeper.prototype.removePragmas = function (comments, source, pragmas) {

    var pragmaMatcher = /^[<][/]*([^\s]*)[>]$/,
        // find comments' ranges
        ranges = comments
            .map(function (comment) {

                var matches = pragmaMatcher.exec(comment.value.trim()),
                    pragmaName = matches && matches[1];

                // if the comment
                // * only contains a `pragma`
                // * that pragma is not on the pragmas keep list
                if (
                    pragmaName &&
                    pragmas.indexOf(pragmaName) === -1
                ) {
                    return comment.range;
                }

            })
            .filter(function (val) {
                return (val && val.length);
            })
            .map(function (range, index) {
                return (index % 2 === 0) ? range[0] : range[1];
            }),
        // remove
        start = 0,
        end = 0,
        match = '',
        finalsource = "";

    if (ranges && ranges.length) {
        while (ranges.length) {
            finalsource += source.slice(start, ranges.shift());
            start = ranges.shift();
        }

        finalsource += source.slice(start, source.length);
        return finalsource;
    } else {
        return source;
    }


};

/**
 * Describe what this method does
 * @private
 * @param {String|Object|Array|Boolean|Number} paramName Describe this parameter
 * @returns Describe what it returns
 * @type String|Object|Array|Boolean|Number
 */

Groundskeeper.prototype.toString = function () {
    return this.buffer;
};

module.exports = function (options) {
    return new Groundskeeper(options);
};
