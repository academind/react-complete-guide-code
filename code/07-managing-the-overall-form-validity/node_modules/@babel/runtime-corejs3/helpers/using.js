var _Symbol$asyncDispose = require("core-js-pure/features/symbol/async-dispose.js");
var _Symbol$for = require("core-js-pure/features/symbol/for.js");
var _Symbol$dispose = require("core-js-pure/features/symbol/dispose.js");
var _pushInstanceProperty = require("core-js-pure/features/instance/push.js");
var _typeof = require("./typeof.js")["default"];
function _using(stack, value, isAwait) {
  if (null == value) return value;
  if ("object" != _typeof(value)) throw new TypeError("using declarations can only be used with objects, null, or undefined.");
  if (isAwait) var dispose = value[_Symbol$asyncDispose || _Symbol$for("Symbol.asyncDispose")];
  if (null == dispose && (dispose = value[_Symbol$dispose || _Symbol$for("Symbol.dispose")]), "function" != typeof dispose) throw new TypeError("Property [Symbol.dispose] is not a function.");
  return _pushInstanceProperty(stack).call(stack, {
    v: value,
    d: dispose,
    a: isAwait
  }), value;
}
module.exports = _using, module.exports.__esModule = true, module.exports["default"] = module.exports;