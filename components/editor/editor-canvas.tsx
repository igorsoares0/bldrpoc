'use client'

import { useEditorStore } from '@/lib/store'
import { NodeRenderer } from './node-renderer'

export function EditorCanvas() {
  const tree = useEditorStore((s) => s.tree)
  const viewport = useEditorStore((s) => s.viewport)
  const selectNode = useEditorStore((s) => s.selectNode)

  return (
    <div
      className={`flex-1 overflow-auto ${viewport === 'mobile' ? 'bg-surface-0' : ''}`}
      onClick={() => selectNode(null)}
    >
      <div
        className={`mx-auto min-h-full bg-white transition-all duration-300 ${
          viewport === 'desktop' ? 'w-full' : 'w-[375px]'
        }`}
      >
        <NodeRenderer node={tree} isRoot={true} />
      </div>
    </div>
  )
}
