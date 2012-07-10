function merge(target) {
    console.dir(target, arguments);

    objects.forEach(function (val, idx) {
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            console.log(keys);
        });
    });
}
