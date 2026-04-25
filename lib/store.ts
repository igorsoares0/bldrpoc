'use client'

import { create } from 'zustand'
import type { GridPlacement, GridProps, MenuSlot, Node, Page, Viewport } from './types'
import {
  updateNodeById,
  removeNodeById,
  addNodeToParent,
  insertNodeAfter,
  cloneNodeWithNewIds,
  getNodeById,
  getParentOfNode,
} from './tree-utils'
import {
  collectPlaceables,
  defaultDesktopPlacement,
  defaultMobilePlacement,
  migrateTreeToGrid,
  DEFAULT_ROW_HEIGHT,
  GRID_COLS_DESKTOP,
  GRID_COLS_MOBILE,
  type SnapGuides,
} from './grid-utils'
import { MENU_SLOTS, getMenuSlot } from './menu-utils'

export type DragSession = {
  id: string
  sectionId: string
  viewport: Viewport
  cols: number
  cellWidth: number
  rowHeight: number
  offsetCol: number
  offsetRow: number
  colSpan: number
  rowSpan: number
  snapshot: Record<string, GridPlacement>
  isMenuMode: boolean
  minColSpan: number
}

export type MenuDragSession = {
  id: string
  menuBarId: string
  sourceSlot: MenuSlot
}

export type MenuDropPreview = {
  menuBarId: string
  slot: MenuSlot
  index: number
}

const HISTORY_LIMIT = 50

type EditorState = {
  page: Page | null
  tree: Node
  selectedId: string | null
  editingId: string | null
  viewport: Viewport
  isDirty: boolean
  isSaving: boolean
  dragSession: DragSession | null
  dragGhost: GridPlacement | null
  dragSnapGuides: SnapGuides | null
  menuDragSession: MenuDragSession | null
  menuDropPreview: MenuDropPreview | null
  clipboard: Node | null
  past: Node[]
  future: Node[]

  initializeEditor: (page: Page) => void
  selectNode: (id: string | null) => void
  beginTextEdit: (id: string) => void
  endTextEdit: () => void
  updateNode: (id: string, props: Record<string, any>) => void
  addNode: (parentId: string, node: Node) => void
  deleteNode: (id: string) => void
  duplicateNode: (id: string) => void
  copyNode: (id: string) => void
  pasteNode: () => void
  nudgeSelected: (direction: 'up' | 'down' | 'left' | 'right', big: boolean) => void
  placeNodeInGrid: (
    sectionId: string,
    draggedId: string,
    placement: GridPlacement,
    snapshot: Record<string, GridPlacement>,
    viewport: Viewport,
  ) => void
  undo: () => void
  redo: () => void
  beginDrag: (session: DragSession) => void
  setDragGhost: (ghost: GridPlacement | null) => void
  setDragSnapGuides: (guides: SnapGuides | null) => void
  endDrag: () => void
  beginMenuDrag: (session: MenuDragSession) => void
  setMenuDropPreview: (preview: MenuDropPreview | null) => void
  endMenuDrag: () => void
  reorderMenuChild: (
    menuBarId: string,
    childId: string,
    targetSlot: MenuSlot,
    targetIndex: number,
  ) => void
  setViewport: (v: Viewport) => void
  saveToServer: () => Promise<void>
  updatePageTitle: (title: string) => void
}

function pushHistory(past: Node[], current: Node): Node[] {
  const next = past.concat(current)
  if (next.length > HISTORY_LIMIT) next.shift()
  return next
}

const emptyTree: Node = {
  id: 'root',
  type: 'section',
  props: {},
  children: [],
}

function shiftCopyPlacement(node: Node): void {
  const grid = node.props.grid as GridProps | undefined
  if (!grid) return
  if (grid.desktop) {
    grid.desktop = { ...grid.desktop, row: grid.desktop.row + grid.desktop.rowSpan }
  }
  if (grid.mobile) {
    grid.mobile = { ...grid.mobile, row: grid.mobile.row + grid.mobile.rowSpan }
  }
}

const TOP_LEVEL_TYPES = new Set(['section', 'menu-bar', 'footer'])
const LEAF_TYPES_SET = new Set(['text', 'image', 'button', 'form'])
const LEAF_CONTAINER_TYPES = new Set(['section', 'menu-bar', 'footer'])

function isPasteCompatible(
  copy: Node,
  targetParent: Node,
  rootId: string,
): boolean {
  const isRoot = targetParent.id === rootId
  if (LEAF_TYPES_SET.has(copy.type)) {
    return !isRoot && LEAF_CONTAINER_TYPES.has(targetParent.type)
  }
  if (TOP_LEVEL_TYPES.has(copy.type)) {
    return isRoot
  }
  return false
}

