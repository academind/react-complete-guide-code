"use strict";

exports.__esModule = true;
exports.default = void 0;
const dimensionAttrs = ['width', 'height'];

const filterDimensionAttrs = attr => !dimensionAttrs.includes(attr.name);

const removeDimensions = () => () => ({
  visitor: {
    JSXElement: {
      enter(path) {
        // Skip if not svg node
        if (path.node.name !== 'svg') return;
        path.node.attributes = path.node.attributes.filter(filterDimensionAttrs);
      }

    }
  }
});

var _default = removeDimensions;
exports.default = _default;