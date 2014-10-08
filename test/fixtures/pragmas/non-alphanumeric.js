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
            //<dev-elop&ment>
            clean('this').developmentPragma;
            //</dev-elop&ment>
        });
    });

    App.logger.log("Hello World");

    console.log('all duplicates, get more');
    console.log("loadImageInCache():::::", index+1, index+1 % 2);
    console.log("external() open()", url, scrollee);

    //<dev:validation>
    clean('this').validationPragma;
    //</dev:validation>
}
