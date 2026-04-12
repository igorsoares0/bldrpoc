'use client'

import { useEditorStore } from '@/lib/store'
import { NodeRenderer } from './node-renderer'

export function EditorCanvas() {
  const tree = useEditorStore((s) => s.tree)
  const viewport = useEditorStore((s) => s.viewport)
  const selectNode = useEditorStore((s) => s.selectNode)

  return (
    <div
      className="flex-1 overflow-auto bg-surface-0 p-6"
      onClick={() => selectNode(null)}
    >
      <div className="mx-auto flex min-h-full justify-center">
        <div
          className={`bg-white shadow-xl shadow-black/20 rounded-lg overflow-hidden transition-all duration-300 ${
            viewport === 'desktop' ? 'w-full max-w-[1024px]' : 'w-[375px]'
          }`}
        >
          <NodeRenderer node={tree} />
        </div>
      </div>
    </div>
  )
}
