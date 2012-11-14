/**
 * Module dependencies.
 */

var groundskeeper = require('../'),
    assert = require('assert'),
    fixture = function (name) {
        return fs.readFileSync(__dirname + '/fixtures/' + name + '.js', 'utf8');
    };

module.exports = {};
