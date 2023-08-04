'use strict';

var isCoreModule = require('is-core-module');
var path = require('path');
var fs = require('fs');
var data = JSON.parse(String(fs.readFileSync(path.join(path.dirname(require.resolve('is-core-module/package.json')), 'core.json'))));

var core = {};
for (var mod in data) { // eslint-disable-line no-restricted-syntax
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core[mod] = isCoreModule(mod);
    }
}
module.exports = core;
