import type { GridPlacement, GridProps, Node, NodeType, Viewport } from './types'

export const GRID_COLS_DESKTOP = 24
export const GRID_COLS_MOBILE = 8
export const DEFAULT_ROW_HEIGHT = 24
export const MOBILE_BREAKPOINT_PX = 768
export const REFERENCE_DESKTOP_WIDTH = 1280

export const LEAF_TYPES: NodeType[] = ['text', 'image', 'button', 'form']
export const GRID_CONTAINER_TYPES: NodeType[] = ['section', 'menu-bar', 'footer']

export function isLeafType(type: NodeType): boolean {
  return LEAF_TYPES.includes(type)
}

export function isGridContainerType(type: NodeType): boolean {
  return GRID_CONTAINER_TYPES.includes(type)
}

export function colsForViewport(viewport: Viewport): number {
  return viewport === 'desktop' ? GRID_COLS_DESKTOP : GRID_COLS_MOBILE
}

export function defaultMobilePlacement(index: number): GridPlacement {
  const rowSpan = 4
  return {
    col: 1,
    row: index * rowSpan + 1,
    colSpan: GRID_COLS_MOBILE,
    rowSpan,
  }
}

export function defaultDesktopPlacement(index: number): GridPlacement {
  const rowSpan = 4
  return {
    col: 1,
    row: index * rowSpan + 1,
    colSpan: GRID_COLS_DESKTOP,
    rowSpan,
  }
}

export function getActivePlacement(
  node: Node,
  viewport: Viewport,
  index: number,
): GridPlacement {
  const grid = node.props.grid as GridProps | undefined
  if (!grid) {
    return viewport === 'desktop'
      ? defaultDesktopPlacement(index)
      : defaultMobilePlacement(index)
  }
  if (viewport === 'desktop') return grid.desktop ?? defaultDesktopPlacement(index)
  return grid.mobile ?? defaultMobilePlacement(index)
}

export function setPlacement(
  node: Node,
  viewport: Viewport,
  placement: GridPlacement,
  fallbackIndex: number,
): Node {
  const existing = (node.props.grid as GridProps | undefined) ?? {
    desktop: defaultDesktopPlacement(fallbackIndex),
  }
  const next: GridProps =
    viewport === 'desktop'
      ? { ...existing, desktop: placement }
      : { ...existing, mobile: placement }
  return { ...node, props: { ...node.props, grid: next } }
}

export function ensureGrid(node: Node, index: number): Node {
  const grid = node.props.grid as GridProps | undefined
  if (grid?.desktop) return node
  const desktop = grid?.desktop ?? defaultDesktopPlacement(index)
  return {
    ...node,
    props: {
      ...node.props,
      grid: { ...(grid ?? {}), desktop },
    },
  }
}

export function clampPlacement(
  placement: GridPlacement,
  cols: number,
): GridPlacement {
  const colSpan = Math.max(1, Math.min(placement.colSpan, cols))
  const col = Math.max(1, Math.min(placement.col, cols - colSpan + 1))
  const rowSpan = Math.max(1, placement.rowSpan)
  const row = Math.max(1, placement.row)
  return { col, row, colSpan, rowSpan }
}

export type ResizeAnchor = 'nw' | 'ne' | 'sw' | 'se'

export function computeResizePlacement(
  anchor: ResizeAnchor,
  cursorX: number,
  cursorY: number,
  start: GridPlacement,
  metrics: { contentLeft: number; contentTop: number; cellWidth: number; rowHeight: number },
  cols: number,
): GridPlacement {
  const cursorCol =
    Math.round((cursorX - metrics.contentLeft) / metrics.cellWidth) + 1
  const cursorRow =
    Math.round((cursorY - metrics.contentTop) / metrics.rowHeight) + 1
  const origEndCol = start.col + start.colSpan - 1
  const origEndRow = start.row + start.rowSpan - 1

  let col = start.col
  let row = start.row
  let colSpan = start.colSpan
  let rowSpan = start.rowSpan

  if (anchor === 'nw' || anchor === 'sw') {
    col = Math.max(1, Math.min(cursorCol, origEndCol))
    colSpan = origEndCol - col + 1
  } else {
    colSpan = Math.max(1, Math.min(cursorCol - col + 1, cols - col + 1))
  }

  if (anchor === 'nw' || anchor === 'ne') {
    row = Math.max(1, Math.min(cursorRow, origEndRow))
    rowSpan = origEndRow - row + 1
  } else {
    rowSpan = Math.max(1, cursorRow - row + 1)
  }

  return clampPlacement({ col, row, colSpan, rowSpan }, cols)
}

export function placementToStyle(placement: GridPlacement) {
  return {
    gridColumn: `${placement.col} / span ${placement.colSpan}`,
    gridRow: `${placement.row} / span ${placement.rowSpan}`,
  }
}

export function collectLeaves(node: Node): Node[] {
  const out: Node[] = []
  const walk = (n: Node, isRoot: boolean) => {
    if (!isRoot && isLeafType(n.type)) {
      out.push(n)
      return
    }
    n.children?.forEach((c) => walk(c, false))
  }
  walk(node, true)
  return out
}

