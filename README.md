groundskeeper
=============

__Current Version:__ 0.1.1

[![Build Status](https://secure.travis-ci.org/Couto/groundskeeper.png?branch=master)](https://travis-ci.org/Couto/groundskeeper)

This is a small utility to remove forgotten `console`, `debugger` and specific blocks of code from Javascript files.

It just happens that I forget __a lot__ to remove `console` statements when moving code to production... at the same time I like to do a lot of validations while in development enviroment, validations that are not really needed when in production mode.

This tool is exactly that tool that removes all those useless stuff.

Note: if you have any problems, take a look at the dev branch, but remember that branch is like pretty much beta.

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

Pretty simple... dirty file goes in, clean file goes out:

in shell:
```shell
groundskeeper < dirty.js > clean.js
```

in javascript:
```javascript
var fs = require('fs'),
    groundskeeper = require('groundskeeper'),
    file = fs.readFileSync('dirtyFile.js', 'utf8'),
    cleaner = groundskeeper(options);

cleaner.write(file);
fs.writeFileSync('cleanFile.js', cleaner.isString(), 'utf8');
```

Streams are supported by groundskeeper, but not by [esprima](http://code.google.com/p/esprima/issues/detail?id=92&q=Enhancement), if you really want to use Streams, make sure that your files are below 40960 bytes, still... the example:

```javascript
var fs = require('fs'),
    groundskeeper = require('groundskeeper'),
    dirty = fs.createReadStream('dirty.js'),
    clean = fs.createWriteStream('clean.js'),
    cleaner = groundskeeper(options),


dirty.setEncoding('utf8');
dirty.pipe(cleaner).pipe(clean);
```


By default `groundskeeper` removes all `console`, `debugger;` and pragmas that it founds, the following options allow you to specify what you want to __keep__:

in Javascript:

```javascript
{
    console: true,                          // Keep console logs
    debugger: true                          // Keep debugger; statements
    pragmas: ['validation', 'development'], // Keep pragmas with the following identifiers
    namespace: 'App.logger'                 // Besides console also remove functions in the given namespace,
    replace: '0'                            // For the ones who don't know how to write Javascript...
}
```

in Shell:

```shell
-p, --pragmas <names>     comma-delimited <names> to keep, everything else is removed
-n, --namespace <string>  If you use your own logger utility, specify here, e.g.: `App.logger`
-d, --debugger [boolean]  If true, it will keep `debbuger;` statements
-c, --console [boolean]   If true, it keeps `console` statements
-r, --replace <string>    If given it will replace every console with the given value
```

If you use your own logger utility, you can also remove those by specifying a namespace.
Assuming your utility is `App.logger.log('yeyy')`

```shell
groundskeeper -n App.logger.log < dirty.js > clean.js
```

If you have multiple functions (warn, count...) in that namespace you can specify `App.logger` only to remove them all:

```shell
groundskeeper -n App.logger < dirty.js > clean.js
```

__Note:__
In certain cases, you can't remove the `console` entirely, a pretty tipical case of that is:

```javascript
if (condition) console.log("condition true");
else console.log("condition false")

// yeah... most cases happen when people don't use brackets...
```

After removing the `console` statements the previous code becomes:

```javascript
if (condition)
else
```
... which is illegal.

That's when you should use the `replace` option by specifying a string, where the code becomes:

```
// assuming 'replace' = '0'
if (condition) '0'
else '0'
```
... which is harmless, not pretty, but harmless.


__Pragmas__

If you're wondering how to remove entire blocks of code, you can do that by using comments.

```javascript
var clone = function (arr) {

    //<validation>
    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        throw new Error('Invalid argument given');
    }
    //</validation>

    return arr.map(function (val) {});
};
```

Notice those comments? They specify a block code of validation, you can specify whatever name you wish, as long as you respect the format.

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
