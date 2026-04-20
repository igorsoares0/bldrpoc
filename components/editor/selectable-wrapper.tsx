'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { useEditorStore, type DragSession } from '@/lib/store'
import { getNodeById } from '@/lib/tree-utils'
import {
  clampPlacement,
  colsForViewport,
  computeResizePlacement,
  DEFAULT_ROW_HEIGHT,
  defaultDesktopPlacement,
  defaultMobilePlacement,
  getActivePlacement,
  isGridContainerType,
  isPlaceable,
  placementToStyle,
  type ResizeAnchor,
} from '@/lib/grid-utils'
import type { GridPlacement, GridProps, Node, NodeType } from '@/lib/types'

const typeLabels: Record<NodeType, string> = {
  section: 'Section',
  text: 'Text',
  image: 'Image',
  button: 'Button',
  form: 'Form',
  'menu-bar': 'Menu Bar',
  footer: 'Footer',
}

interface SelectableWrapperProps {
  node: Node
  parentId?: string
  sectionId?: string
  parentGridLayout?: boolean
  indexInParent?: number
  children: React.ReactNode
}

type SectionMetrics = {
  contentLeft: number
  contentTop: number
  contentWidth: number
  contentHeight: number
  cellWidth: number
  rowHeight: number
}

function readSectionMetrics(
  sectionEl: HTMLElement,
  cols: number,
  rowHeight: number,
): SectionMetrics {
  const rect = sectionEl.getBoundingClientRect()
  const cs = getComputedStyle(sectionEl)
  const padL = parseFloat(cs.paddingLeft) || 0
  const padR = parseFloat(cs.paddingRight) || 0
  const padT = parseFloat(cs.paddingTop) || 0
  const padB = parseFloat(cs.paddingBottom) || 0
  const contentWidth = Math.max(1, rect.width - padL - padR)
  const contentHeight = Math.max(1, rect.height - padT - padB)
  return {
    contentLeft: rect.left + padL,
    contentTop: rect.top + padT,
    contentWidth,
    contentHeight,
    cellWidth: contentWidth / cols,
    rowHeight,
  }
}

function placeableFitStyle(node: Node): CSSProperties {
  if (node.type === 'text') {
    const ta = node.props.textAlign as string | undefined
    const justifySelf =
      ta === 'right' ? 'end' : ta === 'center' ? 'center' : 'start'
    return { justifySelf, alignSelf: 'center', minWidth: 0 }
  }
  if (
    node.type === 'button' ||
    node.type === 'image' ||
    node.type === 'form' ||
    isGridContainerType(node.type)
  ) {
    return {
      justifySelf: 'stretch',
      alignSelf: 'stretch',
      minWidth: 0,
      minHeight: 0,
    }
  }
  return { justifySelf: 'center', alignSelf: 'center', minWidth: 0 }
}

function rectToPlacement(
  childRect: DOMRect,
  metrics: SectionMetrics,
  cols: number,
): GridPlacement {
  const colSpan = Math.max(1, Math.round(childRect.width / metrics.cellWidth))
  const rowSpan = Math.max(1, Math.round(childRect.height / metrics.rowHeight))
  const col = Math.max(
    1,
    Math.round((childRect.left - metrics.contentLeft) / metrics.cellWidth) + 1,
  )
  const row = Math.max(
    1,
    Math.round((childRect.top - metrics.contentTop) / metrics.rowHeight) + 1,
  )
  return clampPlacement({ col, row, colSpan, rowSpan }, cols)
}

function snapshotDirectChildren(
  sectionEl: HTMLElement,
  metrics: SectionMetrics,
  cols: number,
): Record<string, GridPlacement> {
  const out: Record<string, GridPlacement> = {}
  Array.from(sectionEl.children).forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    const id = el.getAttribute('data-node-id')
    const type = el.getAttribute('data-node-type') as NodeType | null
    if (!id || !type || !isPlaceable(type)) return
    const r = el.getBoundingClientRect()
    out[id] = rectToPlacement(r, metrics, cols)
  })
  return out
}

