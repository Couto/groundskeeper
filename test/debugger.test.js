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
        var file = fixture('example'),
            cleaner = groundskeeper();

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('debugger'), -1);
    },

    'remove debugger statements minified': function () {
        var file = fixture('example.min'),
            cleaner = groundskeeper();

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('debugger'), -1);
    }
};
