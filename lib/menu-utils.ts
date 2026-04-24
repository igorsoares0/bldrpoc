import type { GridProps, MenuSlot, Node } from './types'

export const MENU_SLOTS: MenuSlot[] = ['left', 'center', 'right']

export function getMenuSlot(node: Node): MenuSlot {
  const s = node.props.slot
  return s === 'center' || s === 'right' ? s : 'left'
}

export function partitionMenuChildren(menuBar: Node): Record<MenuSlot, Node[]> {
  const out: Record<MenuSlot, Node[]> = { left: [], center: [], right: [] }
  ;(menuBar.children ?? []).forEach((c) => {
    out[getMenuSlot(c)].push(c)
  })
  return out
}

export function inferSlotFromGrid(node: Node, cols = 24): MenuSlot {
  const grid = node.props.grid as GridProps | undefined
  if (!grid?.desktop) return 'left'
  const center = grid.desktop.col + grid.desktop.colSpan / 2
  const third = cols / 3
  if (center <= third + 1) return 'left'
  if (center >= cols - third + 1) return 'right'
  return 'center'
}

export function migrateMenuBarChildren(menuBar: Node): { node: Node; changed: boolean } {
  let changed = false
  const newChildren = (menuBar.children ?? []).map((child) => {
    const hasSlot = child.props.slot === 'left' || child.props.slot === 'center' || child.props.slot === 'right'
    const hasGrid = child.props.grid !== undefined
    if (hasSlot && !hasGrid) return child
    changed = true
    const slot: MenuSlot = hasSlot ? (child.props.slot as MenuSlot) : inferSlotFromGrid(child)
    const nextProps: Record<string, any> = { ...child.props, slot }
    delete nextProps.grid
    return { ...child, props: nextProps }
  })
  if (!changed) return { node: menuBar, changed: false }
  return { node: { ...menuBar, children: newChildren }, changed: true }
}
