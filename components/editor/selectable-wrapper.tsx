'use client'

import { useState, type CSSProperties } from 'react'
import { useEditorStore, type ChildSnapshot } from '@/lib/store'
import type { Node, NodeType } from '@/lib/types'

const typeLabels: Record<NodeType, string> = {
  section: 'Section',
  text: 'Text',
  image: 'Image',
  button: 'Button',
  'menu-bar': 'Menu Bar',
  footer: 'Footer',
}

const LEAF_TYPES: NodeType[] = ['text', 'image', 'button']

interface SelectableWrapperProps {
  node: Node
  parentId?: string
  sectionId?: string
  children: React.ReactNode
}

export function SelectableWrapper({
  node,
  parentId,
  sectionId,
  children,
}: SelectableWrapperProps) {
  const selectedId = useEditorStore((s) => s.selectedId)
  const selectNode = useEditorStore((s) => s.selectNode)
  const dragSession = useEditorStore((s) => s.dragSession)
  const beginDrag = useEditorStore((s) => s.beginDrag)
  const endDrag = useEditorStore((s) => s.endDrag)
  const placeNode = useEditorStore((s) => s.placeNode)

  const [isDropTarget, setIsDropTarget] = useState(false)

  const { id: nodeId, type: nodeType, props } = node
  const isSelected = selectedId === nodeId
  const isLeaf = LEAF_TYPES.includes(nodeType)
  const isDraggable = isLeaf && Boolean(sectionId)
  const isSectionRoot = Boolean(sectionId) && nodeId === sectionId
  const hasFreePosition =
    typeof props.x === 'number' && typeof props.y === 'number'

  const positionStyle: CSSProperties = hasFreePosition
    ? {
        position: 'absolute',
        left: `${props.x}px`,
        top: `${props.y}px`,
        width: typeof props.w === 'number' ? `${props.w}px` : undefined,
      }
    : {}

  const canAcceptDrop =
    isSectionRoot &&
    dragSession !== null &&
    dragSession.sectionId === nodeId

  return (
    <div
      data-node-id={nodeId}
      data-node-type={nodeType}
      style={positionStyle}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (!isDraggable || !sectionId) return
        e.stopPropagation()

        const childRect = e.currentTarget.getBoundingClientRect()
        const offsetX = e.clientX - childRect.left
        const offsetY = e.clientY - childRect.top

        const sectionEl = document.querySelector<HTMLElement>(
          `[data-node-id="${sectionId}"]`,
        )
        const snapshot: Record<string, ChildSnapshot> = {}
        let sectionHeight = 0
        if (sectionEl) {
          const sectionRect = sectionEl.getBoundingClientRect()
          sectionHeight = sectionRect.height
          sectionEl
            .querySelectorAll<HTMLElement>('[data-node-id]')
            .forEach((el) => {
              if (el === sectionEl) return
              const id = el.getAttribute('data-node-id')
              const type = el.getAttribute('data-node-type') as NodeType | null
              if (!id || !type) return
              if (!LEAF_TYPES.includes(type)) return
              const r = el.getBoundingClientRect()
              snapshot[id] = {
                x: r.left - sectionRect.left,
                y: r.top - sectionRect.top,
                w: r.width,
                h: r.height,
              }
            })
        }

        e.dataTransfer.setData('text/node-id', nodeId)
        e.dataTransfer.effectAllowed = 'move'
        beginDrag({
          id: nodeId,
          sectionId,
          offsetX,
          offsetY,
          snapshot,
          sectionHeight,
        })
      }}
      onDragOver={(e) => {
        if (!canAcceptDrop) return
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        if (!isDropTarget) setIsDropTarget(true)
      }}
      onDragLeave={(e) => {
        if (!canAcceptDrop) return
        const next = e.relatedTarget as globalThis.Node | null
        if (next && e.currentTarget.contains(next)) return
        setIsDropTarget(false)
      }}
      onDrop={(e) => {
        if (!canAcceptDrop || !dragSession) {
          setIsDropTarget(false)
          return
        }
        e.preventDefault()
        e.stopPropagation()
        const rect = e.currentTarget.getBoundingClientRect()
        const draggedSnap = dragSession.snapshot[dragSession.id]
        const rawX = e.clientX - rect.left - dragSession.offsetX
        const rawY = e.clientY - rect.top - dragSession.offsetY
        const maxX = Math.max(0, rect.width - (draggedSnap?.w ?? 0))
        const maxY = Math.max(0, rect.height - (draggedSnap?.h ?? 0))
        const newX = Math.max(0, Math.min(rawX, maxX))
        const newY = Math.max(0, Math.min(rawY, maxY))
        placeNode(
          nodeId,
          dragSession.id,
          { x: newX, y: newY },
          dragSession.snapshot,
          dragSession.sectionHeight,
        )
        setIsDropTarget(false)
        endDrag()
      }}
      onDragEnd={() => {
        endDrag()
        setIsDropTarget(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        selectNode(nodeId)
      }}
      className={`relative group/sel transition-all duration-150 ${
        isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      } ${
        isSelected
          ? 'ring-2 ring-accent ring-offset-1 ring-offset-white rounded-sm'
          : 'hover:ring-1 hover:ring-accent/40 hover:ring-offset-1 hover:ring-offset-white rounded-sm'
      }`}
    >
      {isSelected && (
        <span className="absolute -top-5 left-0 z-10 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap">
          {typeLabels[nodeType]}
        </span>
      )}
      {isDropTarget && (
        <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-accent bg-accent/5 rounded-sm z-20" />
      )}
      {children}
    </div>
  )
}