function leafFitCss(leaf: Node): string {
  if (leaf.type === 'text') {
    const ta = leaf.props.textAlign as string | undefined
    const justify = ta === 'right' ? 'end' : ta === 'center' ? 'center' : 'start'
    return `justify-self:${justify};align-self:center;min-width:0;`
  }
  if (leaf.type === 'button' || leaf.type === 'image' || leaf.type === 'form') {
    return 'justify-self:stretch;align-self:stretch;min-width:0;'
  }
  return 'justify-self:center;align-self:center;min-width:0;'
}

export function buildGridStyles(section: Node): string {
  const sectionId = section.id
  const rowHeight = section.props.rowHeight ?? DEFAULT_ROW_HEIGHT
  const cls = `grid-${cssId(sectionId)}`

  const leaves = (section.children ?? []).filter((c) => isLeafType(c.type))

  const desktopRules = leaves
    .map((leaf, i) => {
      const p = getActivePlacement(leaf, 'desktop', i)
      return `.${cls} > [data-id="${cssId(leaf.id)}"]{grid-column:${p.col}/span ${p.colSpan};grid-row:${p.row}/span ${p.rowSpan};${leafFitCss(leaf)}}`
    })
    .join('')

  const mobileRules = leaves
    .map((leaf, i) => {
      const p = getActivePlacement(leaf, 'mobile', i)
      return `.${cls} > [data-id="${cssId(leaf.id)}"]{grid-column:${p.col}/span ${p.colSpan};grid-row:${p.row}/span ${p.rowSpan};}`
    })
    .join('')

  return [
    `.${cls}{display:grid;grid-template-columns:repeat(${GRID_COLS_DESKTOP},1fr);grid-auto-rows:${rowHeight}px;position:relative;}`,
    desktopRules,
    `@media (max-width:${MOBILE_BREAKPOINT_PX - 1}px){`,
    `.${cls}{grid-template-columns:repeat(${GRID_COLS_MOBILE},1fr);}`,
    mobileRules,
    `}`,
  ].join('')
}

export function gridSectionClassName(sectionId: string): string {
  return `grid-${cssId(sectionId)}`
}

function cssId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_')
}

function legacyXyToPlacement(node: Node): GridPlacement | null {
  const x = node.props.x
  const y = node.props.y
  const w = node.props.w
  if (typeof x !== 'number' || typeof y !== 'number') return null
  const cellW = REFERENCE_DESKTOP_WIDTH / GRID_COLS_DESKTOP
  const colSpan = Math.max(
    1,
    Math.round((typeof w === 'number' ? w : cellW * 6) / cellW),
  )
  const col = Math.max(
    1,
    Math.min(GRID_COLS_DESKTOP - colSpan + 1, Math.round(x / cellW) + 1),
  )
  const rowSpan = node.type === 'image' ? 8 : 4
  const row = Math.max(1, Math.round(y / DEFAULT_ROW_HEIGHT) + 1)
  return { col, row, colSpan, rowSpan }
}

function stripLegacyLeafProps(props: Record<string, unknown>): Record<string, unknown> {
  const next = { ...props }
  delete next.x
  delete next.y
  delete next.w
  return next
}

function stripLegacyContainerProps(
  props: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...props }
  delete next.freeLayout
  delete next.gridLayout
  return next
}

export function migrateTreeToGrid(tree: Node): { tree: Node; changed: boolean } {
  let changed = false

  function flattenContainer(node: Node): Node {
    const leaves = collectLeaves(node)
    const newChildren = leaves.map((leaf, i) => {
      let next = leaf
      const legacy = legacyXyToPlacement(next)
      const hasGrid = (next.props.grid as GridProps | undefined)?.desktop
      const hasLegacyProps =
        next.props.x !== undefined ||
        next.props.y !== undefined ||
        next.props.w !== undefined
      if (legacy) {
        changed = true
        next = {
          ...next,
          props: {
            ...stripLegacyLeafProps(next.props),
            grid: {
              desktop: legacy,
            },
          },
        }
      } else if (hasLegacyProps) {
        changed = true
        next = { ...next, props: stripLegacyLeafProps(next.props) }
      }
      if (!hasGrid && !legacy) {
        changed = true
        next = {
          ...next,
          props: {
            ...next.props,
            grid: {
              desktop: defaultDesktopPlacement(i),
              mobile: defaultMobilePlacement(i),
            },
          },
        }
      }
      return next
    })

    const sameOrder =
      newChildren.length === (node.children?.length ?? 0) &&
      newChildren.every((c, i) => c === node.children?.[i])
    if (!sameOrder) changed = true

    if (node.props.freeLayout || node.props.gridLayout !== undefined) {
      changed = true
    }

    return {
      ...node,
      props: stripLegacyContainerProps(node.props),
      children: newChildren,
    }
  }

  function walk(node: Node, depth: number): Node {
    const isRoot = depth === 0

    if (isRoot) {
      let next = node
      if (next.props.freeLayout || next.props.gridLayout !== undefined) {
        changed = true
        next = { ...next, props: stripLegacyContainerProps(next.props) }
      }
      if (next.children) {
        const newChildren = next.children.map((c) => walk(c, depth + 1))
        if (newChildren.some((c, i) => c !== next.children![i])) {
          next = { ...next, children: newChildren }
        }
      }
      return next
    }

    if (isGridContainerType(node.type)) {
      return flattenContainer(node)
    }

    return node
  }

  const newTree = walk(tree, 0)
  return { tree: newTree, changed }
}

export const migrateFreeLayoutToGrid = migrateTreeToGrid
