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
  isMenuModeContainerType,
  isPlaceable,
  placementToStyle,
  snapPlacementToSiblings,
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
  parentType?: NodeType
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

function placeableFitStyle(node: Node, parentType?: NodeType): CSSProperties {
  if (isMenuModeContainerType(parentType)) {
    const ta = node.type === 'text' ? (node.props.textAlign as string | undefined) : undefined
    const justifySelf =
      ta === 'right' ? 'end' : ta === 'center' ? 'center' : 'start'
    return {
      justifySelf,
      alignSelf: 'center',
      minWidth: 0,
      whiteSpace: 'nowrap',
    }
  }
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

export function SelectableWrapper({
  node,
  parentType,
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
  const setDragSnapGuides = useEditorStore((s) => s.setDragSnapGuides)
  const placeNodeInGrid = useEditorStore((s) => s.placeNodeInGrid)
  const updateNode = useEditorStore((s) => s.updateNode)
  const viewport = useEditorStore((s) => s.viewport)
  const beginMenuDrag = useEditorStore((s) => s.beginMenuDrag)
  const endMenuDrag = useEditorStore((s) => s.endMenuDrag)

  const [resizePreview, setResizePreview] = useState<GridPlacement | null>(null)
  const resizingRef = useRef(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const { id: nodeId, type: nodeType } = node
  const isSelected = selectedId === nodeId
  const isEditing = editingId === nodeId
  const nodeIsPlaceable = isPlaceable(nodeType)
  const isGridContainer = isGridContainerType(nodeType)
  const isResizing = resizePreview !== null
  const isMenuItem = parentType === 'menu-bar'
  const isDraggable =
    nodeIsPlaceable &&
    Boolean(sectionId) &&
    !isEditing &&
    !isResizing &&
    (isMenuItem || Boolean(parentGridLayout))
  const showResizeHandles =
    isSelected &&
    !isMenuItem &&
    (nodeType === 'button' ||
      nodeType === 'image' ||
      nodeType === 'form' ||
      isGridContainer) &&
    Boolean(parentGridLayout) &&
    Boolean(sectionId)

  const activePlacement = getActivePlacement(node, viewport, indexInParent)
  const effectivePlacement = resizePreview ?? activePlacement

  const placementStyle: CSSProperties =
    parentGridLayout && nodeIsPlaceable && !isMenuItem
      ? {
          ...placementToStyle(effectivePlacement),
          ...placeableFitStyle(node, parentType),
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
    const menuMode = isMenuModeContainerType(sectionNode?.type)
    const wrapperEl = wrapperRef.current
    const minColSpan = menuMode && wrapperEl
      ? Math.max(
          1,
          Math.ceil(
            Math.max(wrapperEl.scrollWidth, wrapperEl.getBoundingClientRect().width) /
              metrics.cellWidth,
          ),
        )
      : 1

    function constrain(p: GridPlacement): GridPlacement {
      if (!menuMode) return p
      const colSpan = Math.max(p.colSpan, minColSpan)
      return { col: p.col, row: 1, colSpan, rowSpan: 1 }
    }

    function onMove(ev: MouseEvent) {
      const placement = constrain(
        computeResizePlacement(anchor, ev.clientX, ev.clientY, start, metrics, cols),
      )
      setResizePreview(placement)
    }

    function onUp(ev: MouseEvent) {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      const placement = constrain(
        computeResizePlacement(anchor, ev.clientX, ev.clientY, start, metrics, cols),
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
      data-menu-item={isMenuItem ? 'true' : undefined}
      style={placementStyle}
      draggable={isDraggable}
      onDragStart={(e) => {
        if (resizingRef.current) {
          e.preventDefault()
          return
        }
        if (!isDraggable || !sectionId) return
        e.stopPropagation()

        if (isMenuItem) {
          beginMenuDrag({
            id: nodeId,
            menuBarId: sectionId,
            sourceSlot:
              node.props.slot === 'center' || node.props.slot === 'right'
                ? node.props.slot
                : 'left',
          })
          e.dataTransfer.setData('text/menu-item', nodeId)
          e.dataTransfer.effectAllowed = 'move'
          return
        }

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

        const sectionType = sectionNode?.type
        const isMenuMode = isMenuModeContainerType(sectionType)
        const naturalWidth = isMenuMode
          ? Math.max(
              e.currentTarget.scrollWidth,
              e.currentTarget.getBoundingClientRect().width,
            )
          : 0
        const minColSpan = isMenuMode
          ? Math.max(1, Math.ceil(naturalWidth / metrics.cellWidth))
          : 1

        const session: DragSession = {
          id: nodeId,
          sectionId,
          viewport,
          cols,
          cellWidth: metrics.cellWidth,
          rowHeight: metrics.rowHeight,
          offsetCol,
          offsetRow,
          colSpan: isMenuMode
            ? Math.max(draggedPlacement.colSpan, minColSpan)
            : draggedPlacement.colSpan,
          rowSpan: isMenuMode ? 1 : draggedPlacement.rowSpan,
          snapshot,
          isMenuMode,
          minColSpan,
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
        const raw: GridPlacement = {
          col: Math.floor(cursorCol - dragSession.offsetCol) + 1,
          row: dragSession.isMenuMode
            ? 1
            : Math.floor(cursorRow - dragSession.offsetRow) + 1,
          colSpan: dragSession.isMenuMode
            ? Math.max(dragSession.colSpan, dragSession.minColSpan)
            : dragSession.colSpan,
          rowSpan: dragSession.isMenuMode ? 1 : dragSession.rowSpan,
        }
        const snapped = snapPlacementToSiblings(
          raw,
          dragSession.snapshot,
          dragSession.id,
        )
        if (dragSession.isMenuMode) {
          snapped.placement.row = 1
          snapped.placement.rowSpan = 1
        }
        const placement = clampPlacement(snapped.placement, dragSession.cols)
        setDragGhost(placement)
        setDragSnapGuides(
          snapped.guides.cols.length || snapped.guides.rows.length
            ? snapped.guides
            : null,
        )
      }}
      onDragLeave={(e) => {
        if (!canAcceptDrop) return
        const next = e.relatedTarget as globalThis.Node | null
        if (next && e.currentTarget.contains(next)) return
        setDragGhost(null)
        setDragSnapGuides(null)
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
        const raw: GridPlacement = {
          col: Math.floor(cursorCol - dragSession.offsetCol) + 1,
          row: dragSession.isMenuMode
            ? 1
            : Math.floor(cursorRow - dragSession.offsetRow) + 1,
          colSpan: dragSession.isMenuMode
            ? Math.max(dragSession.colSpan, dragSession.minColSpan)
            : dragSession.colSpan,
          rowSpan: dragSession.isMenuMode ? 1 : dragSession.rowSpan,
        }
        const snapped = snapPlacementToSiblings(
          raw,
          dragSession.snapshot,
          dragSession.id,
        )
        if (dragSession.isMenuMode) {
          snapped.placement.row = 1
          snapped.placement.rowSpan = 1
        }
        const placement = clampPlacement(snapped.placement, dragSession.cols)

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
        endMenuDrag()
      }}
      onMouseDown={(e) => {
        if (isEditing) e.stopPropagation()
      }}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation()
          return
        }
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
        isEditing
          ? 'ring-2 ring-pink-500 ring-offset-1 ring-offset-white rounded-sm'
          : isSelected
            ? 'ring-2 ring-accent ring-offset-1 ring-offset-white rounded-sm'
            : 'hover:ring-1 hover:ring-accent/40 hover:ring-offset-1 hover:ring-offset-white rounded-sm'
      }`}
    >
      {children}
      {(isSelected || isEditing) && (
        <span
          className={`absolute -top-5 left-0 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap pointer-events-none ${
            isEditing ? 'bg-pink-500' : 'bg-accent'
          }`}
        >
          {isEditing ? 'Editing — click outside to finish' : typeLabels[nodeType]}
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
