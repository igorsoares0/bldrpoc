'use client'

import { useEditorStore } from '@/lib/store'
import { useResponsiveProp } from '@/lib/prop-utils'
import { TypographyControls } from './typography-controls'
import {
  ResponsiveColorField,
  ResponsiveSelectField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

const variants = [
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'p', label: 'Paragraph' },
]

const fontWeights = [
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]

const textAligns = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

function FontSizeField({ node }: { node: Node }) {
  const fs = useResponsiveProp<string>(node, 'fontSize', '16px')
  const num = parseFloat(String(fs.value ?? '16')) || 16
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">Font Size</label>
        {fs.isOverride && (
          <button
            type="button"
            onClick={fs.reset}
            className="text-[10px] text-pink-400 hover:text-pink-300 hover:underline cursor-pointer"
            title="Remove mobile override"
          >
            ↺ reset
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={8}
          max={200}
          step={1}
          value={num}
          onChange={(e) => {
            const n = parseFloat(e.target.value)
            if (!Number.isFinite(n)) return
            fs.setValue(`${Math.max(1, Math.round(n))}px`)
          }}
          className={`h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${
            fs.isOverride ? 'ring-1 ring-pink-500/60' : ''
          }`}
        />
        <span className="text-xs text-text-muted">px</span>
      </div>
    </div>
  )
}

function TextAlignField({ node }: { node: Node }) {
  const ta = useResponsiveProp<string>(node, 'textAlign', 'left')
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">Text Align</label>
        {ta.isOverride && (
          <button
            type="button"
            onClick={ta.reset}
            className="text-[10px] text-pink-400 hover:text-pink-300 hover:underline cursor-pointer"
          >
            ↺ reset
          </button>
        )}
      </div>
      <div className={`flex gap-1 ${ta.isOverride ? 'rounded-lg ring-1 ring-pink-500/60 p-0.5' : ''}`}>
        {textAligns.map((a) => (
          <button
            key={a.value}
            onClick={() => ta.setValue(a.value)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              (ta.value ?? 'left') === a.value
                ? 'bg-accent text-white'
                : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function TextProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Content
        </label>
        <textarea
          value={node.props.content || ''}
          onChange={(e) => updateNode(node.id, { content: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-surface-3 bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        />
      </div>

      <ResponsiveSelectField
        node={node}
        propKey="variant"
        label="Variant"
        defaultValue="p"
        options={variants}
      />

      <FontSizeField node={node} />

      <ResponsiveSelectField
        node={node}
        propKey="fontWeight"
        label="Font Weight"
        defaultValue="400"
        options={fontWeights}
      />

      <TypographyControls node={node} />

      <TextAlignField node={node} />

      <ResponsiveColorField
        node={node}
        propKey="color"
        label="Color"
        fallback="#09090b"
      />
    </div>
  )
}
