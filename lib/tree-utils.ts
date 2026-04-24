import type { Node } from './types'

export function getNodeById(tree: Node, id: string): Node | null {
  if (tree.id === id) return tree
  if (tree.children) {
    for (const child of tree.children) {
      const found = getNodeById(child, id)
      if (found) return found
    }
  }
  return null
}

export function updateNodeById(
  tree: Node,
  id: string,
  updater: (node: Node) => Node,
): Node {
  if (tree.id === id) return updater(tree)
  if (!tree.children) return tree
  const newChildren = tree.children.map((child) =>
    updateNodeById(child, id, updater),
  )
  if (newChildren.every((c, i) => c === tree.children![i])) return tree
  return { ...tree, children: newChildren }
}

export function removeNodeById(tree: Node, id: string): Node {
  if (!tree.children) return tree
  const filtered = tree.children.filter((child) => child.id !== id)
  const newChildren = filtered.map((child) => removeNodeById(child, id))
  if (
    newChildren.length === tree.children.length &&
    newChildren.every((c, i) => c === tree.children![i])
  ) {
    return tree
  }
  return { ...tree, children: newChildren }
}

export function getParentOfNode(tree: Node, childId: string): Node | null {
  if (!tree.children) return null
  for (const child of tree.children) {
    if (child.id === childId) return tree
    const found = getParentOfNode(child, childId)
    if (found) return found
  }
  return null
}

export function addNodeToParent(
  tree: Node,
  parentId: string,
  newNode: Node,
): Node {
  if (tree.id === parentId) {
    return {
      ...tree,
      children: [...(tree.children || []), newNode],
    }
  }
  if (!tree.children) return tree
  const newChildren = tree.children.map((child) =>
    addNodeToParent(child, parentId, newNode),
  )
  if (newChildren.every((c, i) => c === tree.children![i])) return tree
  return { ...tree, children: newChildren }
}

export function insertNodeAfter(
  tree: Node,
  siblingId: string,
  newNode: Node,
): Node {
  if (!tree.children) return tree
  const idx = tree.children.findIndex((c) => c.id === siblingId)
  if (idx >= 0) {
    const children = [...tree.children]
    children.splice(idx + 1, 0, newNode)
    return { ...tree, children }
  }
  const newChildren = tree.children.map((child) =>
    insertNodeAfter(child, siblingId, newNode),
  )
  if (newChildren.every((c, i) => c === tree.children![i])) return tree
  return { ...tree, children: newChildren }
}

export function cloneNodeWithNewIds(node: Node): Node {
  return {
    id: crypto.randomUUID(),
    type: node.type,
    props: JSON.parse(JSON.stringify(node.props)),
    children: node.children?.map(cloneNodeWithNewIds),
  }
}
