'use client'

import { useEffect } from 'react'
import { useEditorStore } from '@/lib/store'
import { EditorToolbar } from './editor-toolbar'
import { EditorCanvas } from './editor-canvas'
import { EditorSidebar } from './editor-sidebar'
import type { Page } from '@/lib/types'

interface EditorShellProps {
  initialPage: Page
}

export function EditorShell({ initialPage }: EditorShellProps) {
  const initializeEditor = useEditorStore((s) => s.initializeEditor)
  const page = useEditorStore((s) => s.page)
  const deleteNode = useEditorStore((s) => s.deleteNode)
  const selectedId = useEditorStore((s) => s.selectedId)
  const selectNode = useEditorStore((s) => s.selectNode)

  useEffect(() => {
    initializeEditor(initialPage)
  }, [initialPage.id])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const editingId = useEditorStore.getState().editingId
      const targetIsEditable =
        e.target instanceof HTMLElement && e.target.isContentEditable
      const targetIsFormElement =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      if (editingId || targetIsEditable) {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault()
          useEditorStore.getState().saveToServer()
        }
        return
      }
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedId &&
        !targetIsFormElement
      ) {
        e.preventDefault()
        deleteNode(selectedId)
      }
      if (e.key === 'Escape') {
        selectNode(null)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        useEditorStore.getState().saveToServer()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) useEditorStore.getState().redo()
        else useEditorStore.getState().undo()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault()
        useEditorStore.getState().redo()
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'd' &&
        selectedId &&
        !targetIsFormElement
      ) {
        e.preventDefault()
        useEditorStore.getState().duplicateNode(selectedId)
      }
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'c' &&
        selectedId &&
        !targetIsFormElement
      ) {
        e.preventDefault()
        useEditorStore.getState().copyNode(selectedId)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'v' && !targetIsFormElement) {
        e.preventDefault()
        useEditorStore.getState().pasteNode()
      }
      if (
        selectedId &&
        !targetIsFormElement &&
        !(e.metaKey || e.ctrlKey) &&
        (e.key === 'ArrowUp' ||
          e.key === 'ArrowDown' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight')
      ) {
        const dir =
          e.key === 'ArrowUp'
            ? 'up'
            : e.key === 'ArrowDown'
              ? 'down'
              : e.key === 'ArrowLeft'
                ? 'left'
                : 'right'
        e.preventDefault()
        useEditorStore.getState().nudgeSelected(dir, e.shiftKey)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, deleteNode, selectNode])

  if (!page) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-0">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-0">
      <EditorToolbar />
      <div className="flex flex-1 overflow-hidden">
        <EditorCanvas />
        <EditorSidebar />
      </div>
    </div>
  )
}
