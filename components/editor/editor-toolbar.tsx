'use client'

import { ArrowLeft, Monitor, Smartphone, Save, Loader2, Undo2, Redo2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEditorStore } from '@/lib/store'
import { ElementPicker } from './element-picker'

export function EditorToolbar() {
  const router = useRouter()
  const page = useEditorStore((s) => s.page)
  const viewport = useEditorStore((s) => s.viewport)
  const setViewport = useEditorStore((s) => s.setViewport)
  const isDirty = useEditorStore((s) => s.isDirty)
  const isSaving = useEditorStore((s) => s.isSaving)
  const saveToServer = useEditorStore((s) => s.saveToServer)
  const updatePageTitle = useEditorStore((s) => s.updatePageTitle)
  const undo = useEditorStore((s) => s.undo)
  const redo = useEditorStore((s) => s.redo)
  const canUndo = useEditorStore((s) => s.past.length > 0)
  const canRedo = useEditorStore((s) => s.future.length > 0)

  return (
    <div className="flex h-14 items-center justify-between border-b border-surface-3 bg-surface-1 px-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-lg p-2 text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors cursor-pointer"
          title="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="h-5 w-px bg-surface-3" />

        <input
          type="text"
          value={page?.title || ''}
          onChange={(e) => updatePageTitle(e.target.value)}
          className="bg-transparent text-sm font-medium text-text-primary border-none outline-none focus:ring-0 w-48 truncate placeholder:text-text-muted"
          placeholder="Page title..."
        />
      </div>

      <div className="flex items-center gap-2">
        <ElementPicker />

        <div className="h-5 w-px bg-surface-3 mx-1" />

        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-surface-3 mx-1" />

        <div className="flex items-center rounded-lg bg-surface-2 p-0.5">
          <button
            onClick={() => setViewport('desktop')}
            className={`rounded-md p-1.5 transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-surface-3 text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            title="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`rounded-md p-1.5 transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-surface-3 text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
            title="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-surface-3 mx-1" />

        <button
          onClick={saveToServer}
          disabled={!isDirty || isSaving}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
            isDirty
              ? 'bg-accent text-white hover:bg-accent-hover'
              : 'bg-surface-2 text-text-muted'
          } disabled:opacity-50 disabled:pointer-events-none`}
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {isSaving ? 'Saving...' : isDirty ? 'Save' : 'Saved'}
        </button>
      </div>
    </div>
  )
}
