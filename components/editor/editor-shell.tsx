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
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedId &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
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
