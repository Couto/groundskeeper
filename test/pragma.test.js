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
        var file = fixture('example'),
            cleaner = groundskeeper();

        cleaner.write(file);

        assert.equal(cleaner.toString().indexOf('<validation>'), -1);
        assert.equal(cleaner.toString().indexOf('clean(\'this\').validationPragma;'), -1);
        assert.equal(cleaner.toString().indexOf('</validation>'), -1);

        assert.equal(cleaner.toString().indexOf('<development>'), -1);
        assert.equal(cleaner.toString().indexOf('clean(\'this\').developmentPragma;'), -1);
        assert.equal(cleaner.toString().indexOf('</development>'), -1);

    },

    'remove specified pragma only': function () {
        var file = fixture('example'),
            cleaner = groundskeeper({
                pragmas: ['validation'] //keep validation, remove development
            });

        cleaner.write(file);

        assert.notEqual(cleaner.toString().indexOf('<validation>'), -1);
        assert.notEqual(cleaner.toString().indexOf('clean(\'this\').validationPragma;'), -1);
        assert.notEqual(cleaner.toString().indexOf('</validation>'), -1);

        assert.equal(cleaner.toString().indexOf('<development>'), -1);
        assert.equal(cleaner.toString().indexOf('clean(\'this\').developmentPragma;'), -1);
        assert.equal(cleaner.toString().indexOf('</development>'), -1);

    }
};
