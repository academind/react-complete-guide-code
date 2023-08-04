var _Symbol = require("core-js-pure/features/symbol/index.js");
var _getIteratorMethod = require("core-js-pure/features/get-iterator-method.js");
var _pushInstanceProperty = require("core-js-pure/features/instance/push.js");
function _iterableToArrayLimitLoose(arr, i) {
  var _i = arr && ("undefined" != typeof _Symbol && _getIteratorMethod(arr) || arr["@@iterator"]);
  if (null != _i) {
    var _s,
      _arr = [];
    for (_i = _i.call(arr); arr.length < i && !(_s = _i.next()).done;) _pushInstanceProperty(_arr).call(_arr, _s.value);
    return _arr;
  }
}
module.exports = _iterableToArrayLimitLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;