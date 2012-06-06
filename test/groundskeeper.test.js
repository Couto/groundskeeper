/**
 * Module dependencies.
 */

var groundskeeper = require('../'),
    should = require('should'),
    fs = require('fs');

function fixture(name, fn) {
    fs.readFile(__dirname + '/fixtures/' + name + '.js', 'utf8', fn);
}

module.exports = {
    '.version should have semantic format': function () {
        groundskeeper.version.should.match(/^\d+\.\d+\.\d+$/);
    },

    '.removeConsole should remove all consoles' : function () {
        fixture('console', function (err, data) {
            var data = groundskeeper.removeConsole(data);
            data.indexOf('console').should.equal(-1);
        });

        fixture('console.min', function (err, data) {
            var data = groundskeeper.removeConsole(data);
            data.indexOf('console').should.equal(-1);
        });
    },

    '.removePragmas should remove all pragmas' : function () {
        fixture('pragma', function (err, data) {
            var data = groundskeeper.removePragma(data, { pragmas: ['validation']});
            data.indexOf('Array.prototype').should.equal(-1);
        });
    }
};
