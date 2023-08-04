var _Promise = require("core-js-pure/features/promise/index.js");
var _Symbol = require("core-js-pure/features/symbol/index.js");
var _Symbol$iterator = require("core-js-pure/features/symbol/iterator.js");
var OverloadYield = require("./OverloadYield.js");
function _asyncGeneratorDelegate(inner) {
  var iter = {},
    waiting = !1;
  function pump(key, value) {
    return waiting = !0, value = new _Promise(function (resolve) {
      resolve(inner[key](value));
    }), {
      done: !1,
      value: new OverloadYield(value, 1)
    };
  }
  return iter["undefined" != typeof _Symbol && _Symbol$iterator || "@@iterator"] = function () {
    return this;
  }, iter.next = function (value) {
    return waiting ? (waiting = !1, value) : pump("next", value);
  }, "function" == typeof inner["throw"] && (iter["throw"] = function (value) {
    if (waiting) throw waiting = !1, value;
    return pump("throw", value);
  }), "function" == typeof inner["return"] && (iter["return"] = function (value) {
    return waiting ? (waiting = !1, value) : pump("return", value);
  }), iter;
}
module.exports = _asyncGeneratorDelegate, module.exports.__esModule = true, module.exports["default"] = module.exports;