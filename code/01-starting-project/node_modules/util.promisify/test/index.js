'use strict';

var test = require('tape');

var runTests = require('./tests');

test('as a function', function (t) {
	/* eslint global-require: 1 */
	if (typeof Promise === 'function') {
		var promisify = require('../');
		runTests(promisify, t);
	} else {
		t['throws'](
			function () { require('../'); },
			TypeError,
			'throws when no Promise available'
		);
	}

	t.end();
});
