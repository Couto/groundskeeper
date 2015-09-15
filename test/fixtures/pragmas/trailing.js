function merge(target) {
    console.dir(target, arguments);

    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [],
        log = console.log;

    console.log('keep me!');
    //<unmatchedEnd>
    console.log('also keep me!');
}