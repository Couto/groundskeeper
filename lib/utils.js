// Modules
var log = require('./log'),
    fs = require('fs'),
    path = require('path'),
    // Shortcuts
    toString = Object.prototype.toString,
    exists = fs.exists,
    normalize = path.normalize,
    join = path.join;

/**
 * Given a path, check if the dir exists and create if it doesn't
 * This function will recursevily create folders.
 *
 * @function
 * @param {String} dirPath '/Users/Couto/destinationFolder'
 * @param {String} mode '0644' fallsback to '0777'
 * @param {Function} [callback]
 */
exports.mkdir = function (dirPath, mode, callback) {
    var dest = normalize(dirPath).split('/'),
        callback = (toString.call(mode) === '[object Function]') ? mode : callback;
        mode = (toString.call(mode) === '[object String]') ? mode : '0777';

    log.info('creating folder at: %s', dest.join('/'));

    (function walk(path) {
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
                        return log.error('failed to create folder: %s because: %s', path, err);
                    }
                });

            } else if (exists && dest.length) {
                walk(normalize(path + '/' + dest.shift()));
            } else {
                if (callback) {
                    callback(undefined, path);
                }
            }
        });

    }(dest.shift()));
};

/**
 * Given a path, it will call a callback function for each folder and file
 * that it finds. That function will receive the file/folder path and the
 * respective Fs.Stats object
 *
 * @function
 * @public
 * @param    {String}   dirPath  folder to read
 * @param    {Function} callback function that will be called at each file and folder
 *
 *
 * @TODO find a way to call a callback when the reading process ends
 */
exports.readDirRecursive = function (dirPath, callback) {
    dirPath = normalize(dirPath);

    fs.readdir(dirPath, function (err, files) {
        if (err) { return log.error('could not read: %s, because: %s', dirPath, err); }

        (function walk(file) {
            if (file) {
                log.info('reading file: %s', join(dirPath, file));
                fs.stat(join(dirPath, file), function (err, stats) {

                    if (callback) { callback(join(dirPath, file), stats); }
                    if (stats.isDirectory()) {
                        exports.readDirRecursive(join(dirPath, file), callback);
                    }

                    if (files.length) { walk(files.shift()); }

                });
            }
        }(files.shift()));
    });
};

/**
 * Given a folder, it will read all it's files and folders and replicate
 * its structure on the given output folder
 * The callback is called at each file/folder created
 * Note that files contents are not copied.
 *
 * @function
 * @public
 * @param    {String}   dirPath    Folder that will be copied
 * @param    {String}   outputPath Folder that will receive the structure
 * @param    {Function} callback   function that will be called at each file and folder
 *
 * @TODO find a way to call a callback when the mirroring process ends
 */
exports.mirror = function (dirPath, outputPath, callback) {
    dirPath = normalize(dirPath);
    outputPath = normalize(outputPath);

    exports.mkdir(outputPath, function (err, path) {
        exports.readDirRecursive(dirPath, function (file, stat) {

            if (file && stat.isDirectory()) {
                exports.mkdir(file.replace(dirPath, outputPath));
            } else if (file && stat.isFile()) {
                exports.touch(file.replace(dirPath, outputPath));
            }

            if (callback) { callback(file, file.replace(dirPath, outputPath)); }
        });
    });

};

/**
 * Remove a file or a directory
 *
 * @function
 * @param {String} dirPath '/Users/Couto/example.js'
 * @param {Function} [callback]
 */
exports.rm = function (dirPath, callback) {
    var rmCallback = function (err) {
        if (err) { return log.error('could not remove: %s, because: %s', dirPath, err); }
        log.success('removed: %s', dirPath);
        if (callback) { callback(dirPath); }
    };

    fs.stat(dirPath, function (err, stat) {
        if (err) { return log.error('could not remove: %s, because: %s', dirPath, err); }

        if (stat.isDirectory()) { fs.rmdir(dirPath, rmCallback); }
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
exports.touch = function (filePath, callback) {
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
exports.tee = function (filePath, data, callback) {
    exists(filePath, function (exist) {
        if (exist) {
            fs.writeFile(filePath, data, 'utf-8', function (err) {
                if (err) { return log.error('failed to write to file: %s because: %s', filePath, err); }
                log.success('wrote file %s', filePath);
                if (callback) { callback(filePath); }
            });
        } else {
            exports.touch(filePath, exports.tee.bind(null, filePath, data, callback));
        }
    });
};
