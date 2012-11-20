function merge(target) {
    

    var objects = Array.prototype.slice.call(arguments, 1),
        keys = [],
        log = console.log;

    objects.forEach(function (val, idx) {
        keys = Object.keys(val);
        keys.forEach(function (val) {
            target[val] = objects[idx][val];
            App.logger.warn("Hello World");
            
            debugger;
            //<development>
            clean('this').developmentPragma;
            //</development>
        });
    });

    App.logger.log("Hello World");

    
    
    

    //<validation>
    clean('this').validationPragma;
    //</validation>
}
