var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    log = require('./log'),
    time,
    regexp = {
        console: /console\.(assert|count|debug|dir(xml)?|error|group(Collapsed|End)?|info|log|markTimeline|profile(End)?|time(End|Stamp)?|trace|warn)+\(+(.|)+\);*/gi,
        pragma: /\/\/<\/?(\w*)>/i
    };

/**
 * Given a file, searches for console statements and pragmas
 * and removes them if the options are true
 *
 * @function
 * @private
 *
 * @param {String}      file
 * @param {Object}      opts
 * @param {Function}    [callback]
 */
function clean(file, options, callback) {
    log.info('reading file %s', file);
    fs.readFile(file, 'utf-8', function (err, data) {
        var splitted,
            clean,
            len = 0,
            i = 0;

        if (err) { return console.error('%s', err); }

        log.success("read file: %s", file);

        if (options.console) {
            log.info('removing all consoles from file: %s', file);
            data = data.replace(regexp.console, '');
            clean = data;
            log.success('removed all consoles from file: %s', file);
        }

        if (options.pragmas.length) {
            log.info('removing all pragmas from file: %s', file);
            splitted = data.split(regexp.pragma);
            len = splitted.length;
            i = 0;

            // Remove pragmas
            for (i; i < len; i += 1) {
                if (options.pragmas.indexOf(splitted[i]) !== -1) {
                    splitted[i] = null;
                    splitted[i + 1] = null;
                    splitted[i + 2] = null;
                }
            }

            // Filter array to remove null element
            // so that we can generate a pretty output;
            clean = splitted.filter(function (a) { return a !== null; }).join('');

            log.success('removed all pragmas from file: %s', file);
        }

        if (callback) { callback(file, clean); }
    });
};

function parseDirectory(options) {
    utils.mirror(options.input, options.output, function (dirFile, outputFile) {
        fs.stat(dirFile, function (err, stats) {
            if (stats.isFile()) {
                clean(dirFile, options, function (file, data) {
                    utils.tee(outputFile, data);
                });
            }
        });
    });
}


exports.version = "0.0.1";

exports.groundskeeper = function (options) {

    fs.stat(options.input, function (err, stats) {
        if (err) { return log.error('could not retrieve status of: %s, because %s', options.input, err); }
        if (stats.isDirectory()) { parseDirectory(options); }
        else { log.error('Please provide an input folder and an output folder'); }
    });

};
