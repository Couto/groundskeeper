function merge(target) {
    console.dir(target, arguments);

    //<validation>
    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [];
    //</validation>

    objects.forEach(function (val, idx) {
        // <optional>
        keys = Object.keys(val);
        // </optional>
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            console.log(keys);
        });
    });
}
