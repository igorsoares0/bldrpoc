'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import type { Node } from '@/lib/types'

export function MenuBarProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={node.props.backgroundColor || '#09090b'}
            onChange={(e) =>
              updateNode(node.id, { backgroundColor: e.target.value })
            }
            className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
          />
          <Input
            value={node.props.backgroundColor || '#09090b'}
            onChange={(e) =>
              updateNode(node.id, { backgroundColor: e.target.value })
            }
            className="flex-1"
          />
        </div>
      </div>

      <Input
        label="Padding"
        value={node.props.padding || '16px 32px'}
        onChange={(e) => updateNode(node.id, { padding: e.target.value })}
      />

      <Input
        label="Gap"
        value={node.props.gap || '24px'}
        onChange={(e) => updateNode(node.id, { gap: e.target.value })}
      />
    </div>
  )
}
