'use client'

import { Input } from '@/components/ui/input'
import { useResponsiveProp } from '@/lib/prop-utils'
import type { Node } from '@/lib/types'

function FieldHeader({
  label,
  isOverride,
  onReset,
}: {
  label: string
  isOverride: boolean
  onReset: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      {isOverride && (
        <button
          type="button"
          onClick={onReset}
          className="text-[10px] text-pink-400 hover:text-pink-300 hover:underline cursor-pointer"
          title="Remove mobile override (revert to desktop)"
        >
          ↺ reset
        </button>
      )}
    </div>
  )
}

const overrideRingClass =
  'ring-1 ring-pink-500/60 focus:ring-pink-500'

export function ResponsiveTextField({
  node,
  propKey,
  label,
  defaultValue,
  placeholder,
}: {
  node: Node
  propKey: string
  label: string
  defaultValue?: string
  placeholder?: string
}) {
  const prop = useResponsiveProp<string>(node, propKey, defaultValue)
  return (
    <div className="flex flex-col gap-1.5">
      <FieldHeader label={label} isOverride={prop.isOverride} onReset={prop.reset} />
      <Input
        value={prop.value ?? ''}
        placeholder={placeholder}
        onChange={(e) => prop.setValue(e.target.value)}
        className={prop.isOverride ? overrideRingClass : undefined}
      />
    </div>
  )
}

export function ResponsiveColorField({
  node,
  propKey,
  label,
  fallback,
}: {
  node: Node
  propKey: string
  label: string
  fallback: string
}) {
  const prop = useResponsiveProp<string>(node, propKey, fallback)
  const value = prop.value ?? fallback
  return (
    <div className="flex flex-col gap-1.5">
      <FieldHeader label={label} isOverride={prop.isOverride} onReset={prop.reset} />
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => prop.setValue(e.target.value)}
          className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => prop.setValue(e.target.value)}
          className={`flex-1 ${prop.isOverride ? overrideRingClass : ''}`}
        />
      </div>
    </div>
  )
}

export function ResponsiveSelectField({
  node,
  propKey,
  label,
  defaultValue,
  options,
}: {
  node: Node
  propKey: string
  label: string
  defaultValue: string
  options: { value: string; label: string }[]
}) {
  const prop = useResponsiveProp<string>(node, propKey, defaultValue)
  return (
    <div className="flex flex-col gap-1.5">
      <FieldHeader label={label} isOverride={prop.isOverride} onReset={prop.reset} />
      <select
        value={prop.value ?? defaultValue}
        onChange={(e) => prop.setValue(e.target.value)}
        className={`h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer ${
          prop.isOverride ? overrideRingClass : ''
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
