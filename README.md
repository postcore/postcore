# [postcore][author-www-url] [![npmjs.com][npmjs-img]][npmjs-url] [![The MIT License][license-img]][license-url] [![npm downloads][downloads-img]][downloads-url] 

> Processor engine for Post* family like PostCSS, PostHTML and PostJSON.

[![code climate][codeclimate-img]][codeclimate-url] [![standard code style][standard-img]][standard-url] [![travis build status][travis-img]][travis-url] [![coverage status][coveralls-img]][coveralls-url] [![dependency status][david-img]][david-url]

## Install
```
npm i postcore --save
```

## Usage
> For more use-cases see the [tests](./test.js)

```js
const postcore = require('postcore')
```

### [PostCore](index.js#L25)

> Initialize `PostCore` with `plugins` and `options`.
Plugins can also be passed in `options.plugins`.
Notice that `PostCore` is built on [base][], so you have
access to all of its builtin methods like `.use`, `.set`, `.get`
`.has`, `.define`, `.visit` and so on.

**Params**

* `plugins` **{Array|Object}**: plugins to be used, or `options` object    
* `options` **{Object}**: options to control some stuff    

### [.parse](index.js#L65)

> Parse given `input` using `this.options.parser`.

**Params**

* `input` **{String|Object}**: input text to be parsed or `options` object    
* `options` **{Object}**: options object merged into `this.options`    
* `returns` **{Mixed}**: the result of the given parser  

### [.process](index.js#L98)

> Passing `input` to `.parse` method and then
pass parsed data to the plugins. After all, pass it
to the `.stringify` (so, `this.options.stringifier`)
and return Promise with the result object.

**Params**

* `input` **{String|Object}**: input text to be parsed or `options` object    
* `options` **{Object}**: options object merged into `this.options`    
* `returns` **{Promise}**: with object containing metadata and stringified result  

### [.stringify](index.js#L118)

> Stringify given `ast` to string, using `this.options.stringifier`.

**Params**

* `ast` **{Array|Object}**: object or array tree, ast to be stringified    
* `options` **{Object}**: options object merged into `this.options`    
* `returns` **{Mixed}**: the result of the given stringifier  

### [.use](index.js#L161)
> Add plugin to the stack. It follows the "smart" plugins concept coming from [base][] project, because `PostCore` is built on it internally, so you can use any of its plugins here.

**Params**

* `fn` **{Function|Array}**: plugin function or array of plugins    
* `opts` **{Object}**: options merged with the `this.options`    
* `returns` **{PostCore}**: instance for chaining  

**Example**

```js
var postcore = require('postcore')

postcore
  .use([plugin, plugin, plugin], { foo: 'bar' })
  .use(function (app) {
    // `app` and `this` context are the instance of `postcore`
    return function plugin (ctx) {
      // `ctx` and `this` are the same and comes internally
      // from `.process` - it is the `this.cache` object
      // which can be used for sharing context between plugins.
    }
  })
  .process('some string', { options: 'foo' })
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/postcore/postcore/issues/new).  
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.

## [Charlike Make Reagent](http://j.mp/1stW47C) [![new message to charlike][new-message-img]][new-message-url] [![freenode #charlike][freenode-img]][freenode-url]

[![tunnckoCore.tk][author-www-img]][author-www-url] [![keybase tunnckoCore][keybase-img]][keybase-url] [![tunnckoCore npm][author-npm-img]][author-npm-url] [![tunnckoCore twitter][author-twitter-img]][author-twitter-url] [![tunnckoCore github][author-github-img]][author-github-url]

[npmjs-url]: https://www.npmjs.com/package/postcore
[npmjs-img]: https://img.shields.io/npm/v/postcore.svg?label=postcore

[license-url]: https://github.com/postcore/postcore/blob/master/LICENSE
[license-img]: https://img.shields.io/npm/l/postcore.svg

[downloads-url]: https://www.npmjs.com/package/postcore
[downloads-img]: https://img.shields.io/npm/dm/postcore.svg

[codeclimate-url]: https://codeclimate.com/github/postcore/postcore
[codeclimate-img]: https://img.shields.io/codeclimate/github/postcore/postcore.svg

[travis-url]: https://travis-ci.org/postcore/postcore
[travis-img]: https://img.shields.io/travis/postcore/postcore/master.svg

[coveralls-url]: https://coveralls.io/r/postcore/postcore
[coveralls-img]: https://img.shields.io/coveralls/postcore/postcore.svg

[david-url]: https://david-dm.org/postcore/postcore
[david-img]: https://img.shields.io/david/postcore/postcore.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

[author-www-url]: http://www.tunnckocore.tk
[author-www-img]: https://img.shields.io/badge/www-tunnckocore.tk-fe7d37.svg

[keybase-url]: https://keybase.io/tunnckocore
[keybase-img]: https://img.shields.io/badge/keybase-tunnckocore-8a7967.svg

[author-npm-url]: https://www.npmjs.com/~tunnckocore
[author-npm-img]: https://img.shields.io/badge/npm-~tunnckocore-cb3837.svg

[author-twitter-url]: https://twitter.com/tunnckoCore
[author-twitter-img]: https://img.shields.io/badge/twitter-@tunnckoCore-55acee.svg

[author-github-url]: https://github.com/tunnckoCore
[author-github-img]: https://img.shields.io/badge/github-@tunnckoCore-4183c4.svg

[freenode-url]: http://webchat.freenode.net/?channels=charlike
[freenode-img]: https://img.shields.io/badge/freenode-%23charlike-5654a4.svg

[new-message-url]: https://github.com/tunnckoCore/ama
[new-message-img]: https://img.shields.io/badge/ask%20me-anything-green.svg

[base]: https://github.com/node-base/base