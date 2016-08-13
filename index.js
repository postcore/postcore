/*!
 * postcore <https://github.com/postcore/postcore>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')
var Base = utils.Base.namespace('cache')

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
  this.is('PostCore')
  // this.use(utils.options()) // there's a bug in `base-option`
  this.use(utils.plugins())
  this.use(utils.pluginsEnhanced())

  /**
   * Initialize correct defaults
   */

  this.options = utils.extend({}, this.options, options)
  this.plugins = utils.arrayify(plugins).concat(this.options.plugins)
  this.cache.input = this.options.input || null
}

Base.extend(PostCore)

PostCore.prototype.parse = function parse (input, options) {
  if (utils.isObject(input)) {
    options = input
    input = this.cache.input || null
  }
  if (typeof input !== 'string') {
    throw new TypeError('.parse: expect `input` or `this.cache.input` to be a string.')
  }

  this.cache.input = input
  this.options = utils.extend({}, this.options, options)

  if (typeof this.options.parser !== 'function') {
    throw new TypeError('.parse: expect `this.options.parser` to be a function')
  }
  var ast = this.options.parser.call(this, this.cache.input, this.options)
  this.cache.ast = ast || this.cache.ast
  return this.cache.ast
}

/**
 * Passing `input` to `.parse` method and then
 * pass parsed data to the plugins.
 *
 * @name   .process
 * @param  {String|Object} `input` input text to be parsed or `options` object
 * @param  {Object} `options` options object merged into `this.options`
 * @return {[type]}
 * @api public
 */

PostCore.prototype.process = function process (input, options) {
  var self = this
  return new Promise(function (resolve) {
    self.parse(input, options)
    self.run(self.cache)
    self.stringify(self.cache.ast, self.options)
    resolve(self.cache)
  })
}

PostCore.prototype.stringify = function stringify (ast, options) {
  if (!utils.isObject(ast)) {
    throw new TypeError('.stringify: expect `ast` or `this.cache.ast` to be an object')
  }
  this.options = utils.extend({}, this.options, options)

  if (typeof this.options.stringifier !== 'function') {
    throw new TypeError('.parse: expect `this.options.stringifier` to be a function')
  }
  this.cache.content = this.options.stringifier.call(this, ast, this.options)
  return this.cache.content
}

module.exports = new PostCore()
module.exports.PostCore = PostCore
