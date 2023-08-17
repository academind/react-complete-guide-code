"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util");

// Inspired by https://github.com/reactjs/react-magic/blob/master/src/htmltojsx.js

/**
 * Determines if the CSS value can be converted from a
 * 'px' suffixed string to a numeric value.
 *
 * @param {string} value CSS property value
 * @return {boolean}
 */
function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value);
}
/**
 * Format style key into JSX style object key.
 *
 * @param {string} key
 * @return {string}
 */


function formatKey(key) {
  key = key.toLowerCase(); // Don't capitalize -ms- prefix

  if (/^-ms-/.test(key)) key = key.substr(1);
  return (0, _util.hyphenToCamelCase)(key);
}
/**
 * Format style value into JSX style object value.
 *
 * @param {string} key
 * @return {string}
 */


function formatValue(value) {
  if ((0, _util.isNumeric)(value)) return Number(value);
  if (isConvertiblePixelValue(value)) return Number((0, _util.trimEnd)(value, 'px'));
  return value;
}
/**
 * Handle parsing of inline styles.
 *
 * @param {string} rawStyle
 * @returns {object}
 */


function stringToObjectStyle(rawStyle) {
  const entries = rawStyle.split(';');
  return entries.reduce((styles, style) => {
    style = style.trim();
    const firstColon = style.indexOf(':');
    const value = style.substr(firstColon + 1).trim();
    const key = style.substr(0, firstColon);

    if (key !== '') {
      styles[formatKey(key)] = formatValue(value);
    }

    return styles;
  }, {});
}

var _default = stringToObjectStyle;
exports.default = _default;