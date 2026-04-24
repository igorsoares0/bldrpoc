'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { TypographyControls } from './typography-controls'
import {
  ResponsiveColorField,
  ResponsiveSelectField,
  ResponsiveTextField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

const fontWeights = [
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]

export function ButtonProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Label"
        value={node.props.label || ''}
        onChange={(e) => updateNode(node.id, { label: e.target.value })}
      />

      <ResponsiveColorField
        node={node}
        propKey="backgroundColor"
        label="Background Color"
        fallback="#3b82f6"
      />

      <ResponsiveColorField
        node={node}
        propKey="color"
        label="Text Color"
        fallback="#ffffff"
      />

      <ResponsiveTextField
        node={node}
        propKey="borderRadius"
        label="Border Radius"
        defaultValue="8px"
      />

      <ResponsiveTextField
        node={node}
        propKey="border"
        label="Border"
        defaultValue="none"
        placeholder="none or 1px solid #d4d4d8"
      />

      <div className="grid grid-cols-2 gap-3">
        <ResponsiveTextField
          node={node}
          propKey="paddingX"
          label="Padding X"
          defaultValue="24px"
        />
        <ResponsiveTextField
          node={node}
          propKey="paddingY"
          label="Padding Y"
          defaultValue="12px"
        />
      </div>

      <ResponsiveTextField
        node={node}
        propKey="fontSize"
        label="Font Size"
        defaultValue="16px"
      />

      <ResponsiveSelectField
        node={node}
        propKey="fontWeight"
        label="Font Weight"
        defaultValue="600"
        options={fontWeights}
      />

      <TypographyControls node={node} />
    </div>
  )
}
