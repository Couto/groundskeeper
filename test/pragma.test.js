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

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');

        assert.equal(cleaner.toString(), clean);
    },

    'remove pragmas that are in block comments': function () {
        var file = fixture('pragmas/block-comment'),
            clean = fixture('pragmas/block-comment.clean'),
            cleaner = groundskeeper({
                console: true,
                'debugger': true
            });

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');

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

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');

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

        var start = +new Date();
        cleaner.write(file);
        console.log(+new Date() - start + ' ms');

        assert.equal(cleaner.toString(), clean);
    }
};
