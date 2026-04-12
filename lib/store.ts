'use client'

import { create } from 'zustand'
import type { Node, Page } from './types'
import {
  updateNodeById,
  removeNodeById,
  addNodeToParent,
} from './tree-utils'

type EditorState = {
  page: Page | null
  tree: Node
  selectedId: string | null
  viewport: 'desktop' | 'mobile'
  isDirty: boolean
  isSaving: boolean

  initializeEditor: (page: Page) => void
  selectNode: (id: string | null) => void
  updateNode: (id: string, props: Record<string, any>) => void
  addNode: (parentId: string, node: Node) => void
  deleteNode: (id: string) => void
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

  initializeEditor: (page) => {
    set({
      page,
      tree: page.content,
      selectedId: null,
      viewport: 'desktop',
      isDirty: false,
      isSaving: false,
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
