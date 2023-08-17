import { VISITOR_KEYS } from './symbols'

const HTML_ELEMENT_PROPERTIES = ['name', 'value']

class HTMLAttributeNode {
  static [VISITOR_KEYS] = null

  constructor(originalNode) {
    this.originalNode = originalNode
    HTML_ELEMENT_PROPERTIES.forEach(property => {
      this[property] = originalNode[property]
    })
  }
}

function fromHtmlAttribute(attribute) {
  return new HTMLAttributeNode(attribute)
}

export default fromHtmlAttribute
