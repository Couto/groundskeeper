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

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');

        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger statements': function () {
        var file = fixture('namespaced/App.logger'),
            clean = fixture('namespaced/App.logger.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger'
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger.log statements minified': function () {
        var file = fixture('namespaced/App.logger.log.min'),
            clean = fixture('namespaced/App.logger.log.min.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger.log'
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);
    },

    'remove App.logger statements minified': function () {
        var file = fixture('namespaced/App.logger.min'),
            clean = fixture('namespaced/App.logger.min.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': 'App.logger'
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);
    },

    'remove array of namespaces': function () {
        var file = fixture('namespaced/Sushi'),
            clean = fixture('namespaced/Sushi.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': ['Sushi.log', 'Sushi.warn', 'Sushi.error']
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);
    },

    'remove array of namespaces minified': function () {
        var file = fixture('namespaced/Sushi.min'),
            clean = fixture('namespaced/Sushi.min.clean'),
            cleaner = groundskeeper({
                'console': true,
                'pragmas': ['validation', 'development'],
                'debugger': true,
                'namespace': ['Sushi.log', 'Sushi.warn', 'Sushi.error']
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);
    },
    'remove alert': function () {
        var source = 'alert("something");',
            clean = '',
            cleaner = groundskeeper({
                'namespace': ['alert']
            });

        var start = +new Date();
        cleaner.write(source);
        console.log(+new Date() - start + ' ms');
        assert.equal(cleaner.toString(), clean);

    }
};
