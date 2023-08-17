'use strict';

var util = require('util');
var implementation = require('./implementation');

module.exports = function getPolyfill() {
	if (typeof util.promisify === 'function' && util.promisify.custom === implementation.custom) {
		return util.promisify;
	}
	return implementation;
};
