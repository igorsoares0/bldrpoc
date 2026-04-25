'use client'

import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { TypographyControls } from './typography-controls'
import {
  ResponsiveColorField,
  ResponsiveTextField,
} from './responsive-fields'
import type { FormField, FormFieldType, Node } from '@/lib/types'

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
]

function uid() {
  return crypto.randomUUID()
}

function FieldsEditor({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)
  const fields = (node.props.fields as FormField[] | undefined) ?? []

  function commit(next: FormField[]) {
    updateNode(node.id, { fields: next })
  }

  function addField() {
    const idx = fields.length + 1
    commit([
      ...fields,
      {
        id: uid(),
        type: 'text',
        name: `field_${idx}`,
        label: `Field ${idx}`,
        placeholder: '',
      },
    ])
  }

  function removeField(id: string) {
    commit(fields.filter((f) => f.id !== id))
  }

  function updateField(id: string, patch: Partial<FormField>) {
    commit(fields.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function move(id: string, dir: -1 | 1) {
    const idx = fields.findIndex((f) => f.id === id)
    const target = idx + dir
    if (idx < 0 || target < 0 || target >= fields.length) return
    const next = [...fields]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    commit(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Fields
        </span>
        <button
          onClick={addField}
          className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-3 hover:text-text-primary cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Add field
        </button>
      </div>

      {fields.length === 0 && (
        <p className="rounded-md border border-dashed border-surface-3 px-3 py-4 text-center text-xs text-text-muted">
          No fields yet — single email mode. Add a field for a multi-field form.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {fields.map((field, i) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-surface-3 bg-surface-1 p-2.5"
          >
            <div className="flex items-center gap-1.5">
              <select
                value={field.type}
                onChange={(e) =>
                  updateField(field.id, { type: e.target.value as FormFieldType })
                }
                className="h-7 flex-1 rounded-md border border-surface-3 bg-surface-2 px-2 text-xs text-text-primary focus:border-accent focus:outline-none cursor-pointer"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => move(field.id, -1)}
                disabled={i === 0}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => move(field.id, 1)}
                disabled={i === fields.length - 1}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => removeField(field.id)}
                className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-2 hover:text-red-400 cursor-pointer"
                title="Remove field"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input
              label="Label"
              value={field.label ?? ''}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
            />
            <Input
              label="Name (submission key)"
              value={field.name}
              onChange={(e) => updateField(field.id, { name: e.target.value })}
            />
            <Input
              label="Placeholder"
              value={field.placeholder ?? ''}
              onChange={(e) =>
                updateField(field.id, { placeholder: e.target.value })
              }
            />
            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={field.required ?? false}
                onChange={(e) =>
                  updateField(field.id, { required: e.target.checked })
                }
                className="h-3.5 w-3.5 cursor-pointer accent-accent"
              />
              Required
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FormProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)
  const hasFields =
    Array.isArray(node.props.fields) && (node.props.fields as FormField[]).length > 0

  return (
    <div className="flex flex-col gap-4">
      <FieldsEditor node={node} />

      <div className="h-px bg-surface-3" />

      {!hasFields && (
        <Input
          label="Placeholder (single email)"
          value={node.props.placeholder ?? 'your@email.com'}
          onChange={(e) => updateNode(node.id, { placeholder: e.target.value })}
        />
      )}
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
      {hasFields && (
        <ResponsiveColorField node={node} propKey="labelColor" label="Label Text" fallback="#3f3f46" />
      )}
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
