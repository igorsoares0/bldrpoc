'use client'

import { useEditorStore } from '@/lib/store'
import { colsForViewport, DEFAULT_ROW_HEIGHT, placementToStyle } from '@/lib/grid-utils'
import { getNodeById } from '@/lib/tree-utils'

interface GridOverlayProps {
  sectionId: string
}

const GUIDE_COLOR = '#ec4899'

export function GridOverlay({ sectionId }: GridOverlayProps) {
  const dragSession = useEditorStore((s) => s.dragSession)
  const dragGhost = useEditorStore((s) => s.dragGhost)
  const dragSnapGuides = useEditorStore((s) => s.dragSnapGuides)
  const viewport = useEditorStore((s) => s.viewport)
  const tree = useEditorStore((s) => s.tree)

  const isActive = dragSession?.sectionId === sectionId
  const cols = colsForViewport(viewport)
  const sectionNode = isActive ? getNodeById(tree, sectionId) : null
  const rowHeight = sectionNode?.props.rowHeight ?? DEFAULT_ROW_HEIGHT

  if (!isActive) return null

  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(to right, rgba(99,102,241,0.18) 0 1px, transparent 1px calc(100% / ${cols}))`,
          zIndex: 30,
        }}
      />
      {dragGhost && (
        <div
          aria-hidden
          style={{
            ...placementToStyle(dragGhost),
            backgroundColor: 'rgba(99,102,241,0.18)',
            border: '2px dashed rgba(99,102,241,0.7)',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 31,
          }}
        />
      )}
      {dragSnapGuides?.cols.map((c) => (
        <div
          key={`gv-${c}`}
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `calc(${((c - 1) / cols) * 100}% - 0.5px)`,
            width: 1,
            backgroundColor: GUIDE_COLOR,
            boxShadow: `0 0 0 0.5px ${GUIDE_COLOR}`,
            pointerEvents: 'none',
            zIndex: 32,
          }}
        />
      ))}
      {dragSnapGuides?.rows.map((r) => (
        <div
          key={`gh-${r}`}
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: (r - 1) * rowHeight - 0.5,
            height: 1,
            backgroundColor: GUIDE_COLOR,
            boxShadow: `0 0 0 0.5px ${GUIDE_COLOR}`,
            pointerEvents: 'none',
            zIndex: 32,
          }}
        />
      ))}
    </>
  )
}
