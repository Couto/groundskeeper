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
        var file = fixture('pragmas/pragmas'),
            clean = fixture('pragmas/pragmas.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove pragmas that are in block comments': function () {
        var file = fixture('pragmas/block-comment'),
            clean = fixture('pragmas/block-comment.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove validation pragma only': function () {
        var file = fixture('pragmas/validation'),
            clean = fixture('pragmas/validation.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true,
                pragmas: ['development']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove development pragma only': function () {
        var file = fixture('pragmas/development'),
            clean = fixture('pragmas/development.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true,
                pragmas: ['validation']
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },

    'remove pragma with non-alphanumeric characters in the name': function () {
        var file = fixture('pragmas/non-alphanumeric'),
            clean = fixture('pragmas/non-alphanumeric.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });

        cleaner.write(file);
        assert.equal(cleaner.toString(), clean);
    },
    'error on unmatched pragmas': function () {
        var file = fixture('pragmas/unmatched'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });
        assert.throws(
            function(){ cleaner.write(file); },
            function(err){return err.toString().indexOf('"unmatched" directive was encountered') !== -1;});
    },
    'error on trailing pragmas': function () {
        var file = fixture('pragmas/trailing'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });
        assert.throws(
            function(){ cleaner.write(file); },
            function(err){return err.toString().indexOf('Groundskeeper: encountered trailing pragma directive.') !== -1;});
    }
};
