import { VISITOR_KEYS } from './symbols'
import fromHtmlAttribute from './fromHtmlAttribute'

const HTML_ELEMENT_PROPERTIES = ['tagName', 'ownerDocument', 'textContent']

class HTMLElementNode {
  static [VISITOR_KEYS] = ['childNodes', 'attributes']

  constructor(originalNode) {
    this.originalNode = originalNode
    this.childNodes = originalNode.childNodes
      ? Array.from(originalNode.childNodes).map(childNode =>
          fromHtmlElement(childNode),
        )
      : null
    this.attributes = originalNode.attributes
      ? Array.from(originalNode.attributes).map(attribute =>
          fromHtmlAttribute(attribute),
        )
      : null
    HTML_ELEMENT_PROPERTIES.forEach(property => {
      this[property] = originalNode[property]
    })
  }
}

function fromHtmlElement(htmlNode) {
  return new HTMLElementNode(htmlNode)
}

export default fromHtmlElement
