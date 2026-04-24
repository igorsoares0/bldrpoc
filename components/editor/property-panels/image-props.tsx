'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import {
  ResponsiveSelectField,
  ResponsiveTextField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

const objectFits = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
  { value: 'none', label: 'None' },
]

export function ImageProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
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

      <ResponsiveTextField
        node={node}
        propKey="width"
        label="Width"
        defaultValue="100%"
      />

      <ResponsiveTextField
        node={node}
        propKey="height"
        label="Height"
        defaultValue="auto"
      />

      <ResponsiveTextField
        node={node}
        propKey="borderRadius"
        label="Border Radius"
        defaultValue="0px"
      />

      <ResponsiveSelectField
        node={node}
        propKey="objectFit"
        label="Object Fit"
        defaultValue="cover"
        options={objectFits}
      />
    </div>
  )
}
