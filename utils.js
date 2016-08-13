'use strict'

var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-native-reassign

/**
 * Lazily required module dependencies
 */

require('base', 'Base')
require('base-plugins', 'plugins')
require('base-plugins-enhanced', 'pluginsEnhanced')
require('lazy-utils', 'utils')
require('define-property', 'define')
require('delegate-properties', 'delegate')
require = fn // eslint-disable-line no-undef, no-native-reassign

/**
 * Expose `utils` modules
 */

module.exports = utils.utils.extend(utils, utils.utils)
