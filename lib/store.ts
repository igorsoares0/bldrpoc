'use client'

import { create } from 'zustand'
import type { GridPlacement, Node, Page, Viewport } from './types'
import {
  updateNodeById,
  removeNodeById,
  addNodeToParent,
} from './tree-utils'
import {
  collectLeaves,
  defaultDesktopPlacement,
  defaultMobilePlacement,
  migrateTreeToGrid,
  DEFAULT_ROW_HEIGHT,
} from './grid-utils'

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
}

type EditorState = {
  page: Page | null
  tree: Node
  selectedId: string | null
  viewport: Viewport
  isDirty: boolean
  isSaving: boolean
  dragSession: DragSession | null
  dragGhost: GridPlacement | null

  initializeEditor: (page: Page) => void
  selectNode: (id: string | null) => void
  updateNode: (id: string, props: Record<string, any>) => void
  addNode: (parentId: string, node: Node) => void
  deleteNode: (id: string) => void
  placeNodeInGrid: (
    sectionId: string,
    draggedId: string,
    placement: GridPlacement,
    snapshot: Record<string, GridPlacement>,
    viewport: Viewport,
  ) => void
  beginDrag: (session: DragSession) => void
  setDragGhost: (ghost: GridPlacement | null) => void
  endDrag: () => void
  setViewport: (v: Viewport) => void
  saveToServer: () => Promise<void>
  updatePageTitle: (title: string) => void
}

const emptyTree: Node = {
  id: 'root',
  type: 'section',
  props: {},
  children: [],
}

function applyPlacementsToLeaves(
  section: Node,
  draggedId: string | null,
  draggedPlacement: GridPlacement | null,
  snapshot: Record<string, GridPlacement>,
  viewport: Viewport,
): Node {
  const leaves = collectLeaves(section)
  const newChildren = leaves.map((leaf, index) => {
    const grid = (leaf.props.grid as { desktop?: GridPlacement; mobile?: GridPlacement } | undefined) ?? {}
    let desktop = grid.desktop
    let mobile = grid.mobile
    const snap = snapshot[leaf.id]
    const isDragged = leaf.id === draggedId

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
      ...leaf,
      props: {
        ...leaf.props,
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
  viewport: 'desktop',
  isDirty: false,
  isSaving: false,
  dragSession: null,
  dragGhost: null,

  initializeEditor: (page) => {
    const { tree: migrated, changed } = migrateTreeToGrid(page.content)
    set({
      page,
      tree: migrated,
      selectedId: null,
      viewport: 'desktop',
      isDirty: changed,
      isSaving: false,
      dragSession: null,
      dragGhost: null,
    })
  },

  selectNode: (id) => set({ selectedId: id }),

  updateNode: (id, props) => {
    const { tree } = get()
    const newTree = updateNodeById(tree, id, (node) => ({
      ...node,
      props: { ...node.props, ...props },
    }))
    set({ tree: newTree, isDirty: true })
  },

  addNode: (parentId, node) => {
    const { tree } = get()
    const newTree = addNodeToParent(tree, parentId, node)
    set({ tree: newTree, isDirty: true, selectedId: node.id })
  },

  deleteNode: (id) => {
    const { tree, selectedId } = get()
    if (id === tree.id) return
    const newTree = removeNodeById(tree, id)
    set({
      tree: newTree,
      isDirty: true,
      selectedId: selectedId === id ? null : selectedId,
    })
  },

  placeNodeInGrid: (sectionId, draggedId, placement, snapshot, viewport) => {
    const { tree } = get()
    const newTree = updateNodeById(tree, sectionId, (section) => {
      const flattened = applyPlacementsToLeaves(
        section,
        draggedId,
        placement,
        snapshot,
        viewport,
      )
      return {
        ...flattened,
        props: {
          ...flattened.props,
          rowHeight: section.props.rowHeight ?? DEFAULT_ROW_HEIGHT,
        },
      }
    })
    set({ tree: newTree, isDirty: true })
  },

  beginDrag: (session) => set({ dragSession: session, dragGhost: null }),
  setDragGhost: (ghost) => set({ dragGhost: ghost }),
  endDrag: () => set({ dragSession: null, dragGhost: null }),

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
