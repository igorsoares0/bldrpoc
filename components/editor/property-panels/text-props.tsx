'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { GridPlacementEditor } from './grid-placement-editor'
import { FONT_FAMILIES, fontSupportsItalic } from '@/lib/fonts'
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

export function TextProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)

  return (
    <div className="flex flex-col gap-4">
      <GridPlacementEditor node={node} />
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

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Variant
        </label>
        <select
          value={node.props.variant || 'p'}
          onChange={(e) => updateNode(node.id, { variant: e.target.value })}
          className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
        >
          {variants.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Font Size
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={8}
            max={200}
            step={1}
            value={parseFloat(String(node.props.fontSize ?? '16')) || 16}
            onChange={(e) => {
              const n = parseFloat(e.target.value)
              if (!Number.isFinite(n)) return
              updateNode(node.id, { fontSize: `${Math.max(1, Math.round(n))}px` })
            }}
            className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-xs text-text-muted">px</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Font Weight
        </label>
        <select
          value={node.props.fontWeight || '400'}
          onChange={(e) => updateNode(node.id, { fontWeight: e.target.value })}
          className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
        >
          {fontWeights.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Font Family
        </label>
        <select
          value={node.props.fontFamily ?? ''}
          onChange={(e) => {
            const next = e.target.value
            const update: Record<string, unknown> = { fontFamily: next || undefined }
            if (!fontSupportsItalic(next) && node.props.fontStyle === 'italic') {
              update.fontStyle = 'normal'
            }
            updateNode(node.id, update)
          }}
          className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Font Style
        </label>
        <div className="flex gap-1">
          {(['normal', 'italic'] as const).map((s) => {
            const disabled = s === 'italic' && !fontSupportsItalic(node.props.fontFamily)
            const active = (node.props.fontStyle || 'normal') === s
            return (
              <button
                key={s}
                disabled={disabled}
                onClick={() =>
                  updateNode(node.id, { fontStyle: s === 'normal' ? undefined : s })
                }
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  disabled
                    ? 'bg-surface-2 text-text-muted cursor-not-allowed opacity-50'
                    : active
                      ? 'bg-accent text-white cursor-pointer'
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3 cursor-pointer'
                }`}
                style={s === 'italic' ? { fontStyle: 'italic' } : undefined}
              >
                {s === 'normal' ? 'Normal' : 'Italic'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Letter Spacing
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step={0.01}
            min={-0.2}
            max={1}
            value={parseFloat(String(node.props.letterSpacing ?? '0').replace('em', '')) || 0}
            onChange={(e) => {
              const n = parseFloat(e.target.value)
              if (!Number.isFinite(n)) return
              updateNode(node.id, {
                letterSpacing: n === 0 ? undefined : `${n}em`,
              })
            }}
            className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-xs text-text-muted">em</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Text Align
        </label>
        <div className="flex gap-1">
          {textAligns.map((a) => (
            <button
              key={a.value}
              onClick={() => updateNode(node.id, { textAlign: a.value })}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                (node.props.textAlign || 'left') === a.value
                  ? 'bg-accent text-white'
                  : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={node.props.color || '#09090b'}
            onChange={(e) => updateNode(node.id, { color: e.target.value })}
            className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
          />
          <Input
            value={node.props.color || '#09090b'}
            onChange={(e) => updateNode(node.id, { color: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
