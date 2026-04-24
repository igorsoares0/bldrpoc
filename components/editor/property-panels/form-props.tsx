'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { TypographyControls } from './typography-controls'
import {
  ResponsiveColorField,
  ResponsiveTextField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

export function FormProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
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

      <ResponsiveColorField node={node} propKey="backgroundColor" label="Input Background" fallback="#ffffff" />
      <ResponsiveColorField node={node} propKey="borderColor" label="Input Border" fallback="#e4e4e7" />
      <ResponsiveColorField node={node} propKey="inputColor" label="Input Text" fallback="#09090b" />
      <ResponsiveColorField node={node} propKey="buttonBackgroundColor" label="Button Background" fallback="#3b82f6" />
      <ResponsiveColorField node={node} propKey="buttonColor" label="Button Text" fallback="#ffffff" />

      <ResponsiveTextField node={node} propKey="borderRadius" label="Border Radius" defaultValue="8px" />

      <div className="grid grid-cols-2 gap-3">
        <ResponsiveTextField node={node} propKey="paddingX" label="Padding X" defaultValue="14px" />
        <ResponsiveTextField node={node} propKey="paddingY" label="Padding Y" defaultValue="10px" />
      </div>

      <ResponsiveTextField node={node} propKey="gap" label="Gap" defaultValue="8px" />

      <ResponsiveTextField node={node} propKey="fontSize" label="Font Size" defaultValue="14px" />

      <TypographyControls node={node} />
    </div>
  )
}
