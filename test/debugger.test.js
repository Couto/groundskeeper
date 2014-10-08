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
    'remove debugger statements': function () {
        var file = fixture('debugger/debugger'),
            clean = fixture('debugger/debugger.clean'),
            cleaner = groundskeeper({
                console: true,
                pragmas: ['validation', 'development']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    }

};
