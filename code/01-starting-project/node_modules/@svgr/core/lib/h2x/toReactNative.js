"use strict";

exports.__esModule = true;
exports.default = void 0;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const elementToComponent = {
  svg: 'Svg',
  circle: 'Circle',
  clipPath: 'ClipPath',
  ellipse: 'Ellipse',
  g: 'G',
  linearGradient: 'LinearGradient',
  radialGradient: 'RadialGradient',
  line: 'Line',
  path: 'Path',
  pattern: 'Pattern',
  polygon: 'Polygon',
  polyline: 'Polyline',
  rect: 'Rect',
  symbol: 'Symbol',
  text: 'Text',
  textPath: 'TextPath',
  tspan: 'TSpan',
  use: 'Use',
  defs: 'Defs',
  stop: 'Stop'
};
const componentToElement = Object.keys(elementToComponent).reduce((map, key) => _extends({}, map, {
  [elementToComponent[key]]: key
}), {});

const toReactNative = () => () => ({
  visitor: {
    JSXElement: {
      enter(path, state) {
        // Replace element by react-native-svg components
        const component = elementToComponent[path.node.name];

        if (component) {
          path.node.name = component;
          state.reactNativeSvgReplacedComponents = state.reactNativeSvgReplacedComponents || new Set();
          state.reactNativeSvgReplacedComponents.add(component);
          return;
        } // Remove element if not supported


        if (!componentToElement[path.node.name]) {
          state.unsupportedComponents = state.unsupportedComponents || new Set();
          state.unsupportedComponents.add(path.node.name);
          path.remove();
        }
      }

    }
  }
});

var _default = toReactNative;
exports.default = _default;