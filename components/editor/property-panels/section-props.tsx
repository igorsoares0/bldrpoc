'use client'

import { useEditorStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { DEFAULT_ROW_HEIGHT } from '@/lib/grid-utils'
import {
  ResponsiveColorField,
  ResponsiveTextField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

const flexDirections = [
  { value: 'column', label: 'Vertical' },
  { value: 'row', label: 'Horizontal' },
]

const alignOptions = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'stretch', label: 'Stretch' },
]

const justifyOptions = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center', label: 'Center' },
  { value: 'flex-end', label: 'End' },
  { value: 'space-between', label: 'Between' },
]

export function SectionProps({ node }: { node: Node }) {
  const updateNode = useEditorStore((s) => s.updateNode)
  const tree = useEditorStore((s) => s.tree)
  const isRoot = tree.id === node.id

  return (
    <div className="flex flex-col gap-4">
      {isRoot ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Background Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={node.props.backgroundColor || '#ffffff'}
              onChange={(e) =>
                updateNode(node.id, { backgroundColor: e.target.value })
              }
              className="h-9 w-9 rounded-lg border border-surface-3 bg-surface-2 p-1 cursor-pointer"
            />
            <Input
              value={node.props.backgroundColor || '#ffffff'}
              onChange={(e) =>
                updateNode(node.id, { backgroundColor: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>
      ) : (
        <ResponsiveColorField
          node={node}
          propKey="backgroundColor"
          label="Background Color"
          fallback="#ffffff"
        />
      )}

      {isRoot ? (
        <Input
          label="Padding"
          value={node.props.padding || '0px'}
          onChange={(e) => updateNode(node.id, { padding: e.target.value })}
        />
      ) : (
        <ResponsiveTextField
          node={node}
          propKey="padding"
          label="Padding"
          defaultValue="24px"
        />
      )}

      {isRoot ? (
        <Input
          label="Min Height"
          value={node.props.minHeight || ''}
          placeholder="e.g. 100vh"
          onChange={(e) => updateNode(node.id, { minHeight: e.target.value })}
        />
      ) : (
        <ResponsiveTextField
          node={node}
          propKey="minHeight"
          label="Min Height"
          placeholder="e.g. 100vh"
        />
      )}

      {isRoot ? (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Direction
            </label>
            <div className="flex gap-1">
              {flexDirections.map((d) => (
                <button
                  key={d.value}
                  onClick={() =>
                    updateNode(node.id, { flexDirection: d.value })
                  }
                  className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    (node.props.flexDirection || 'column') === d.value
                      ? 'bg-accent text-white'
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Align Items
            </label>
            <select
              value={node.props.alignItems || 'stretch'}
              onChange={(e) =>
                updateNode(node.id, { alignItems: e.target.value })
              }
              className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {alignOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Justify Content
            </label>
            <select
              value={node.props.justifyContent || 'flex-start'}
              onChange={(e) =>
                updateNode(node.id, { justifyContent: e.target.value })
              }
              className="h-9 w-full rounded-lg border border-surface-3 bg-surface-2 px-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer"
            >
              {justifyOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Gap"
            value={node.props.gap || '16px'}
            onChange={(e) => updateNode(node.id, { gap: e.target.value })}
          />
        </>
      ) : (
        <Input
          label="Row Height (px)"
          type="number"
          value={node.props.rowHeight ?? DEFAULT_ROW_HEIGHT}
          onChange={(e) =>
            updateNode(node.id, {
              rowHeight: Number(e.target.value) || DEFAULT_ROW_HEIGHT,
            })
          }
        />
      )}
    </div>
  )
}
