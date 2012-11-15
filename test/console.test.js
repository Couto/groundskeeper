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
    'remove console statements': function () {
        var file = fixture('example'),
            cleaner = groundskeeper();

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('console'), -1);
    },

    'remove console statements minified': function () {
        var file = fixture('example.min'),
            cleaner = groundskeeper();

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('console'), -1);
    }
};
