'use strict';

var hasSymbols = require('has-symbols')();

module.exports = function runTests(promisify, t) {
	t.equal(typeof promisify, 'function', 'promisify is a function');

	t['throws'](
		function () { promisify(null); },
		TypeError,
		'throws on non-functions'
	);

	var yes = function () {
		var cb = arguments[arguments.length - 1];
		cb(null, Array.prototype.slice.call(arguments, 0, -1));
	};
	var no = function () {
		var cb = arguments[arguments.length - 1];
		cb(Array.prototype.slice.call(arguments, 0, -1));
	};

	var pYes = promisify(yes);
	var pNo = promisify(no);

	t.equal(typeof pYes, 'function', 'pYes is a function');
	t.equal(typeof pNo, 'function', 'pNo is a function');

	t.test('pYes is properly promisified', { skip: typeof Promise !== 'function' }, function (st) {
		st.plan(1);

		var p = pYes(1, 2, 3);
		return p.then(function (result) {
			st.deepEqual(result, [1, 2, 3], 'fulfillment: arguments are preserved');
		});
	});

	t.test('pNo is properly promisified', { skip: typeof Promise !== 'function' }, function (st) {
		st.plan(1);

		var p = pNo(1, 2, 3);
		return p.then(null, function (args) {
			st.deepEqual(args, [1, 2, 3], 'rejection: arguments are preserved');
		});
	});

	t.test('custom symbol', { skip: !hasSymbols }, function (st) {
		st.equal(Symbol.keyFor(promisify.custom), 'nodejs.util.promisify.custom', 'is a global symbol with the right key');
		// eslint-disable-next-line no-restricted-properties
		st.equal(Symbol['for']('nodejs.util.promisify.custom'), promisify.custom, 'is the global symbol');

		st.end();
	});
};
