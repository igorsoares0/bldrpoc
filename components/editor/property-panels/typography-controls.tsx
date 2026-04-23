'use client'

import { useEditorStore } from '@/lib/store'
import { FONT_FAMILIES, fontSupportsItalic } from '@/lib/fonts'
import type { Node } from '@/lib/types'

export function TypographyControls({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)
  const family = node.props.fontFamily as string | undefined
  const style = (node.props.fontStyle as string | undefined) ?? 'normal'
  const spacingRaw = String(node.props.letterSpacing ?? '0').replace('em', '')
  const spacing = parseFloat(spacingRaw) || 0

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary">Font Family</label>
        <select
          value={family ?? ''}
          onChange={(e) => {
            const next = e.target.value
            const update: Record<string, unknown> = { fontFamily: next || undefined }
            if (!fontSupportsItalic(next) && style === 'italic') {
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
        <label className="text-xs font-medium text-text-secondary">Font Style</label>
        <div className="flex gap-1">
          {(['normal', 'italic'] as const).map((s) => {
            const disabled = s === 'italic' && !fontSupportsItalic(family)
            const active = style === s
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
        <label className="text-xs font-medium text-text-secondary">Letter Spacing</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step={0.01}
            min={-0.2}
            max={1}
            value={spacing}
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
    </>
  )
}
