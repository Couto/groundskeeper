/**
 * Module dependencies.
 */

var load = function (file) {
        var lib = (process.env.NODE_ENV === 'COVERAGE') ? 'coverage' : 'lib';
        return require('../' + lib + '/' + file);
    },
    groundskeeper = load('groundskeeper'),
    log = load('log'),
    utils = load('utils'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    cdir = require('cdir');

function fixture(name, fn) {
    fs.readFile(__dirname + '/fixtures/' + name + '.js', 'utf8', fn);
}

module.exports = {
    'groundskeeper': {
        '.version should have semantic format': function () {
            groundskeeper.version.should.match(/^\d+\.\d+\.\d+$/);
        },

        '.removeConsole() should remove all consoles': function (done) {

            fixture('console', function (err, data) {
                var data = groundskeeper.removeConsole(data);
                data.indexOf('console').should.equal(-1);
                done()
            });
        },

        '.removeConsole() should remove all consoles from minified code': function (done) {
            fixture('console.min', function (err, data) {
                var data = groundskeeper.removeConsole(data);
                data.indexOf('console').should.equal(-1);
                done();
            });
        },

        '.removePragmas() should remove all pragmas': function (done) {
            fixture('pragma', function (err, data) {
                var data = groundskeeper.removePragma(data, { pragmas: ['validation', 'optional']});
                data.indexOf('Array.prototype').should.equal(-1);
                data.indexOf('Object.keys').should.equal(-1);
                done();
            });
        }
    },

    'utils' : {
        '.mkdir() should create successive folders' : function (done) {
            utils.mkdir('./test/testFolder1/testFolder12/testFolder13', function () {
                path.exists('./test/testFolder1/testFolder12/testFolder13', function (exist) {
                    if (exist) {
                        done();
                    } else {
                        throw new Error();
                    }
                });
            });
        },

        '.rm() should remove empty folders' : function (done) {
            utils.rm('./test/testFolder1/testFolder12/testFolder13', function () {
                path.exists('./test/testFolder1/testFolder12/testFolder13', function (exists) {
                    if (exists) {
                        throw new Error();
                    } else {
                        done();
                    }
                });
            });
        },

        '.rm() should throw error on non-empty folders': function (done) {
            utils.rm('./test/testFolder1', function () {
                done();
            });
        }
    }
};
