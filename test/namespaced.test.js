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
        var file = fixture('example'),
            cleaner = groundskeeper({
                namespace: 'App.logger.log'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('App.logger.log'), -1);
        assert.notEqual(cleaner.toString().indexOf('App.logger.warn'), -1);
    },

    'remove App.logger statements': function () {
        var file = fixture('example'),
            cleaner = groundskeeper({
                namespace: 'App.logger'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('App.logger'), -1);
    },

    'remove App.logger.log statements minified': function () {
        var file = fixture('example.min'),
            cleaner = groundskeeper({
                namespace: 'App.logger.log'
            });

        cleaner.write(file);

        assert.equal(cleaner.toString().indexOf('App.logger.log'), -1);
        assert.notEqual(cleaner.toString().indexOf('App.logger.warn'), -1);

    },

    'remove App.logger statements minified': function () {
        var file = fixture('example.min'),
            cleaner = groundskeeper({
                namespace: 'App.logger'
            });

        cleaner.write(file);
        assert.equal(cleaner.toString().indexOf('App.logger'), -1);
    }
};
