import parse from 'h2x-parse'
import { getNodeType, NODE_TYPE } from '.'

describe('getNodeType', () => {
  it('should use constructor.NODE_TYPE if available', () => {
    class MyNode {
      static [NODE_TYPE] = 'MyNode'
    }

    const node = new MyNode()
    expect(getNodeType(node)).toBe('MyNode')
  })

  it('should support HTML Nodes', () => {
    const ast = parse(`
      <div id="foo"></div>
    `)
    expect(getNodeType(ast)).toBe('HTMLElement')
    expect(getNodeType(ast.childNodes[1].attributes[0])).toBe('HTMLAttribute')
  })
})
