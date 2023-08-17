"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Generator {
  constructor() {
    _defineProperty(this, "output", '');

    _defineProperty(this, "level", 0);
  }

  indent() {
    this.level += 1;
  }

  deindent() {
    this.level -= 1;
  }

  writeLine(code) {
    this.output += `${'  '.repeat(this.level)}${code}\n`;
  }

}

var _default = Generator;
exports.default = _default;