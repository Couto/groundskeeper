// Modules
var log = require('./Logger'),
    fs = require('fs'),
    path = require('path'),
    // Shortcuts
    toString = Object.prototype.toString,
    exists = path.exists,
    normalize = path.normalize;

/**
 * Given a path, check if the dir exists and create if it doesn't
 * This function will recursevily create folders.
 *
 * @function
 * @param {String} dirPath '/Users/Couto/destinationFolder'
 * @param {String} mode '0644' fallsback to '0777'
 * @param {Function} [callback]
 */
module.exports.mkdir = function (dirPath, mode, callback) {
    var dest = dirPath.split('/'),
        callback = (toString.call(mode) === '[object Function]') ? mode : callback;
        mode = (toString.call(mode) === '[object String]') ? mode : '0777';

    log.info('creating output folder at: %s', dest);

    (function walk(path) {
        path = normalize('/' + path);
        exists(path, function (exist) {
            if (!exist) {

                fs.mkdir(path, mode, function (err) {
                    if (!err) {
                        log.success('created folder at: %s', path);
                        if (dest.length) {
                            walk(normalize(path + '/' + dest.shift()));
                        } else if (!dest.length && callback) {
                            return callback(err, path);
                        }
                    } else {
                        log.error('failed to create folder: %s because: %s', path, err);
                        callback(err, path);
                    }
                });

            } else { walk(normalize(path + '/' + dest.shift())); }
        });

    }(dest.shift()));
};
/**
 * Remove a file or a directory
 *
 * @function
 * @param {String} dirPath '/Users/Couto/example.js'
 * @param {Function} [callback]
 */
module.exports.rm = function (dirPath, callback) {
    var rmCallback = function (err) {
        if (err) { return log.error('could not remove: %s, because: %s', dirPath, err); }
        log.success('removed: %s', dirPath);
        if (callback) { callback(dirPath); }
    };

    fs.stat(dirPath, function (err, stat) {
        if (err) { return log.error('could not remove: %s, because: %s', dirPath, err); }

        if (stat.isDirectory()) {fs.rmdir(dirPath, rmCallback); }
        else { fs.unlink(dirPath, rmCallback); }
    });
};

/**
 * Create file if doesn't exist
 * Update file's timestamp if exists
 *
 * @function
 * @param {String} filePath '/Users/Couto/.vimrc'
 * @param {Function} [callback]
 */
module.exports.touch = function (filePath, callback) {
    var touchCallback = function (err) {
        if (err) { return log.error('failed to touch file: $s because: %s', filePath, err); }
        log.success('touched file: %s', filePath);
        if (callback) { callback(filePath); }
    };

    exists(filePath, function (exist) {
        if (exist) {
            fs.utimes(filePath, new Date(), new Date(), touchCallback);
        } else { fs.writeFile(filePath, '', 'utf-8', touchCallback); }
    });
};

/**
 * Insert data into file
 * if file doesn't exist, uses touch() to create the file and then inserts
 * the data
 *
 * @function
 * @param {String} filePath
 * @param {String} data
 * @param {Function} [callback]
 */
module.exports.tee = function (filePath, data, callback) {
    exists(filePath, function (exist) {
        if (exist) {
            fs.writeFile(filePath, data, 'utf-8', function (err) {
                if (err) { return log.error('failed to write to file: %s because: %s', filePath, err); }
                log.success('wrote file %s', filePath);
                if (callback) { callback(filePath); }
            });
        } else {
            module.exports.touch(filePath, module.exports.tee.bind(null, filePath, data, callback));
        }
    });
};
