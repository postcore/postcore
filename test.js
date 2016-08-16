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
    return function (file) {
      app.set('ast.qux', 123)
      file.ast.version = '1.2.3'
      file.ast.foo = 'bar'
      // file.warn('War~~ning!', {line: 2, column: 4})
      // this.messages = this.messages || []
      // this.messages.push({
      //   name: 'custom-plugin',
      //   report: 'okey'
      // })
    }
  })

var file = postcore.process(fs.readFileSync('./package.json', 'utf8'))
console.log(file)
  // .then(function (result) {
  //   console.log(result.content)
  //   console.log('msgs:', result.messages)
  // }, console.error)

/**
 * [parser description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function parser (opts) {
  return function parse (file, options) {
    // if used as plugin, so `file` will be `app/this`
    if (file && file.isPostCore && file.isBase) {
      file.options.parser = parse
      return
    }
    if (utils.isBuffer(file) && typeof file == 'string') {
      file = utils.VFile(file)
    }
    // do the parser stuff below
    this.options = utils.extend({}, options, opts)
    // or this one?
    // this.option(options).option.create().merge(opts)

    // passed to `this.stringify` (aka this.options.stringifier)
    return JSON.parse(file.contents)
  }
}

/**
 * [stringifier description]
 * @param  {[type]} opts [description]
 * @return {[type]}      [description]
 */
function stringifier (opts) {
  return function stringify (file, options) {
    // if used as plugin, so `input` will be `app/this`
    if (file && file.isPostCore && file.isBase) {
      file.options.stringifier = stringify
      return
    }
    // do the stringifier stuff below
    this.options = utils.extend({}, options, opts)
    // @todo dont forget for the V8's optimization
    // for single argument
    return JSON.stringify(file.ast, null, this.options.indent || 0)
  }
}



/**
 * example
 */

// postcore.process('foo bar baz')
