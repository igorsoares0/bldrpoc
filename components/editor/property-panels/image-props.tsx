'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { GridPlacementEditor } from './grid-placement-editor'
import type { Node } from '@/lib/types'

export function ImageProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <GridPlacementEditor node={node} />
      <Input
        label="Image URL"
        value={node.props.src || ''}
        placeholder="https://..."
        onChange={(e) => updateNode(node.id, { src: e.target.value })}
      />

      <Input
        label="Alt Text"
        value={node.props.alt || ''}
        placeholder="Describe the image"
        onChange={(e) => updateNode(node.id, { alt: e.target.value })}
      />

      <Input
        label="Width"
        value={node.props.width || '100%'}
        onChange={(e) => updateNode(node.id, { width: e.target.value })}
      />

      <Input
        label="Height"
        value={node.props.height || 'auto'}
        onChange={(e) => updateNode(node.id, { height: e.target.value })}
      />

      <Input
        label="Border Radius"
        value={node.props.borderRadius || '0px'}
        onChange={(e) => updateNode(node.id, { borderRadius: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Object Fit
        </label>
        <select
          value={node.props.objectFit || 'cover'}
          onChange={(e) => updateNode(node.id, { objectFit: e.target.value })}
          className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>
    </div>
  )
}
