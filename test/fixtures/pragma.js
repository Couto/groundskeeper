function merge(target) {
    console.dir(target, arguments);
    
    //<validation>
    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [];
    //</validation>
    
    objects.forEach(function (val, idx) {
        keys = Object.keys(val);
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            console.log(keys);
        });
    });
}
