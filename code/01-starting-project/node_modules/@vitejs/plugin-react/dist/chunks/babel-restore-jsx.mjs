/**
 * https://github.com/flying-sheep/babel-plugin-transform-react-createelement-to-jsx
 * @license GNU General Public License v3.0
 */
function babelRestoreJsx({ types: t }, { reactAlias = "React" }) {
  function getJSXNode(node) {
    if (!isReactCreateElement(node)) {
      return null;
    }
    const [nameNode, propsNode, ...childNodes] = node.arguments;
    const name = getJSXName(nameNode);
    if (name == null) {
      return null;
    }
    const props = getJSXProps(propsNode);
    if (props == null) {
      return null;
    }
    const children = getJSXChildren(childNodes);
    if (children == null) {
      return null;
    }
    if (t.isJSXMemberExpression(name) && t.isJSXIdentifier(name.object) && name.object.name === reactAlias && name.property.name === "Fragment") {
      return t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        children
      );
    }
    const selfClosing = children.length === 0;
    const startTag = t.jsxOpeningElement(name, props, selfClosing);
    startTag.loc = node.loc;
    const endTag = selfClosing ? null : t.jsxClosingElement(name);
    return t.jsxElement(startTag, endTag, children, selfClosing);
  }
  function getJSXName(node) {
    if (node == null) {
      return null;
    }
    const name = getJSXIdentifier(node, true);
    if (name != null) {
      return name;
    }
    if (!t.isMemberExpression(node)) {
      return null;
    }
    const object = getJSXName(node.object);
    const property = getJSXName(node.property);
    if (object == null || property == null) {
      return null;
    }
    return t.jsxMemberExpression(object, property);
  }
  function getJSXProps(node) {
    if (node == null || isNullLikeNode(node)) {
      return [];
    }
    if (t.isCallExpression(node) && t.isIdentifier(node.callee, { name: "_extends" })) {
      const props = node.arguments.map(getJSXProps);
      if (props.every((prop) => prop != null)) {
        return [].concat(...props);
      }
    }
    if (!t.isObjectExpression(node) && t.isExpression(node))
      return [t.jsxSpreadAttribute(node)];
    if (!isPlainObjectExpression(node)) {
      return null;
    }
    return node.properties.map(
      (prop) => t.isObjectProperty(prop) ? t.jsxAttribute(
        getJSXIdentifier(prop.key),
        getJSXAttributeValue(prop.value)
      ) : t.jsxSpreadAttribute(prop.argument)
    ).filter(
      (prop) => t.isJSXIdentifier(prop.name) ? prop.name.name !== "__self" && prop.name.name !== "__source" : true
    );
  }
  function getJSXChild(node) {
    if (t.isStringLiteral(node)) {
      return t.jsxText(node.value);
    }
    if (isReactCreateElement(node)) {
      return getJSXNode(node);
    }
    if (t.isExpression(node)) {
      return t.jsxExpressionContainer(node);
    }
    return null;
  }
  function getJSXChildren(nodes) {
    const children = nodes.filter((node) => !isNullLikeNode(node)).map(getJSXChild);
    if (children.some((child) => child == null)) {
      return null;
    }
    return children;
  }
  function getJSXIdentifier(node, tag = false) {
    if (t.isIdentifier(node) && (!tag || node.name.match(/^[A-Z]/))) {
      return t.jsxIdentifier(node.name);
    }
    if (t.isStringLiteral(node)) {
      return t.jsxIdentifier(node.value);
    }
    return null;
  }
  function getJSXAttributeValue(node) {
    if (t.isStringLiteral(node)) {
      return node;
    }
    if (t.isJSXElement(node)) {
      return node;
    }
    if (t.isExpression(node)) {
      return t.jsxExpressionContainer(node);
    }
    return null;
  }
  const isReactCreateElement = (node) => t.isCallExpression(node) && t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object, { name: reactAlias }) && t.isIdentifier(node.callee.property, { name: "createElement" }) && !node.callee.computed;
  const isNullLikeNode = (node) => t.isNullLiteral(node) || t.isIdentifier(node, { name: "undefined" });
  const isPlainObjectExpression = (node) => t.isObjectExpression(node) && node.properties.every(
    (property) => t.isSpreadElement(property) || t.isObjectProperty(property, { computed: false }) && getJSXIdentifier(property.key) != null && getJSXAttributeValue(property.value) != null
  );
  return {
    visitor: {
      CallExpression(path) {
        const node = getJSXNode(path.node);
        if (node == null) {
          return null;
        }
        path.replaceWith(node);
      }
    }
  };
}

export { babelRestoreJsx as default };
