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
        var file = fixture('console/console'),
            clean = fixture('console/console.clean'),
            cleaner = groundskeeper({
                debugger: true,
                pragmas: ['validation', 'development']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove console statements minified': function () {
        var file = fixture('console/console.min'),
            clean = fixture('console/console.min.clean'),
            cleaner = groundskeeper({
                debugger: true,
                pragmas: ['validation', 'development']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    }
};
