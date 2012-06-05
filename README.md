groundskeeper
=============

This is a small utility to remove forgotten `consoles` and specific blocks of code from Javascript files.

It just happens that I forget __a lot__ to remove `console` statements when moving code to production... at the same time I like to do a lot of validations while in development enviroment, validations that are not really needed when in production mode.

This tool is exactly that tool that removes all those useless stuff.

Requirements
------------
 - [nodejs](https://github.com/joyent/node)
 - [npm](https://github.com/isaacs/npm) - If you're using a recent version of [nodejs](https://github.com/joyent/node/tree/v0.6.18) it should be already installed

Instalation
-----------

The easiest way is to use [npm](https://github.com/isaacs/npm)

```shell
    npm install groundskeeper -g
```

Usage
-----

```shell
    groundskeeper [options] -i <input folder> -o <output folder>
```

Altough several options can be given, example:

- To remove specific blocks of code, just insert comments specifying which block do you want to remove. Those comments must resemble the xml/html tags. By default all blocks named `validation` and `development` are removed.

```javascript
    function merge(target, source) {
        var k;

        //<validation>
        if (!is.object(target) || !is.object(source)) {
            throw new Error('Argument given must be of type Object');
        }
        //</validation>

        for (k in source) {
            if (source.hasOwnProperty(k) && !target[k]) {
                target[k] = source[k];
            }
        }

        return target;
    }
```

To remove the following block just type:
```shell
    groundskeeper -p validation -i file.js -o output.js
```

- If you want to _not_ remove `console` statments:
```shell
    groundskeeper -c false -i file.js -o output.js
```


Options
-------

```
    -h, --help               output usage information
    -V, --version            output the version number
    -i, --input <path>       input folder, defaults to current folder
    -o, --output <path>      output folder, defaults to ./clean
    -c, --console [boolean]  enable the removal of console statements
    -p, --pragmas <names>    comma-delimited <names> to remove, defaults to validation, development
    -v, --verbose [boolean]  outputs current state of procedure
    --list                   display list of console methods that will be removed
```

License
-------
Copyright (c) 2012 Luís Couto Licensed under the [MIT License](http://couto.mit-license.org)
