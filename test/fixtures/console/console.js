function merge(target) {
    console.dir(target, arguments);

    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [],
        log = console.log;

    objects.forEach(function (val, idx) {
        keys = Object.keys(val);
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            App.logger.warn("Hello World");
            console.log(keys);
            debugger;
            //<development>
            clean('this').developmentPragma;
            //</development>
        });
    });

    App.logger.log("Hello World");

    console.log('all duplicates, get more');
    window.console.log("loadImageInCache():::::", index+1, index+1 % 2);
    console.log("external() open()", url, scrollee);

    //<validation>
    clean('this').validationPragma;
    //</validation>
}
