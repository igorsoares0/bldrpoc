'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { GridPlacementEditor } from './grid-placement-editor'
import type { Node } from '@/lib/types'

export function ButtonProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <GridPlacementEditor node={node} />
      <Input
        label="Label"
        value={node.props.label || ''}
        onChange={(e) => updateNode(node.id, { label: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={node.props.backgroundColor || '#3b82f6'}
            onChange={(e) =>
              updateNode(node.id, { backgroundColor: e.target.value })
            }
            className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
          />
          <Input
            value={node.props.backgroundColor || '#3b82f6'}
            onChange={(e) =>
              updateNode(node.id, { backgroundColor: e.target.value })
            }
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Text Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={node.props.color || '#ffffff'}
            onChange={(e) => updateNode(node.id, { color: e.target.value })}
            className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
          />
          <Input
            value={node.props.color || '#ffffff'}
            onChange={(e) => updateNode(node.id, { color: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <Input
        label="Border Radius"
        value={node.props.borderRadius || '8px'}
        onChange={(e) => updateNode(node.id, { borderRadius: e.target.value })}
      />

      <Input
        label="Border"
        placeholder="none or 1px solid #d4d4d8"
        value={node.props.border || ''}
        onChange={(e) =>
          updateNode(node.id, { border: e.target.value || 'none' })
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Padding X"
          value={node.props.paddingX || '24px'}
          onChange={(e) => updateNode(node.id, { paddingX: e.target.value })}
        />
        <Input
          label="Padding Y"
          value={node.props.paddingY || '12px'}
          onChange={(e) => updateNode(node.id, { paddingY: e.target.value })}
        />
      </div>

      <Input
        label="Font Size"
        value={node.props.fontSize || '16px'}
        onChange={(e) => updateNode(node.id, { fontSize: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Font Weight
        </label>
        <select
          value={node.props.fontWeight || '600'}
          onChange={(e) => updateNode(node.id, { fontWeight: e.target.value })}
          className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
        >
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="700">Bold</option>
        </select>
      </div>
    </div>
  )
}
