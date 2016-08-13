/*!
 * postcore <https://github.com/postcore/postcore>
 *
 * Copyright (c) 2016 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

// var test = require('mukla')

var postcore = require('./index')
var utils = require('./utils')
var fs = require('fs')

/**
 * Can be used standalone, as plugin or to be passed
 * to `options` object like `{parser: parser()}`
 */
// function parser (opts) {
//   return function parse (input, options) {
//     // if used as plugin, so `input` will be `app/this`
//     if (utils.isObject(input) && input.define && input.use) {
//       this.options.parser = parse
//       return
//     }
//     // do the parser work below
//     this.options = utils.extend({}, options, opts)
//     // or this one?
//     // this.option(options).option.create().merge(opts)

//     // passed to `this.stringify` (aka this.options.stringifier)
//     return {
//       tree: [1, 2, 3, 4],
//       walk: function walk () {
//         return 444
//       }
//     }
//   }
// }

postcore
  .use([parser(), stringifier()])
  .use(function (app) {
    return function (ctx) {
      app.set('ast.qux', 123)
      ctx.ast.version = '1.2.3'
      ctx.ast.foo = 'bar'
      this.messages = this.messages || []
      this.messages.push({
        name: 'custom-plugin',
        report: 'okey'
      })
    }
  })
  .process(fs.readFileSync('./package.json', 'utf8'))
  .then(function (result) {
    console.log(result.content)
    console.log('msgs:', result.messages)
  }, console.error)

/**
 * [parser description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function parser (opts) {
  return function parse (input, options) {
    // if used as plugin, so `input` will be `app/this`
    if (input && input.isPostCore && input.isBase) {
      this.options.parser = parse
      return
    }
    if (typeof input !== 'string') {
      throw new TypeError('parser expect `input` to be a string')
    }
    // do the parser stuff below
    this.options = utils.extend({}, options, opts)
    // or this one?
    // this.option(options).option.create().merge(opts)

    // passed to `this.stringify` (aka this.options.stringifier)
    return JSON.parse(input)
  }
}

/**
 * [stringifier description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function stringifier (opts) {
  return function stringify (ast, options) {
    // if used as plugin, so `input` will be `app/this`
    if (ast && ast.isPostCore && ast.isBase) {
      this.options.stringifier = stringify
      return
    }
    // do the stringifier stuff below
    this.options = utils.extend({}, options, opts)
    // @todo dont forget for the V8's optimization
    // for single argument
    return JSON.stringify(ast, null, this.options.indent || 0)
  }
}
