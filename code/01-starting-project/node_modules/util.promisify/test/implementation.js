'use strict';

var test = require('tape');

var runTests = require('./tests');

test('implementation', function (t) {
	/* eslint global-require: 1 */
	if (typeof Promise === 'function') {
		var promisify = require('../implementation');
		runTests(promisify, t);
	} else {
		t['throws'](
			function () { require('../implementation'); },
			TypeError,
			'throws when no Promise available'
		);
	}

	t.end();
});
