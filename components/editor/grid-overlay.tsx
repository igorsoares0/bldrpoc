'use client'

import { useEditorStore } from '@/lib/store'
import { colsForViewport, placementToStyle } from '@/lib/grid-utils'

interface GridOverlayProps {
  sectionId: string
}

export function GridOverlay({ sectionId }: GridOverlayProps) {
  const dragSession = useEditorStore((s) => s.dragSession)
  const dragGhost = useEditorStore((s) => s.dragGhost)
  const viewport = useEditorStore((s) => s.viewport)

  const isActive = dragSession?.sectionId === sectionId
  const cols = colsForViewport(viewport)

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
    </>
  )
}
