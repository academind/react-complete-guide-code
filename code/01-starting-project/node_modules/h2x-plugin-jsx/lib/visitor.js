"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _JSXElement = _interopRequireDefault(require("./JSXElement"));

var _JSXAttribute = _interopRequireDefault(require("./JSXAttribute"));

var _JSXComment = _interopRequireDefault(require("./JSXComment"));

var _JSXText = _interopRequireDefault(require("./JSXText"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ATTRIBUTE_MAPPING = {
  for: 'htmlFor',
  class: 'className',
  autoreverse: 'autoReverse',
  externalresourcesrequired: 'externalResourcesRequired'
};
const ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    checked: 'defaultChecked',
    value: 'defaultValue',
    maxlength: 'maxLength'
  },
  form: {
    enctype: 'encType'
  } // Reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Element#SVG_elements

};
const ELEMENT_TAG_NAME_MAPPING = {
  a: 'a',
  altglyph: 'altGlyph',
  altglyphdef: 'altGlyphDef',
  altglyphitem: 'altGlyphItem',
  animate: 'animate',
  animatecolor: 'animateColor',
  animatemotion: 'animateMotion',
  animatetransform: 'animateTransform',
  audio: 'audio',
  canvas: 'canvas',
  circle: 'circle',
  clippath: 'clipPath',
  'color-profile': 'colorProfile',
  cursor: 'cursor',
  defs: 'defs',
  desc: 'desc',
  discard: 'discard',
  ellipse: 'ellipse',
  feblend: 'feBlend',
  fecolormatrix: 'feColorMatrix',
  fecomponenttransfer: 'feComponentTransfer',
  fecomposite: 'feComposite',
  feconvolvematrix: 'feConvolveMatrix',
  fediffuselighting: 'feDiffuseLighting',
  fedisplacementmap: 'feDisplacementMap',
  fedistantlight: 'feDistantLight',
  fedropshadow: 'feDropShadow',
  feflood: 'feFlood',
  fefunca: 'feFuncA',
  fefuncb: 'feFuncB',
  fefuncg: 'feFuncG',
  fefuncr: 'feFuncR',
  fegaussianblur: 'feGaussianBlur',
  feimage: 'feImage',
  femerge: 'feMerge',
  femergenode: 'feMergeNode',
  femorphology: 'feMorphology',
  feoffset: 'feOffset',
  fepointlight: 'fePointLight',
  fespecularlighting: 'feSpecularLighting',
  fespotlight: 'feSpotLight',
  fetile: 'feTile',
  feturbulence: 'feTurbulence',
  filter: 'filter',
  font: 'font',
  'font-face': 'fontFace',
  'font-face-format': 'fontFaceFormat',
  'font-face-name': 'fontFaceName',
  'font-face-src': 'fontFaceSrc',
  'font-face-uri': 'fontFaceUri',
  foreignobject: 'foreignObject',
  g: 'g',
  glyph: 'glyph',
  glyphref: 'glyphRef',
  hatch: 'hatch',
  hatchpath: 'hatchpath',
  hkern: 'hkern',
  iframe: 'iframe',
  image: 'image',
  line: 'line',
  lineargradient: 'linearGradient',
  marker: 'marker',
  mask: 'mask',
  mesh: 'mesh',
  meshgradient: 'meshgradient',
  meshpatch: 'meshpatch',
  meshrow: 'meshrow',
  metadata: 'metadata',
  'missing-glyph': 'missingGlyph',
  mpath: 'mpath',
  path: 'path',
  pattern: 'pattern',
  polygon: 'polygon',
  polyline: 'polyline',
  radialgradient: 'radialGradient',
  rect: 'rect',
  script: 'script',
  set: 'set',
  solidcolor: 'solidcolor',
  stop: 'stop',
  style: 'style',
  svg: 'svg',
  switch: 'switch',
  symbol: 'symbol',
  text: 'text',
  textpath: 'textPath',
  title: 'title',
  tref: 'tref',
  tspan: 'tspan',
  unknown: 'unknown',
  use: 'use',
  video: 'video',
  view: 'view',
  vkern: 'vkern'
};

function getAttributeName(attribute, node) {
  if (!attribute.name.startsWith('aria-') && !attribute.name.startsWith('data-')) {
    return ELEMENT_ATTRIBUTE_MAPPING[node.name] && ELEMENT_ATTRIBUTE_MAPPING[node.name][attribute.name] || ATTRIBUTE_MAPPING[attribute.name] || (0, _util.hyphenToCamelCase)(attribute.name.replace(':', '-'));
  }

  return attribute.name;
}

function transformTagName(tagName) {
  const lowercaseTagName = tagName.toLowerCase();
  return ELEMENT_TAG_NAME_MAPPING[lowercaseTagName] || lowercaseTagName;
}

function getAttributeValue(attribute) {
  return attribute.value;
}

function listToArray(list) {
  const array = [];

  for (let i = 0; i < list.length; i += 1) {
    array.push(list[i]);
  }

  return array;
}

var _default = {
  HTMLElement: {
    enter(path) {
      const jsxElement = new _JSXElement.default();
      jsxElement.name = transformTagName(path.node.tagName);
      jsxElement.attributes = listToArray(path.node.attributes);
      jsxElement.children = listToArray(path.node.childNodes);
      path.replace(jsxElement);
    }

  },
  HTMLAttribute: {
    enter(path) {
      const jsxAttribute = new _JSXAttribute.default();
      jsxAttribute.name = getAttributeName(path.node, path.parent);
      jsxAttribute.value = getAttributeValue(path.node);
      jsxAttribute.literal = (0, _util.isNumeric)(jsxAttribute.value);
      path.replace(jsxAttribute);
    }

  },
  HTMLComment: {
    enter(path) {
      const jsxComment = new _JSXComment.default();
      jsxComment.text = path.node.textContent.trim();
      path.replace(jsxComment);
    }

  },
  HTMLText: {
    enter(path) {
      const jsxText = new _JSXText.default();
      jsxText.text = path.node.textContent.trim();
      path.replace(jsxText);
    }

  }
};
exports.default = _default;