export function SelectableWrapper({
  node,
  sectionId,
  parentGridLayout,
  indexInParent = 0,
  children,
}: SelectableWrapperProps) {
  const selectedId = useEditorStore((s) => s.selectedId)
  const editingId = useEditorStore((s) => s.editingId)
  const selectNode = useEditorStore((s) => s.selectNode)
  const beginTextEdit = useEditorStore((s) => s.beginTextEdit)
  const dragSession = useEditorStore((s) => s.dragSession)
  const beginDrag = useEditorStore((s) => s.beginDrag)
  const endDrag = useEditorStore((s) => s.endDrag)
  const setDragGhost = useEditorStore((s) => s.setDragGhost)
  const placeNodeInGrid = useEditorStore((s) => s.placeNodeInGrid)
  const updateNode = useEditorStore((s) => s.updateNode)
  const viewport = useEditorStore((s) => s.viewport)

  const [resizePreview, setResizePreview] = useState<GridPlacement | null>(null)
  const resizingRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const { id: nodeId, type: nodeType } = node
  const isSelected = selectedId === nodeId
  const isEditing = editingId === nodeId
  const nodeIsPlaceable = isPlaceable(nodeType)
  const isGridContainer = isGridContainerType(nodeType)
  const isResizing = resizePreview !== null
  const isDraggable =
    nodeIsPlaceable &&
    Boolean(parentGridLayout) &&
    Boolean(sectionId) &&
    !isEditing &&
    !isResizing
  const showResizeHandles =
    isSelected &&
    (nodeType === 'button' ||
      nodeType === 'image' ||
      nodeType === 'form' ||
      isGridContainer) &&
    Boolean(parentGridLayout) &&
    Boolean(sectionId)

  const activePlacement = getActivePlacement(node, viewport, indexInParent)
  const effectivePlacement = resizePreview ?? activePlacement

  const placementStyle: CSSProperties =
    parentGridLayout && nodeIsPlaceable
      ? {
          ...placementToStyle(effectivePlacement),
          ...placeableFitStyle(node),
        }
      : {}

  function startResize(e: React.MouseEvent, anchor: ResizeAnchor) {
    if (!sectionId) return
    e.stopPropagation()
    e.preventDefault()
    resizingRef.current = true

    const sectionEl = document.querySelector<HTMLElement>(
      `[data-grid-section][data-node-id="${sectionId}"]`,
    )
    if (!sectionEl) {
      resizingRef.current = false
      return
    }

    const cols = colsForViewport(viewport)
    const sectionNode = getNodeById(useEditorStore.getState().tree, sectionId)
    const rowHeight = sectionNode?.props.rowHeight ?? DEFAULT_ROW_HEIGHT
    const metrics = readSectionMetrics(sectionEl, cols, rowHeight)
    const start = activePlacement

    function onMove(ev: MouseEvent) {
      const placement = computeResizePlacement(
        anchor,
        ev.clientX,
        ev.clientY,
        start,
        metrics,
        cols,
      )
      setResizePreview(placement)
    }

    function onUp(ev: MouseEvent) {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const placement = computeResizePlacement(
        anchor,
        ev.clientX,
        ev.clientY,
        start,
        metrics,
        cols,
      )
      setResizePreview(null)
      setTimeout(() => {
        resizingRef.current = false
      }, 0)
      const current = getNodeById(useEditorStore.getState().tree, nodeId)
      if (!current) return
      const grid = (current.props.grid as GridProps | undefined) ?? {
        desktop: defaultDesktopPlacement(indexInParent),
        mobile: defaultMobilePlacement(indexInParent),
      }
      const nextGrid: GridProps =
        viewport === 'desktop'
          ? { ...grid, desktop: placement }
          : { ...grid, mobile: placement }
      updateNode(nodeId, { grid: nextGrid })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const suppressDragOnHandle = () => {
    if (wrapperRef.current) wrapperRef.current.draggable = false
  }
  const restoreDragOnHandleLeave = () => {
    if (wrapperRef.current && isDraggable && !resizingRef.current) {
      wrapperRef.current.draggable = true
    }
  }

  const canAcceptDrop =
    isGridContainer &&
    dragSession !== null &&
    dragSession.sectionId === nodeId

  const isDropTarget = canAcceptDrop && Boolean(dragSession)

  return (
    <div
      ref={wrapperRef}
      data-node-id={nodeId}
      data-node-type={nodeType}
      style={placementStyle}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (resizingRef.current) {
          e.preventDefault()
          return
        }
        if (!isDraggable || !sectionId) return
        e.stopPropagation()

        const sectionEl = document.querySelector<HTMLElement>(
          `[data-grid-section][data-node-id="${sectionId}"]`,
        )
        if (!sectionEl) return

        const cols = colsForViewport(viewport)
        const sectionNode = getNodeById(useEditorStore.getState().tree, sectionId)
        const rowHeight = sectionNode?.props.rowHeight ?? DEFAULT_ROW_HEIGHT

        const metrics = readSectionMetrics(sectionEl, cols, rowHeight)
        const childRect = e.currentTarget.getBoundingClientRect()
        const offsetCol = (e.clientX - metrics.contentLeft) / metrics.cellWidth -
          (childRect.left - metrics.contentLeft) / metrics.cellWidth
        const offsetRow = (e.clientY - metrics.contentTop) / metrics.rowHeight -
          (childRect.top - metrics.contentTop) / metrics.rowHeight

        const snapshot = snapshotDirectChildren(sectionEl, metrics, cols)

        const draggedPlacement = snapshot[nodeId] ?? {
          col: 1,
          row: 1,
          colSpan: 4,
          rowSpan: 4,
        }

        const session: DragSession = {
          id: nodeId,
          sectionId,
          viewport,
          cols,
          cellWidth: metrics.cellWidth,
          rowHeight: metrics.rowHeight,
          offsetCol,
          offsetRow,
          colSpan: draggedPlacement.colSpan,
          rowSpan: draggedPlacement.rowSpan,
          snapshot,
        }

        e.dataTransfer.setData('text/node-id', nodeId)
        e.dataTransfer.effectAllowed = 'move'
        beginDrag(session)
      }}
      onDragOver={(e) => {
        if (!canAcceptDrop || !dragSession) return
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'

        const sectionEl = document.querySelector<HTMLElement>(
          `[data-grid-section][data-node-id="${nodeId}"]`,
        )
        if (!sectionEl) return
        const metrics = readSectionMetrics(
          sectionEl,
          dragSession.cols,
          dragSession.rowHeight,
        )
        const cursorCol = (e.clientX - metrics.contentLeft) / metrics.cellWidth
        const cursorRow = (e.clientY - metrics.contentTop) / metrics.rowHeight
        const placement = clampPlacement(
          {
            col: Math.floor(cursorCol - dragSession.offsetCol) + 1,
            row: Math.floor(cursorRow - dragSession.offsetRow) + 1,
            colSpan: dragSession.colSpan,
            rowSpan: dragSession.rowSpan,
          },
          dragSession.cols,
        )
        setDragGhost(placement)
      }}
      onDragLeave={(e) => {
        if (!canAcceptDrop) return
        const next = e.relatedTarget as globalThis.Node | null
        if (next && e.currentTarget.contains(next)) return
        setDragGhost(null)
      }}
      onDrop={(e) => {
        if (!canAcceptDrop || !dragSession) return
        e.preventDefault()
        e.stopPropagation()

        const sectionEl = document.querySelector<HTMLElement>(
          `[data-grid-section][data-node-id="${nodeId}"]`,
        )
        if (!sectionEl) {
          endDrag()
          return
        }
        const metrics = readSectionMetrics(
          sectionEl,
          dragSession.cols,
          dragSession.rowHeight,
        )
        const cursorCol = (e.clientX - metrics.contentLeft) / metrics.cellWidth
        const cursorRow = (e.clientY - metrics.contentTop) / metrics.rowHeight
        const rawCol = Math.floor(cursorCol - dragSession.offsetCol) + 1
        const rawRow = Math.floor(cursorRow - dragSession.offsetRow) + 1

        const placement = clampPlacement(
          {
            col: rawCol,
            row: rawRow,
            colSpan: dragSession.colSpan,
            rowSpan: dragSession.rowSpan,
          },
          dragSession.cols,
        )

        placeNodeInGrid(
          nodeId,
          dragSession.id,
          placement,
          dragSession.snapshot,
          dragSession.viewport,
        )
        endDrag()
      }}
      onDragEnd={() => {
        endDrag()
      }}
      onClick={(e) => {
        if (isEditing) return
        e.stopPropagation()
        selectNode(nodeId)
      }}
      onDoubleClick={(e) => {
        if (nodeType !== 'text') return
        e.stopPropagation()
        beginTextEdit(nodeId)
      }}
      className={`relative group/sel ${isResizing ? '' : 'transition-all duration-150'} ${
        isEditing
          ? 'cursor-text'
          : isDraggable
            ? 'cursor-grab active:cursor-grabbing'
            : 'cursor-pointer'
      } ${
        isSelected
          ? 'ring-2 ring-accent ring-offset-1 ring-offset-white rounded-sm'
          : 'hover:ring-1 hover:ring-accent/40 hover:ring-offset-1 hover:ring-offset-white rounded-sm'
      }`}
    >
      {children}
      {isSelected && (
        <span className="absolute -top-5 left-0 z-10 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap pointer-events-none">
          {typeLabels[nodeType]}
        </span>
      )}
      {isDropTarget && (
        <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-accent/40 rounded-sm z-20" />
      )}
      {showResizeHandles &&
        (['nw', 'ne', 'sw', 'se'] as const).map((anchor) => (
          <span
            key={anchor}
            onMouseEnter={suppressDragOnHandle}
            onMouseLeave={restoreDragOnHandleLeave}
            onMouseDown={(e) => startResize(e, anchor)}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            className="absolute z-30 h-2.5 w-2.5 rounded-sm border border-white bg-accent shadow"
            style={{
              top: anchor.startsWith('n') ? -5 : undefined,
              bottom: anchor.startsWith('s') ? -5 : undefined,
              left: anchor.endsWith('w') ? -5 : undefined,
              right: anchor.endsWith('e') ? -5 : undefined,
              cursor:
                anchor === 'nw' || anchor === 'se'
                  ? 'nwse-resize'
                  : 'nesw-resize',
            }}
          />
        ))}
    </div>
  )
}
