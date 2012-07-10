/**
 * Module dependencies.
 */

var load = function (file) {
        var lib = (process.env.NODE_ENV === 'COVERAGE') ? 'coverage' : 'lib';
        return require('../' + lib + '/' + file);
    },
    uglify = require('uglify-js'),
    groundskeeper = load('groundskeeper'),
    log = load('log'),
    utils = load('utils'),
    should = require('should'),
    fs = require('fs'),
    path = require('path'),
    exists = fs.exists;

function fixture(name, fn) {
    fs.readFile(__dirname + '/fixtures/' + name + '.js', 'utf8', fn);
}

module.exports = {
    'groundskeeper': {
        '.version should have semantic format': function () {
            groundskeeper.version.should.match(/^\d+\.\d+\.\d+$/);
        },

        '.removeConsole() with RegEx should remove all consoles': function (done) {

            fixture('console', function (err, data) {
                var content = groundskeeper.removeConsole(data);


                fixture('console.clean', function (err, clean) {
                    var cleanAST = JSON.stringify(uglify.parser.parse(clean)),
                        dirtyAST = JSON.stringify(uglify.parser.parse(content));

                    cleanAST.should.equal(dirtyAST);
                    content.indexOf('console').should.equal(-1);

                    done();
                });

            });

        },

        '.removeConsole() with AST should remove all consoles': function (done) {

            fixture('console', function (err, data) {
                var content = groundskeeper.removeConsole(data, true);


                fixture('console.clean', function (err, clean) {
                    var cleanAST = JSON.stringify(uglify.parser.parse(clean)),
                        dirtyAST = JSON.stringify(uglify.parser.parse(content));

                    cleanAST.should.equal(dirtyAST);
                    content.indexOf('console').should.equal(-1);

                    done();
                });

            });

        },

        '.removePragmas() should remove all pragmas': function (done) {
            fixture('pragma', function (err, data) {
                var content = groundskeeper.removePragma(data, { pragmas: ['validation', 'optional']});


                fixture('pragma.clean', function (err, data) {
                    var cleanAST = JSON.stringify(uglify.parser.parse(data)),
                        dirtyAST = JSON.stringify(uglify.parser.parse(content));

                    content.indexOf('Array.prototype').should.equal(-1);
                    content.indexOf('Object.keys').should.equal(-1);
                    cleanAST.should.equal(dirtyAST);

                    done();
                });

            });
        }
    },

    'utils' : {
        '.mkdir() should create successive folders' : function (done) {
            utils.mkdir('./test/testFolder1/testFolder12/testFolder13', function () {
                exists('./test/testFolder1/testFolder12/testFolder13', function (exist) {
                    exist.should.be.true;
                    done();
                });
            });
        },

        '.rm() should remove empty folders' : function (done) {
            utils.rm('./test/testFolder1/testFolder12/testFolder13', function () {
                exists('./test/testFolder1/testFolder12/testFolder13', function (exist) {
                    exist.should.be.false;
                    done();
                });
            });
        }
    }
};
