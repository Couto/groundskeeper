/**
 * Module dependencies.
 */

var groundskeeper = require('../'),
    assert = require('assert'),
    fs = require('fs'),
    fixture = function (name) {
        return fs.readFileSync(__dirname + '/fixtures/' + name + '.js', 'utf8');
    };

module.exports = {
    'remove pragmas': function () {
        var file = fixture('pragmas/'),
            clean = fixture('pragmas/'),
            cleaner = groundskeeper({
                console: true,
                debugger: true,
                pragmas: ['']
            })
    },

    'remove validation pragma only': function () {
        var file = fixture('pragmas/'),
            clean = fixture('pragmas/'),
            cleaner = groundskeeper({
                console: true,
                debugger: true,
                pragmas: ['']
            })
    },

    'remove development pragma only': function () {
        var file = fixture('pragmas/'),
            clean = fixture('pragmas/'),
            cleaner = groundskeeper({
                console: true,
                debugger: true,
                pragmas: ['']
            })
    }
};
