"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _NodePath = _interopRequireDefault(require("./NodePath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TraversalContext {
  constructor({
    state,
    opts
  }) {
    this.state = state;
    this.opts = opts;
  }

  visit(node, key) {
    const nodes = node[key];
    if (!nodes) return false;
    if (typeof nodes.length === 'number') return this.visitMultiple(nodes, node, key);
    return this.visitSingle(node, key);
  }

  visitMultiple(container, parent, listKey) {
    if (container.length === 0) return false;
    let shouldStop = false;
    Array.from(container).forEach((value, key) => {
      if (shouldStop) return;
      const nodePath = this.create(parent, container, key, listKey);
      if (nodePath && nodePath.visit()) shouldStop = true;
    });
    return shouldStop;
  }

  visitSingle(node, key) {
    const nodePath = this.create(node, node, key);
    if (!nodePath) return false;
    return nodePath.visit();
  }

  create(parent, container, key, listKey) {
    return _NodePath.default.get({
      parent,
      container,
      key,
      listKey,
      context: this
    });
  }

}

var _default = TraversalContext;
exports.default = _default;