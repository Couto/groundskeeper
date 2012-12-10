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
 * @version 0.1.1
 * @requires falafel, stream, util, esprima
 * @license http://couto.mit-license.org MIT
 */


// Dependencies
var stream = require('stream'),
    util = require('util'),
    esprima = require('esprima'),
    falafel = require('falafel');

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
            this.options.pragmas
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

    if (node.type === 'Identifier' && node.source() === 'console') {
        while (node.type !== 'MemberExpression') {
            node = node.parent;
        }

        if (
            node.parent.type === 'MemberExpression' &&
            (
                node.parent.source().indexOf('window') !== -1 ||
                node.parent.source().indexOf('global') !== -1
            )
        ) {
            node = node.parent;
        }


        if (node.parent.type === 'CallExpression') {
            node = node.parent;

            if (node.parent.type === 'ExpressionStatement') {
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

    if (node.type === 'MemberExpression' && namespace.indexOf(node.source()) !== -1) {

        while (node.type !== 'CallExpression') {
            node = node.parent;
        }

        if (node.parent.type === 'ExpressionStatement') {
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

    if (node.type === 'DebuggerStatement') {
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
    var pragmaMatcher = /^<\/*(\w+)>$/,
        // find comments' ranges
        ranges = comments
            .map(function (comment) {
                if (
                    (!pragmas && (pragmaMatcher).test(comment.value)) ||
                    (pragmas && pragmas.length && pragmas.indexOf(comment.value.replace(pragmaMatcher, '$1')) === -1)
                ) { return comment.range; }

                return [false, false];

            })
            .map(function (range, index) {
                return (index % 2 === 0) ? range[0] : range[1];
            }),
        // remove
        start = 0,
        end = 0,
        match = '';

    while (ranges.length) {
        end = ranges.pop();
        start = ranges.pop();

        if (start && end) {
            match = source.slice(start, end);
            source = source.replace(match, '');
        }
    }

    return source;

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
