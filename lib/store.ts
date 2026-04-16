'use client'

import { create } from 'zustand'
import type { Node, Page } from './types'
import {
  updateNodeById,
  removeNodeById,
  addNodeToParent,
} from './tree-utils'

export type ChildSnapshot = {
  x: number
  y: number
  w: number
  h: number
}

export type DragSession = {
  id: string
  sectionId: string
  offsetX: number
  offsetY: number
  snapshot: Record<string, ChildSnapshot>
  sectionHeight: number
}

const LEAF_TYPES = ['text', 'image', 'button']

type EditorState = {
  page: Page | null
  tree: Node
  selectedId: string | null
  viewport: 'desktop' | 'mobile'
  isDirty: boolean
  isSaving: boolean
  dragSession: DragSession | null

  initializeEditor: (page: Page) => void
  selectNode: (id: string | null) => void
  updateNode: (id: string, props: Record<string, any>) => void
  addNode: (parentId: string, node: Node) => void
  deleteNode: (id: string) => void
  placeNode: (
    sectionId: string,
    draggedId: string,
    pos: { x: number; y: number },
    snapshot: Record<string, ChildSnapshot>,
    sectionHeight: number,
  ) => void
  beginDrag: (session: DragSession) => void
  endDrag: () => void
  setViewport: (v: 'desktop' | 'mobile') => void
  saveToServer: () => Promise<void>
  updatePageTitle: (title: string) => void
}

const emptyTree: Node = {
  id: 'root',
  type: 'section',
  props: {},
  children: [],
}

export const useEditorStore = create<EditorState>((set, get) => ({
  page: null,
  tree: emptyTree,
  selectedId: null,
  viewport: 'desktop',
  isDirty: false,
  isSaving: false,
  dragSession: null,

  initializeEditor: (page) => {
    set({
      page,
      tree: page.content,
      selectedId: null,
      viewport: 'desktop',
      isDirty: false,
      isSaving: false,
      dragSession: null,
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

  placeNode: (sectionId, draggedId, pos, snapshot, sectionHeight) => {
    const { tree } = get()
    const newTree = updateNodeById(tree, sectionId, (section) => {
      const leaves: Node[] = []
      const walk = (n: Node) => {
        if (n.id !== section.id && LEAF_TYPES.includes(n.type)) {
          leaves.push(n)
          return
        }
        n.children?.forEach(walk)
      }
      walk(section)

      const newChildren = leaves.map((leaf) => {
        const snap = snapshot[leaf.id]
        if (leaf.id === draggedId) {
          return {
            ...leaf,
            props: {
              ...leaf.props,
              x: pos.x,
              y: pos.y,
              w: snap?.w ?? leaf.props.w,
            },
          }
        }
        if (snap && leaf.props.x === undefined) {
          return {
            ...leaf,
            props: {
              ...leaf.props,
              x: snap.x,
              y: snap.y,
              w: snap.w,
            },
          }
        }
        return leaf
      })

      return {
        ...section,
        props: {
          ...section.props,
          freeLayout: true,
          minHeight: section.props.minHeight ?? `${sectionHeight}px`,
        },
        children: newChildren,
      }
    })
    set({ tree: newTree, isDirty: true })
  },

  beginDrag: (session) => set({ dragSession: session }),
  endDrag: () => set({ dragSession: null }),

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
