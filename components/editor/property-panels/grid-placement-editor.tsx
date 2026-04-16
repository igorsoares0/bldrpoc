'use client'

import { useEditorStore } from '@/lib/store'
import { getParentOfNode } from '@/lib/tree-utils'
import {
  clampPlacement,
  colsForViewport,
  defaultDesktopPlacement,
  defaultMobilePlacement,
} from '@/lib/grid-utils'
import type { GridPlacement, GridProps, Node, Viewport } from '@/lib/types'

interface GridPlacementEditorProps {
  node: Node
}

function NumberCell({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max?: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(n)
        }}
        className="h-8 w-full rounded-md border border-surface-3 bg-surface-2 px-2 text-xs text-text-primary focus:border-accent focus:outline-none"
      />
    </label>
  )
}

function PlacementGrid({
  placement,
  cols,
  onChange,
}: {
  placement: GridPlacement
  cols: number
  onChange: (p: GridPlacement) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumberCell
        label="Col"
        min={1}
        max={cols}
        value={placement.col}
        onChange={(v) =>
          onChange(clampPlacement({ ...placement, col: v }, cols))
        }
      />
      <NumberCell
        label="Col Span"
        min={1}
        max={cols}
        value={placement.colSpan}
        onChange={(v) =>
          onChange(clampPlacement({ ...placement, colSpan: v }, cols))
        }
      />
      <NumberCell
        label="Row"
        min={1}
        value={placement.row}
        onChange={(v) =>
          onChange(clampPlacement({ ...placement, row: v }, cols))
        }
      />
      <NumberCell
        label="Row Span"
        min={1}
        value={placement.rowSpan}
        onChange={(v) =>
          onChange(clampPlacement({ ...placement, rowSpan: v }, cols))
        }
      />
    </div>
  )
}

export function GridPlacementEditor({ node }: GridPlacementEditorProps) {
  const tree = useEditorStore((s) => s.tree)
  const updateNode = useEditorStore((s) => s.updateNode)
  const viewport = useEditorStore((s) => s.viewport)

  const parent = getParentOfNode(tree, node.id)
  if (!parent || parent.id === tree.id) return null

  const grid = (node.props.grid as GridProps | undefined) ?? {
    desktop: defaultDesktopPlacement(0),
  }
  const desktop = grid.desktop ?? defaultDesktopPlacement(0)
  const mobile = grid.mobile ?? defaultMobilePlacement(0)

  function update(viewportKey: Viewport, p: GridPlacement) {
    const next: GridProps =
      viewportKey === 'desktop'
        ? { desktop: p, mobile: grid.mobile }
        : { desktop, mobile: p }
    updateNode(node.id, { grid: next })
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-surface-3 bg-surface-0/50 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary">
          Position
        </span>
        <span className="text-[10px] uppercase tracking-wider text-text-muted">
          {viewport === 'desktop' ? 'editing desktop' : 'editing mobile'}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span
          className={`text-[10px] uppercase tracking-wider ${
            viewport === 'desktop' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          Desktop ({colsForViewport('desktop')} cols)
        </span>
        <PlacementGrid
          placement={desktop}
          cols={colsForViewport('desktop')}
          onChange={(p) => update('desktop', p)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span
          className={`text-[10px] uppercase tracking-wider ${
            viewport === 'mobile' ? 'text-accent' : 'text-text-muted'
          }`}
        >
          Mobile ({colsForViewport('mobile')} cols)
        </span>
        <PlacementGrid
          placement={mobile}
          cols={colsForViewport('mobile')}
          onChange={(p) => update('mobile', p)}
        />
      </div>
    </div>
  )
}
