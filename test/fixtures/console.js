function merge(target) {
    console.dir(target, arguments);

    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [];

    objects.forEach(function (val, idx) {
        keys = Object.keys(val);
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            console.log(keys);
        });
    });

    console.log('all duplicates, get more');
    console.log("loadImageInCache():::::", index+1, index+1 % 2);
    console.log("external() open()", url, scrollee);
}
