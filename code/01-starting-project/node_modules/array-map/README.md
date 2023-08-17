# array-map <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

`[].map(f)` for older browsers

# example

``` js
var map = require('array-map');
var letters = map([97,98,99], function (c) {
	return String.fromCharCode(c);
});
console.log(letters.join(''));
```

output:

```
abc
```

# methods

``` js
var map = require('array-map')
```

## var ys = map(xs, f)

Create a new array `ys` by applying `f(xs[i], i, xs)` to each element in `xs` at
index `i`.

# install

With [npm](https://npmjs.org) do:

```
npm install array-map
```

# license

MIT

[package-url]: https://npmjs.org/package/array-map
[npm-version-svg]: https://versionbadg.es/ljharb/array-map.svg
[deps-svg]: https://david-dm.org/ljharb/array-map.svg
[deps-url]: https://david-dm.org/ljharb/array-map
[dev-deps-svg]: https://david-dm.org/ljharb/array-map/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/array-map#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/array-map.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/array-map.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/array-map.svg
[downloads-url]: https://npm-stat.com/charts.html?package=array-map
[codecov-image]: https://codecov.io/gh/ljharb/array-map/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/ljharb/array-map/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/ljharb/array-map
[actions-url]: https://github.com/ljharb/array-map/actions
