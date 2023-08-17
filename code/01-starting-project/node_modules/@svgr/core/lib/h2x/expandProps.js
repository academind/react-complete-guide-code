"use strict";

exports.__esModule = true;
exports.default = void 0;

var _h2xPluginJsx = require("h2x-plugin-jsx");

const expandProps = (place = 'end') => () => ({
  visitor: {
    JSXElement: {
      enter(path) {
        if (path.node.name === 'svg' && !path.node.attributes.some(attr => attr && attr.name === 'props')) {
          const props = new _h2xPluginJsx.JSXAttribute();
          props.name = 'props';
          props.spread = true;

          if (place === 'start') {
            path.node.attributes.unshift(props);
          }

          if (place === 'end') {
            path.node.attributes.push(props);
          }

          path.replace(path.node);
        }
      }

    }
  }
});

var _default = expandProps;
exports.default = _default;