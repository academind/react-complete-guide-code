var _Symbol = require("core-js-pure/features/symbol/index.js");
var _getIteratorMethod = require("core-js-pure/features/get-iterator-method.js");
var _pushInstanceProperty = require("core-js-pure/features/instance/push.js");
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof _Symbol && _getIteratorMethod(arr) || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_pushInstanceProperty(_arr).call(_arr, _s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;