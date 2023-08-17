import { VISITOR_KEYS } from './symbols'

function getNodeVisitorKeys(node) {
  return node.constructor[VISITOR_KEYS] || null
}

export default getNodeVisitorKeys
