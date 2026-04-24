import type { GridPlacement, GridProps, Node, NodeType, Viewport } from './types'
import { migrateMenuBarChildren } from './menu-utils'

export const GRID_COLS_DESKTOP = 24
export const GRID_COLS_MOBILE = 8
export const DEFAULT_ROW_HEIGHT = 8
export const ROW_SCHEMA_VERSION = 2
export const MOBILE_BREAKPOINT_PX = 768
export const REFERENCE_DESKTOP_WIDTH = 1280

export const LEAF_TYPES: NodeType[] = ['text', 'image', 'button', 'form']
export const GRID_CONTAINER_TYPES: NodeType[] = ['section', 'menu-bar', 'footer']
export const MENU_MODE_CONTAINER_TYPES: NodeType[] = ['menu-bar']

export function isLeafType(type: NodeType): boolean {
  return LEAF_TYPES.includes(type)
}

export function isGridContainerType(type: NodeType): boolean {
  return GRID_CONTAINER_TYPES.includes(type)
}

export function isMenuModeContainerType(type: NodeType | undefined | null): boolean {
  return type ? MENU_MODE_CONTAINER_TYPES.includes(type) : false
}

export function isPlaceable(type: NodeType): boolean {
  return isLeafType(type) || isGridContainerType(type)
}

export function collectPlaceables(section: Node): Node[] {
  return (section.children ?? []).filter((c) => isPlaceable(c.type))
}

export function colsForViewport(viewport: Viewport): number {
  return viewport === 'desktop' ? GRID_COLS_DESKTOP : GRID_COLS_MOBILE
}

export function defaultMobilePlacement(index: number): GridPlacement {
  const rowSpan = 12
  return {
    col: 1,
    row: index * rowSpan + 1,
    colSpan: GRID_COLS_MOBILE,
    rowSpan,
  }
}

