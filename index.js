/*!
 * postcore <https://github.com/postcore/postcore>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')
var Base = utils.Base.namespace('cache')

/**
 * > Initialize `PostCore` with `plugins` and `options`.
 * Plugins can also be passed in `options.plugins`.
 * Notice that `PostCore` is built on [base][], so you have
 * access to all of its builtin methods like `.use`, `.set`, `.get`
 * `.has`, `.define`, `.visit` and so on.
 *
 * @param {Array|Object} `plugins` plugins to be used, or `options` object
 * @param {Object} `options` options to control some stuff
 * @api public
 */

function PostCore (plugins, options) {
  if (!(this instanceof PostCore)) {
    return new PostCore(plugins, options)
  }
  if (utils.isObject(plugins)) {
    options = plugins
    plugins = []
  }

  /**
   * Base specific loading
   */
  Base.call(this)
  this.isApp = true
  this.is('PostCore')
  // this.use(utils.options()) // there's a bug in `base-option`
  this.use(utils.plugins())
  this.use(utils.pluginsEnhanced())

  /**
   * Initialize correct defaults
   */

  this.options = utils.extend({}, this.options, options)
  this.plugins = utils.arrayify(plugins).concat(this.options.plugins)
  this.file = this.options.contents ? utils.VFile(this.options.contents) : null
}

Base.extend(PostCore)

/**
 * > Parse given `input` using `this.options.parser`.
 *
 * @name   .parse
 * @param  {VFile|String} `input` [vfile][] object or string
 * @param  {Object} `options` options object merged into `this.options`
 * @return {Mixed} the result of the given parser
 * @api public
 */

PostCore.prototype.parse = function parse (input, options) {
  this.file = utils.VFile(input)
  this.options = utils.extend({}, this.options, options)

  if (typeof this.options.parser !== 'function') {
    throw new TypeError('.parse: expect `this.options.parser` to be a function')
  }
  var ast = this.options.parser.call(this, this.file, this.options)
  this.file.ast = ast || this.file.ast
  return this.file
}

/**
 * > Passing `input` to `.parse` method and then
 * pass parsed data to the plugins. After all, pass it
 * to the `.stringify` (so, `this.options.stringifier`)
 * and return Promise with the result object.
 *
 * @name   .process
 * @param  {VFile|String} `input` [vfile][] object or string
 * @param  {Object} `options` options object merged into `this.options`
 * @return {Promise} with object containing metadata and stringified result
 * @api public
 */

PostCore.prototype.process = function process (input, options) {
  this.parse(input, options)
  this.run(this.file)
  this.stringify(this.file)
  return this.file
  // var self = this
  // return new Promise(function (resolve) {
  //   self.parse(input, options)
  //   self.run(self.file)
  //   self.stringify(self.cache.ast, self.options)
  //   resolve(self.cache)
  // })
}

/**
 * > Stringify given `ast` to string, using `this.options.stringifier`.
 *
 * @name   .stringify
 * @param  {VFile|String} `file` [vfile][] object or string
 * @param  {Object} `options` options object merged into `this.options`
 * @return {Mixed} the result of the given stringifier
 * @api public
 */

PostCore.prototype.stringify = function stringify (file, options) {
  if (!utils.isObject(file)) {
    throw new TypeError('.stringify: expect `file` to be VFile object')
  }
  this.options = utils.extend({}, this.options, options)

  if (typeof this.options.stringifier !== 'function') {
    throw new TypeError('.parse: expect `this.options.stringifier` to be a function')
  }
  var contents = this.options.stringifier.call(this, file, this.options)
  this.file.contents = contents || this.file.contents
  return this.file
}

/**
 * > Add plugin to the stack. It follows the "smart" plugins
 * concept coming from [base][] project, because `PostCore` is
 * built on it internally, so you can use any of its plugins here.
 *
 * **Example**
 *
 * ```js
 * var postcore = require('postcore')
 *
 * postcore
 *   .use([plugin, plugin, plugin], { foo: 'bar' })
 *   .use(function (app) {
 *     // `app` and `this` context are the instance of `postcore`
 *     return function plugin (ctx) {
 *       // `ctx` and `this` are the same and comes internally
 *       // from `.process` - it is the `this.cache` object
 *       // which can be used for sharing context between plugins.
 *     }
 *   })
 *   .process('some string', { options: 'foo' })
 * ```
 *
 * @name   .use
 * @param  {Function|Array} `fn` plugin function or array of plugins
 * @param  {Object} `opts` options merged with the `this.options`
 * @return {PostCore} instance for chaining
 * @api public
 */

/**
 * > Expose `PostCore` instance.
 *
 * @type {PostCore}
 * @private
 */
module.exports = new PostCore()

/**
 * > Expose `PostCore` constructor.
 *
 * @type {Function}
 * @private
 */
module.exports.PostCore = PostCore
