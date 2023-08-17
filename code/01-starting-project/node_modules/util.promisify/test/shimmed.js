'use strict';

var test = require('tape');
var util = require('util');

var runTests = require('./tests');

test('shimmed', { skip: typeof Promise !== 'function' }, function (t) {
	require('../auto'); // eslint-disable-line global-require

	runTests(util.promisify, t);

	t.end();
});