export function defaultDesktopPlacement(index: number): GridPlacement {
  const rowSpan = 12
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

export function snapshotPlacementsFromTree(
  section: Node,
  viewport: Viewport,
): Record<string, GridPlacement> {
  const out: Record<string, GridPlacement> = {}
  collectPlaceables(section).forEach((child, i) => {
    out[child.id] = getActivePlacement(child, viewport, i)
  })
  return out
}

export type SnapGuides = { cols: number[]; rows: number[] }
export type SnapResult = { placement: GridPlacement; guides: SnapGuides }

export function snapPlacementToSiblings(
  raw: GridPlacement,
  snapshot: Record<string, GridPlacement>,
  draggedId: string,
  threshold: { col: number; row: number } = { col: 1, row: 2 },
): SnapResult {
  const colEdges: number[] = []
  const rowEdges: number[] = []
  for (const [id, p] of Object.entries(snapshot)) {
    if (id === draggedId) continue
    colEdges.push(p.col, p.col + p.colSpan)
    rowEdges.push(p.row, p.row + p.rowSpan)
  }

  const draggedColEdges = [raw.col, raw.col + raw.colSpan]
  const draggedRowEdges = [raw.row, raw.row + raw.rowSpan]

  let bestColDelta = 0
  let bestColAbs = Infinity
  for (const d of draggedColEdges) {
    for (const s of colEdges) {
      const delta = s - d
      const abs = Math.abs(delta)
      if (abs <= threshold.col && abs < bestColAbs) {
        bestColAbs = abs
        bestColDelta = delta
      }
    }
  }

  let bestRowDelta = 0
  let bestRowAbs = Infinity
  for (const d of draggedRowEdges) {
    for (const s of rowEdges) {
      const delta = s - d
      const abs = Math.abs(delta)
      if (abs <= threshold.row && abs < bestRowAbs) {
        bestRowAbs = abs
        bestRowDelta = delta
      }
    }
  }

  const placement: GridPlacement = {
    col: raw.col + bestColDelta,
    row: raw.row + bestRowDelta,
    colSpan: raw.colSpan,
    rowSpan: raw.rowSpan,
  }

  const guideCols = new Set<number>()
  const guideRows = new Set<number>()
  if (bestColAbs <= threshold.col) {
    const left = placement.col
    const right = placement.col + placement.colSpan
    for (const s of colEdges) {
      if (s === left || s === right) guideCols.add(s)
    }
  }
  if (bestRowAbs <= threshold.row) {
    const top = placement.row
    const bottom = placement.row + placement.rowSpan
    for (const s of rowEdges) {
      if (s === top || s === bottom) guideRows.add(s)
    }
  }

  return {
    placement,
    guides: { cols: Array.from(guideCols), rows: Array.from(guideRows) },
  }
}

function placeableFitCss(node: Node, parentType?: NodeType): string {
  if (isMenuModeContainerType(parentType)) {
    const ta = node.type === 'text' ? (node.props.textAlign as string | undefined) : undefined
    const justify = ta === 'right' ? 'end' : ta === 'center' ? 'center' : 'start'
    return `justify-self:${justify};align-self:center;min-width:0;white-space:nowrap;`
  }
  if (node.type === 'text') {
    const ta = node.props.textAlign as string | undefined
    const justify = ta === 'right' ? 'end' : ta === 'center' ? 'center' : 'start'
    return `justify-self:${justify};align-self:center;min-width:0;`
  }
  if (
    node.type === 'button' ||
    node.type === 'image' ||
    node.type === 'form' ||
    isGridContainerType(node.type)
  ) {
    return 'justify-self:stretch;align-self:stretch;min-width:0;min-height:0;'
  }
  return 'justify-self:center;align-self:center;min-width:0;'
}

export function buildGridStyles(section: Node): string {
  const sectionId = section.id
  const rowHeight = section.props.rowHeight ?? DEFAULT_ROW_HEIGHT
  const cls = `grid-${cssId(sectionId)}`

  const placeables = collectPlaceables(section)

  const desktopRules = placeables
    .map((child, i) => {
      const p = getActivePlacement(child, 'desktop', i)
      return `.${cls} > [data-id="${cssId(child.id)}"]{grid-column:${p.col}/span ${p.colSpan};grid-row:${p.row}/span ${p.rowSpan};${placeableFitCss(child, section.type)}}`
    })
    .join('')

  const mobileRules = placeables
    .map((child, i) => {
      const p = getActivePlacement(child, 'mobile', i)
      return `.${cls} > [data-id="${cssId(child.id)}"]{grid-column:${p.col}/span ${p.colSpan};grid-row:${p.row}/span ${p.rowSpan};}`
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

const LEGACY_ROW_HEIGHT = 24

function legacyXyToPlacement(node: Node): GridPlacement | null {
  // Produces placements in legacy 24px-row units. The row-schema pass
  // multiplies them by 3 to land on the new 8px-row units.
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
  const row = Math.max(1, Math.round(y / LEGACY_ROW_HEIGHT) + 1)
  return { col, row, colSpan, rowSpan }
}

function legacyDefaultPlacement(index: number, cols: number): GridPlacement {
  // Pre-schema-v2 defaults (24px-row units). The schema pass triples them.
  const rowSpan = 4
  return { col: 1, row: index * rowSpan + 1, colSpan: cols, rowSpan }
}

function tripleRows(p: GridPlacement): GridPlacement {
  return {
    ...p,
    row: (p.row - 1) * 3 + 1,
    rowSpan: p.rowSpan * 3,
  }
}

function migrateContainerRows(container: Node): Node {
  if (container.type === 'menu-bar') return container
  const rh = container.props.rowHeight
  if (rh !== undefined && rh !== LEGACY_ROW_HEIGHT) return container

  const newChildren = (container.children ?? []).map((child) => {
    const grid = child.props.grid as GridProps | undefined
    if (!grid) return child
    const next: GridProps = { desktop: tripleRows(grid.desktop) }
    if (grid.mobile) next.mobile = tripleRows(grid.mobile)
    return { ...child, props: { ...child.props, grid: next } }
  })

  const nextProps = { ...container.props }
  if (rh === LEGACY_ROW_HEIGHT) delete nextProps.rowHeight

  return { ...container, props: nextProps, children: newChildren }
}

function rowSchemaPass(tree: Node): Node {
  function walk(node: Node, isRoot: boolean): Node {
    let next = node
    if (!isRoot && isGridContainerType(next.type) && next.type !== 'menu-bar') {
      next = migrateContainerRows(next)
    }
    if (next.children) {
      next = { ...next, children: next.children.map((c) => walk(c, false)) }
    }
    return next
  }
  return walk(tree, true)
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
  const isLegacyRowSchema = tree.props.rowSchema !== ROW_SCHEMA_VERSION

  function defaultDesktop(index: number): GridPlacement {
    return isLegacyRowSchema
      ? legacyDefaultPlacement(index, GRID_COLS_DESKTOP)
      : defaultDesktopPlacement(index)
  }
  function defaultMobile(index: number): GridPlacement {
    return isLegacyRowSchema
      ? legacyDefaultPlacement(index, GRID_COLS_MOBILE)
      : defaultMobilePlacement(index)
  }

  function ensurePlacement(node: Node, index: number): Node {
    let next = node
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
          grid: { desktop: legacy },
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
            desktop: defaultDesktop(index),
            mobile: defaultMobile(index),
          },
        },
      }
    }
    return next
  }

  function walkContainer(container: Node): Node {
    const isMenuBar = container.type === 'menu-bar'
    const newChildren = (container.children ?? []).map((child, i) => {
      let next = child
      if (!isMenuBar && isPlaceable(next.type)) next = ensurePlacement(next, i)
      if (isGridContainerType(next.type)) next = walkContainer(next)
      return next
    })
    const sameChildren =
      newChildren.length === (container.children?.length ?? 0) &&
      newChildren.every((c, i) => c === container.children?.[i])
    if (!sameChildren) changed = true
    if (container.props.freeLayout || container.props.gridLayout !== undefined) {
      changed = true
    }
    let result: Node = {
      ...container,
      props: stripLegacyContainerProps(container.props),
      children: newChildren,
    }
    if (isMenuBar) {
      const migrated = migrateMenuBarChildren(result)
      if (migrated.changed) changed = true
      result = migrated.node
    }
    return result
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
      return walkContainer(node)
    }

    return node
  }

  let newTree = walk(tree, 0)
  if (isLegacyRowSchema) {
    newTree = rowSchemaPass(newTree)
    newTree = {
      ...newTree,
      props: { ...newTree.props, rowSchema: ROW_SCHEMA_VERSION },
    }
    changed = true
  }
  return { tree: newTree, changed }
}

export const migrateFreeLayoutToGrid = migrateTreeToGrid
