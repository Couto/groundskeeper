var Log = require('log'),
    colors = require('colors');

// Duck Punch the logger
// "... if it walks like a duck and talks like a duck, it's a duck, right? So if
// this duck is not giving you the noise that you want, you've got to just
// punch that duck until it returns what you expect."

Log.SUCCESS = Log.INFO;

Log.prototype.success = function () {
    arguments[0] = ' ✔ '.green + arguments[0];
    this.log('SUCCESS', arguments);
};

Log.prototype.info = function () {
    arguments[0] = '    ➔ '.black + arguments[0];
    this.log('INFO', arguments);
};

Log.prototype.error = function () {
    arguments[0] = '   ✘ '.red + arguments[0];
    this.log('ERROR', arguments);
    throw new Error(arguments[arguments.length - 1]);
};

module.exports = new Log('error').colorful({
    SUCCESS : '\033[0;37m',
    INFO : '\033[0;37m',
    ERROR : '\033[0;37m'
});
