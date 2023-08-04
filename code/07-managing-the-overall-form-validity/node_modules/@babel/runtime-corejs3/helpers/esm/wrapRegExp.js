import _typeof from "./typeof.js";
import _WeakMap from "core-js-pure/features/weak-map/index.js";
import _reduceInstanceProperty from "core-js-pure/features/instance/reduce.js";
import _Object$keys from "core-js-pure/features/object/keys.js";
import _Object$create from "core-js-pure/features/object/create.js";
import _Symbol$replace from "core-js-pure/features/symbol/replace.js";
import _Array$isArray from "core-js-pure/features/array/is-array.js";
import _pushInstanceProperty from "core-js-pure/features/instance/push.js";
import _sliceInstanceProperty from "core-js-pure/features/instance/slice.js";
import setPrototypeOf from "./setPrototypeOf.js";
import inherits from "./inherits.js";
export default function _wrapRegExp() {
  _wrapRegExp = function _wrapRegExp(re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };
  var _super = RegExp.prototype,
    _groups = new _WeakMap();
  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);
    return _groups.set(_this, groups || _groups.get(re)), setPrototypeOf(_this, BabelRegExp.prototype);
  }
  function buildGroups(result, re) {
    var _context;
    var g = _groups.get(re);
    return _reduceInstanceProperty(_context = _Object$keys(g)).call(_context, function (groups, name) {
      var i = g[name];
      if ("number" == typeof i) groups[name] = result[i];else {
        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;
        groups[name] = result[i[k]];
      }
      return groups;
    }, _Object$create(null));
  }
  return inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);
    if (result) {
      result.groups = buildGroups(result, this);
      var indices = result.indices;
      indices && (indices.groups = buildGroups(indices, this));
    }
    return result;
  }, BabelRegExp.prototype[_Symbol$replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);
      return _super[_Symbol$replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        var group = groups[name];
        return "$" + (_Array$isArray(group) ? group.join("$") : group);
      }));
    }
    if ("function" == typeof substitution) {
      var _this = this;
      return _super[_Symbol$replace].call(this, str, function () {
        var _context2;
        var args = arguments;
        return "object" != _typeof(args[args.length - 1]) && _pushInstanceProperty(_context2 = args = _sliceInstanceProperty([]).call(args)).call(_context2, buildGroups(args, _this)), substitution.apply(this, args);
      });
    }
    return _super[_Symbol$replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
}