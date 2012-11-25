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
    'remove App.logger.log statements': function () {
        var file = fixture('namespaced/App.logger.log'),
            clean = fixture('namespaced/App.logger.log.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger.log'
            });

        cleaner.write(file);
        console.log(cleaner.toString())
        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger statements': function () {
        var file = fixture('namespaced/'),
            clean = fixture('namespaced/'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger.log statements minified': function () {
        var file = fixture('namespaced/'),
            clean = fixture('namespaced/'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger.log'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger statements minified': function () {
        var file = fixture('namespaced/'),
            clean = fixture('namespaced/'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.log'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove array of namespaces': function () {
        var file = fixture('namespaced/'),
            clean = fixture('namespaced/'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': ['Sushi.log', 'Sushi.warn', 'Sushi.error']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove array of namespaces minified': function () {
        var file = fixture('namespaced/'),
            clean = fixture('namespaced/'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': ['Sushi.log', 'Sushi.warn', 'Sushi.error']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    }
};
