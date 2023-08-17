"use strict";

exports.__esModule = true;
exports.default = void 0;

var _h2xPluginJsx = require("h2x-plugin-jsx");

const svgRef = () => () => ({
  visitor: {
    JSXElement: {
      enter(path) {
        if (path.node.name === 'svg' && !path.node.attributes.some(attr => attr && attr.name === 'ref')) {
          const props = new _h2xPluginJsx.JSXAttribute();
          props.name = 'ref';
          props.value = 'svgRef';
          props.literal = true;
          path.node.attributes.push(props);
          path.replace(path.node);
        }
      }

    }
  }
});

var _default = svgRef;
exports.default = _default;