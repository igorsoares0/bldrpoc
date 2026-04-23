'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { GridPlacementEditor } from './grid-placement-editor'
import { TypographyControls } from './typography-controls'
import type { Node } from '@/lib/types'

function ColorField({
  label,
  value,
  fallback,
  onChange,
}: {
  label: string
  value: string | undefined
  fallback: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
        />
        <Input
          value={value || fallback}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export function FormProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <GridPlacementEditor node={node} />

      <Input
        label="Placeholder"
        value={node.props.placeholder ?? 'your@email.com'}
        onChange={(e) => updateNode(node.id, { placeholder: e.target.value })}
      />
      <Input
        label="Button Label"
        value={node.props.buttonLabel ?? 'Subscribe'}
        onChange={(e) => updateNode(node.id, { buttonLabel: e.target.value })}
      />
      <Input
        label="Success Message"
        value={node.props.successMessage ?? 'Thanks! Check your inbox.'}
        onChange={(e) => updateNode(node.id, { successMessage: e.target.value })}
      />
      <Input
        label="Submit URL (optional)"
        placeholder="https://api.example.com/subscribe"
        value={node.props.action ?? ''}
        onChange={(e) => updateNode(node.id, { action: e.target.value })}
      />

      <div className="h-px bg-surface-3" />

      <ColorField
        label="Input Background"
        value={node.props.backgroundColor}
        fallback="#ffffff"
        onChange={(v) => updateNode(node.id, { backgroundColor: v })}
      />
      <ColorField
        label="Input Border"
        value={node.props.borderColor}
        fallback="#e4e4e7"
        onChange={(v) => updateNode(node.id, { borderColor: v })}
      />
      <ColorField
        label="Input Text"
        value={node.props.inputColor}
        fallback="#09090b"
        onChange={(v) => updateNode(node.id, { inputColor: v })}
      />
      <ColorField
        label="Button Background"
        value={node.props.buttonBackgroundColor}
        fallback="#3b82f6"
        onChange={(v) => updateNode(node.id, { buttonBackgroundColor: v })}
      />
      <ColorField
        label="Button Text"
        value={node.props.buttonColor}
        fallback="#ffffff"
        onChange={(v) => updateNode(node.id, { buttonColor: v })}
      />

      <Input
        label="Border Radius"
        value={node.props.borderRadius ?? '8px'}
        onChange={(e) => updateNode(node.id, { borderRadius: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Padding X"
          value={node.props.paddingX ?? '14px'}
          onChange={(e) => updateNode(node.id, { paddingX: e.target.value })}
        />
        <Input
          label="Padding Y"
          value={node.props.paddingY ?? '10px'}
          onChange={(e) => updateNode(node.id, { paddingY: e.target.value })}
        />
      </div>

      <Input
        label="Gap"
        value={node.props.gap ?? '8px'}
        onChange={(e) => updateNode(node.id, { gap: e.target.value })}
      />

      <Input
        label="Font Size"
        value={node.props.fontSize ?? '14px'}
        onChange={(e) => updateNode(node.id, { fontSize: e.target.value })}
      />

      <TypographyControls node={node} />
    </div>
  )
}
