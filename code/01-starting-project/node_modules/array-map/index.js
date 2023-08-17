'use strict';

var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function (xs, f) {
	if (xs.map) {
		return xs.map(f);
	}
	var res = [];
	for (var i = 0; i < xs.length; i++) {
		var x = xs[i];
		if (hasOwn.call(xs, i)) {
			res.push(f(x, i, xs));
		}
	}
	return res;
};
