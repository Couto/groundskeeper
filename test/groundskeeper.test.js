
/**
 * Module dependencies.
 */

var groundskeeper = require('../'),
    should = require('should'),
    fs = require('fs');

function fixture(name, fn) {
    fs.readFile(__dirname + '/fixtures/' + name, 'utf8', fn);
}

module.exports = {
    'test .version': function () {
        groundskeeper.version.should.match(/^\d+\.\d+\.\d+$/);
    }
};