function applyPlacementsToChildren(
  section: Node,
  draggedId: string | null,
  draggedPlacement: GridPlacement | null,
  snapshot: Record<string, GridPlacement>,
  viewport: Viewport,
): Node {
  const placeables = collectPlaceables(section)
  const newChildren = placeables.map((child, index) => {
    const grid = (child.props.grid as { desktop?: GridPlacement; mobile?: GridPlacement } | undefined) ?? {}
    let desktop = grid.desktop
    let mobile = grid.mobile
    const snap = snapshot[child.id]
    const isDragged = child.id === draggedId

    if (viewport === 'desktop') {
      if (isDragged && draggedPlacement) desktop = draggedPlacement
      else if (snap) desktop = desktop ?? snap
      desktop = desktop ?? defaultDesktopPlacement(index)
      mobile = mobile ?? defaultMobilePlacement(index)
    } else {
      if (isDragged && draggedPlacement) mobile = draggedPlacement
      else if (snap) mobile = mobile ?? snap
      mobile = mobile ?? defaultMobilePlacement(index)
      desktop = desktop ?? defaultDesktopPlacement(index)
    }

    return {
      ...child,
      props: {
        ...child.props,
        grid: { desktop, mobile },
      },
    }
  })
  return { ...section, children: newChildren }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  page: null,
  tree: emptyTree,
  selectedId: null,
  editingId: null,
  viewport: 'desktop',
  isDirty: false,
  isSaving: false,
  dragSession: null,
  dragGhost: null,
  dragSnapGuides: null,
  menuDragSession: null,
  menuDropPreview: null,
  clipboard: null,
  past: [],
  future: [],

  initializeEditor: (page) => {
    const { tree: migrated, changed } = migrateTreeToGrid(page.content)
    set({
      page,
      tree: migrated,
      selectedId: null,
      editingId: null,
      viewport: 'desktop',
      isDirty: changed,
      isSaving: false,
      dragSession: null,
      dragGhost: null,
      dragSnapGuides: null,
      menuDragSession: null,
      menuDropPreview: null,
      past: [],
      future: [],
    })
  },

  selectNode: (id) =>
    set((state) => ({
      selectedId: id,
      editingId: state.editingId !== id ? null : state.editingId,
    })),

  beginTextEdit: (id) => set({ editingId: id, selectedId: id }),
  endTextEdit: () => set({ editingId: null }),

  updateNode: (id, props) => {
    const { tree, past } = get()
    const newTree = updateNodeById(tree, id, (node) => ({
      ...node,
      props: { ...node.props, ...props },
    }))
    set({
      tree: newTree,
      isDirty: true,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  addNode: (parentId, node) => {
    const { tree, past } = get()
    const newTree = addNodeToParent(tree, parentId, node)
    set({
      tree: newTree,
      isDirty: true,
      selectedId: node.id,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  deleteNode: (id) => {
    const { tree, selectedId, past } = get()
    if (id === tree.id) return
    const newTree = removeNodeById(tree, id)
    set({
      tree: newTree,
      isDirty: true,
      selectedId: selectedId === id ? null : selectedId,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  duplicateNode: (id) => {
    const { tree, past } = get()
    if (id === tree.id) return
    const source = getNodeById(tree, id)
    if (!source) return
    const copy = cloneNodeWithNewIds(source)
    shiftCopyPlacement(copy)
    const newTree = insertNodeAfter(tree, id, copy)
    set({
      tree: newTree,
      isDirty: true,
      selectedId: copy.id,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  copyNode: (id) => {
    const { tree } = get()
    if (id === tree.id) return
    const source = getNodeById(tree, id)
    if (!source) return
    set({ clipboard: cloneNodeWithNewIds(source) })
  },

  pasteNode: () => {
    const { clipboard, tree, selectedId, past } = get()
    if (!clipboard) return
    const copy = cloneNodeWithNewIds(clipboard)
    shiftCopyPlacement(copy)

    let newTree: Node | null = null
    if (selectedId && selectedId !== tree.id) {
      const parent = getParentOfNode(tree, selectedId)
      if (!parent) return
      if (!isPasteCompatible(copy, parent, tree.id)) return
      newTree = insertNodeAfter(tree, selectedId, copy)
    } else {
      if (!isPasteCompatible(copy, tree, tree.id)) return
      newTree = addNodeToParent(tree, tree.id, copy)
    }
    if (!newTree) return
    set({
      tree: newTree,
      isDirty: true,
      selectedId: copy.id,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  nudgeSelected: (direction, big) => {
    const { selectedId, tree, viewport, past } = get()
    if (!selectedId || selectedId === tree.id) return
    const node = getNodeById(tree, selectedId)
    if (!node) return
    const grid = node.props.grid as GridProps | undefined
    if (!grid) return
    const placement = viewport === 'desktop' ? grid.desktop : grid.mobile
    if (!placement) return

    const colStep = big ? 4 : 1
    const rowStep = big ? 4 : 1
    let { col, row, colSpan, rowSpan } = placement
    if (direction === 'up') row -= rowStep
    if (direction === 'down') row += rowStep
    if (direction === 'left') col -= colStep
    if (direction === 'right') col += colStep

    const cols = viewport === 'desktop' ? GRID_COLS_DESKTOP : GRID_COLS_MOBILE
    col = Math.max(1, Math.min(col, cols - colSpan + 1))
    row = Math.max(1, row)

    const newPlacement = { col, row, colSpan, rowSpan }
    const nextGrid: GridProps =
      viewport === 'desktop'
        ? { ...grid, desktop: newPlacement }
        : { ...grid, mobile: newPlacement }
    const newTree = updateNodeById(tree, selectedId, (n) => ({
      ...n,
      props: { ...n.props, grid: nextGrid },
    }))
    set({
      tree: newTree,
      isDirty: true,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  placeNodeInGrid: (sectionId, draggedId, placement, snapshot, viewport) => {
    const { tree, past } = get()
    const newTree = updateNodeById(tree, sectionId, (section) => {
      const updated = applyPlacementsToChildren(
        section,
        draggedId,
        placement,
        snapshot,
        viewport,
      )
      return {
        ...updated,
        props: {
          ...updated.props,
          rowHeight: section.props.rowHeight ?? DEFAULT_ROW_HEIGHT,
        },
      }
    })
    set({
      tree: newTree,
      isDirty: true,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  undo: () => {
    const { past, future, tree } = get()
    if (past.length === 0) return
    const previous = past[past.length - 1]
    set({
      tree: previous,
      past: past.slice(0, -1),
      future: future.concat(tree),
      isDirty: true,
      editingId: null,
    })
  },

  redo: () => {
    const { past, future, tree } = get()
    if (future.length === 0) return
    const next = future[future.length - 1]
    set({
      tree: next,
      past: past.concat(tree),
      future: future.slice(0, -1),
      isDirty: true,
      editingId: null,
    })
  },

  beginDrag: (session) =>
    set({ dragSession: session, dragGhost: null, dragSnapGuides: null }),
  setDragGhost: (ghost) => set({ dragGhost: ghost }),
  setDragSnapGuides: (guides) => set({ dragSnapGuides: guides }),
  endDrag: () =>
    set({ dragSession: null, dragGhost: null, dragSnapGuides: null }),

  beginMenuDrag: (session) =>
    set({ menuDragSession: session, menuDropPreview: null }),
  setMenuDropPreview: (preview) => set({ menuDropPreview: preview }),
  endMenuDrag: () => set({ menuDragSession: null, menuDropPreview: null }),

  reorderMenuChild: (menuBarId, childId, targetSlot, targetIndex) => {
    const { tree, past } = get()
    const newTree = updateNodeById(tree, menuBarId, (menuBar) => {
      const children = menuBar.children ?? []
      const dragged = children.find((c) => c.id === childId)
      if (!dragged) return menuBar
      const others = children.filter((c) => c.id !== childId)
      const updated: Node = {
        ...dragged,
        props: { ...dragged.props, slot: targetSlot },
      }
      const result: Node[] = []
      for (const slot of MENU_SLOTS) {
        const slotItems = others.filter((c) => getMenuSlot(c) === slot)
        if (slot === targetSlot) {
          const clamped = Math.max(0, Math.min(targetIndex, slotItems.length))
          result.push(...slotItems.slice(0, clamped), updated, ...slotItems.slice(clamped))
        } else {
          result.push(...slotItems)
        }
      }
      return { ...menuBar, children: result }
    })
    set({
      tree: newTree,
      isDirty: true,
      past: pushHistory(past, tree),
      future: [],
    })
  },

  setViewport: (v) => set({ viewport: v }),

  updatePageTitle: (title) => {
    set((state) => ({
      page: state.page ? { ...state.page, title } : null,
      isDirty: true,
    }))
  },

  saveToServer: async () => {
    const { page, tree, isSaving } = get()
    if (!page || isSaving) return
    set({ isSaving: true })
    try {
      await fetch(`/api/pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          content: tree,
          published: page.published,
        }),
      })
      set({ isDirty: false })
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      set({ isSaving: false })
    }
  },
}))
