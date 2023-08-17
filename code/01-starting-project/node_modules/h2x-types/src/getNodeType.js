import * as HTMLNodeTypes from './HTMLNodeTypes'
import { NODE_TYPE } from './symbols'

const getHTMLNodeType = node => {
  const { originalNode } = node
  if (!originalNode) return null
  if (originalNode.constructor.name === 'Attr') return 'HTMLAttribute'

  switch (originalNode.nodeType) {
    case HTMLNodeTypes.TEXT_NODE:
      return 'HTMLText'
    case HTMLNodeTypes.ELEMENT_NODE:
    case HTMLNodeTypes.FRAGMENT_NODE:
      return 'HTMLElement'
    case HTMLNodeTypes.COMMENT_NODE:
      return 'HTMLComment'
    default:
      return null
  }
}

function getNodeType(node) {
  if (node.constructor[NODE_TYPE]) return node.constructor[NODE_TYPE]
  const htmlNodeType = getHTMLNodeType(node)
  if (htmlNodeType) return htmlNodeType
  throw new Error(`Unknown node ${node}`)
}

export default getNodeType
