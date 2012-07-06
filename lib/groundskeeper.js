var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    log = require('./log'),
    time,
    regexp = {
        console: /console\.(assert|count|debug|dir(xml)?|error|group(Collapsed|End)?|info|log|markTimeline|profile(End)?|time(End|Stamp)?|trace|warn)+\(+(\S|, | |\:*)+\);*/gi,
        pragma: /\/\/ *<\/?(\w*)>/i
    };

exports.version = "0.0.4444";

exports.parseDirectory = function (options) {
    utils.mirror(options.input, options.output, function (dirFile, outputFile) {
        fs.stat(dirFile, function (err, stats) {
            if (stats.isFile()) {
                fs.readFile(dirFile, 'utf8', function (err, data) {

                    if (options.console) {
                        log.info('removing all consoles from file: %s', dirFile);
                        data = exports.removeConsole(data);
                        log.success('removed all consoles from file: %s', file);
                    }

                    if (options.pragmas.length) {
                        log.info('removing all pragmas from file: %s', file);
                        data = exports.removePragma(data, options);
                        log.success('removed all pragmas from file: %s', file);
                    }

                    utils.tee(outputFile, data);
                });
            }
        });
    });
};

/**
 * Remove pragma statments from the given data
 *
 * @function
 * @param {String} data Code in utf8
 * @returns {String} data without console
 */
exports.removePragma = function (data, options) {
    var splitted = data.split(regexp.pragma),
        len = splitted.length,
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
    return splitted.filter(function (a) { return a !== null; }).join('');
};

/**
 * Remove console statments from the given data
 *
 * @function
 * @param {String} data Code in utf8
 * @returns {String} data without console
 */
exports.removeConsole = function (data) {
    return data.replace(regexp.console, '');
};

exports.groundskeeper = function (options) {

    fs.stat(options.input, function (err, stats) {
        if (err) { return log.error('could not retrieve status of: %s, because %s', options.input, err); }
        if (stats.isDirectory()) { exports.parseDirectory(options); }
    });

};
