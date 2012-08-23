[![build status](https://secure.travis-ci.org/Couto/groundskeeper.png)](http://travis-ci.org/Couto/groundskeeper)
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

Notes
-----

 * If you minify your code (and you should!). Please use this before the minification process since it will __unminify__ your code on the process.


Usage
-----

```shell
groundskeeper [options] -i <input folder> -o <output folder>
```

```javascript
var groundskeeper = require('groundskeeper').groundskeeper(options);
```

I'm not really sure if the second way is useful, but it exists just in case.

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
-a, --ast [boolean]      disable parse through ast, fallbacks to regex but keeps
newlines
-p, --pragmas <names>    comma-delimited <names> to remove, defaults to validation, development
-v, --verbose [boolean]  outputs current state of procedure
--list                   display list of console methods that will be removed
```

Tests
-----
Tests are ran using [mocha](http://visionmedia.github.com/mocha/) and [jscoverage](https://github.com/visionmedia/node-jscoverage) you can install mocha with `npm install`, but you'll need to clone and install jscoverage from this [repository](https://github.com/visionmedia/node-jscoverage)

To issue the tests, take a look at the [Makefile](https://github.com/Couto/groundskeeper/blob/master/Makefile), but in short, it's just a matter of doing:

```shell
make test
```

If you want to see the code coverage, just write:
```shell
make lib-cov && make test-cov
```

TODO
----
 * Finish tests

License
-------
Copyright (c) 2012 Luís Couto Licensed under the [MIT License](http://couto.mit-license.org)
