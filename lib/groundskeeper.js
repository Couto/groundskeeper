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
 * @version 0.1.0
 * @requires falafel, stream, util, winston
 * @license http://couto.mit-license.org MIT
 */

module.exports = (function () {
    'use strict';

    // Dependencies
    var stream = require('stream'),
        util = require('util'),
        falafel = require('falafel');

    /**
     * Groundskeeper
     *
     * @constructor
     * @param {Object} options
     * @example
     *      var cleaner = new Groundskeepr({
     *          console: true,                          // Keep console logs
     *          debugger: true                          // Keep debugger; statements
     *          pragmas: ['validation', 'development'], // Keep pragmas with the following identifiers
     *          namespace: 'App.logger'                 // Instead of console search for functions in the given namespace
     *      });
     */
    function Groundskeeper(options) {
        stream.Stream.call(this);
        this.writable = true;
        this.buffer = '';
        this.options = options;
    }

    util.inherits(Groundskeeper, stream.Stream);

    Groundskeeper.prototype.write = function (data) {
        if (data && data.length) {
            this.buffer += this.clean(data.toString());
            this.emit('data', this.buffer);
        }
    };

    Groundskeeper.prototype.end = function (data) {
        this.write(data);
        this.emit('end', this.buffer);
    };

    Groundskeeper.prototype.isValid = function (node) {
        var namespace = (this.namespace) ? this.namespace.split('.') : ['console'];
    };

    Groundskeeper.prototype.clean = function (data) {

        return falafel(data, {
            comment: true,
            tolerant: true
        }, function (node) {

            if (
                !this.options.console &&
                node.type === "Identifier" &&
                node.source() === (this.options.namespace || 'console')
            ) {

                while (node.type !== 'ExpressionStatement') {
                    node = node.parent;
                }

                node.update('');
            }

        }.bind(this));
    };

    Groundskeeper.prototype.toString = function () {
        return this.buffer;
    };

    return Groundskeeper;

}());
