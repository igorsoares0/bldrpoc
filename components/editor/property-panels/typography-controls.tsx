'use client'

import { FONT_FAMILIES, fontSupportsItalic } from '@/lib/fonts'
import { useResponsiveProp } from '@/lib/prop-utils'
import type { Node } from '@/lib/types'

const overrideRing = 'ring-1 ring-pink-500/60'

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] text-pink-400 hover:text-pink-300 hover:underline cursor-pointer"
      title="Remove mobile override"
    >
      ↺ reset
    </button>
  )
}

export function TypographyControls({ node }: { node: Node }) {
  const family = useResponsiveProp<string>(node, 'fontFamily', '')
  const style = useResponsiveProp<string>(node, 'fontStyle', 'normal')
  const spacing = useResponsiveProp<string>(node, 'letterSpacing', '0')

  const familyValue = family.value ?? ''
  const styleValue = style.value ?? 'normal'
  const spacingNum = parseFloat(String(spacing.value ?? '0').replace('em', '')) || 0

  function setFamily(next: string) {
    family.setValue(next)
    if (!fontSupportsItalic(next) && styleValue === 'italic') {
      style.setValue('normal')
    }
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-secondary">Font Family</label>
          {family.isOverride && <ResetButton onClick={family.reset} />}
        </div>
        <select
          value={familyValue}
          onChange={(e) => setFamily(e.target.value)}
          className={`h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer ${
            family.isOverride ? overrideRing : ''
          }`}
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-secondary">Font Style</label>
          {style.isOverride && <ResetButton onClick={style.reset} />}
        </div>
        <div className={`flex gap-1 ${style.isOverride ? `rounded-lg ${overrideRing} p-0.5` : ''}`}>
          {(['normal', 'italic'] as const).map((s) => {
            const disabled = s === 'italic' && !fontSupportsItalic(familyValue)
            const active = styleValue === s
            return (
              <button
                key={s}
                disabled={disabled}
                onClick={() => style.setValue(s)}
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
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-text-secondary">Letter Spacing</label>
          {spacing.isOverride && <ResetButton onClick={spacing.reset} />}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step={0.01}
            min={-0.2}
            max={1}
            value={spacingNum}
            onChange={(e) => {
              const n = parseFloat(e.target.value)
              if (!Number.isFinite(n)) return
              spacing.setValue(n === 0 ? '' : `${n}em`)
            }}
            className={`h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${
              spacing.isOverride ? overrideRing : ''
            }`}
          />
          <span className="text-xs text-text-muted">em</span>
        </div>
      </div>
    </>
  )
}
