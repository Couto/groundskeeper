var Log = require('log'),
    log;

// Duck Punch the logger
// "… if it walks like a duck and talks like a duck, it’s a duck, right? So if
// this duck is not giving you the noise that you want, you’ve got to just
// punch that duck until it returns what you expect."
Log.SUCCESS = Log.INFO;

Log.prototype.success = function (msg) {
    msg = ' ✔ '.green + msg;
    this.log('SUCCESS', arguments);
};

Log.prototype.info = function (msg) {
    msg = '    ➔ '.black.bold + msg;
    this.log('INFO', arguments);
};

Log.prototype.notice = function (msg) {
    msg = '  ❯ '.cyan + msg;
    this.log('NOTICE', arguments);
};

Log.prototype.error = function (msg) {
    msg = '   ✘ '.red + msg;
    this.log('ERROR', arguments);
};

log = new Log('error').colorful({
    SUCCESS : '\033[0;37m',
    INFO : '\033[0;37m',
    NOTICE : '\033[0;37m',
    ERROR : '\033[0;37m'
});

module.exports = log;

