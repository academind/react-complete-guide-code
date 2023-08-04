var _bindInstanceProperty = require("core-js-pure/features/instance/bind.js");
var _Reflect$construct = require("core-js-pure/features/reflect/construct.js");
var _pushInstanceProperty = require("core-js-pure/features/instance/push.js");
var setPrototypeOf = require("./setPrototypeOf.js");
var isNativeReflectConstruct = require("./isNativeReflectConstruct.js");
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    var _context;
    module.exports = _construct = _bindInstanceProperty(_context = _Reflect$construct).call(_context), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      _pushInstanceProperty(a).apply(a, args);
      var Constructor = _bindInstanceProperty(Function).apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;