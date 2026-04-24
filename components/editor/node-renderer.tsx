'use client'

import { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import { SelectableWrapper } from './selectable-wrapper'
import { GridOverlay } from './grid-overlay'
import { useEditorStore } from '@/lib/store'
import { colsForViewport, gridSectionClassName, DEFAULT_ROW_HEIGHT } from '@/lib/grid-utils'
import { MENU_SLOTS, partitionMenuChildren } from '@/lib/menu-utils'
import { resolveProp } from '@/lib/prop-utils'
import type { MenuSlot, Node, NodeType } from '@/lib/types'

interface NodeRendererProps {
  node: Node
  parentId?: string
  parentType?: NodeType
  sectionId?: string
  parentGridLayout?: boolean
  indexInParent?: number
  isRoot?: boolean
}

interface ContainerRenderProps {
  node: Node
  sectionId?: string
}

function renderChildren(node: Node, sectionId?: string, parentGridLayout?: boolean) {
  return node.children?.map((child, i) => (
    <NodeRenderer
      key={child.id}
      node={child}
      parentId={node.id}
      parentType={node.type}
      sectionId={sectionId}
      parentGridLayout={parentGridLayout}
      indexInParent={i}
    />
  ))
}

function GridContainer({
  node,
  tag: Tag,
  baseStyle,
}: {
  node: Node
  tag: 'div' | 'nav' | 'footer'
  baseStyle: React.CSSProperties
}) {
  const viewport = useEditorStore((s) => s.viewport)
  const cols = colsForViewport(viewport)
  const rowHeight = node.props.rowHeight ?? DEFAULT_ROW_HEIGHT

  return (
    <Tag
      data-grid-section="true"
      data-node-id={node.id}
      className={gridSectionClassName(node.id)}
      style={{
        ...baseStyle,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: `${rowHeight}px`,
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {renderChildren(node, node.id, true)}
      <GridOverlay sectionId={node.id} />
    </Tag>
  )
}

function RootSectionNode({ node, sectionId }: ContainerRenderProps) {
  const {
    padding = '0px',
    backgroundColor = '#ffffff',
    flexDirection = 'column',
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    gap = '0px',
    minHeight,
  } = node.props

  return (
    <div
      style={{
        padding,
        backgroundColor,
        display: 'flex',
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        minHeight,
        width: '100%',
      }}
    >
      {renderChildren(node, sectionId, false)}
    </div>
  )
}

function SectionNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '24px'
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#ffffff'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
  const borderRadius = resolveProp<string>(node, 'borderRadius', viewport)
  const boxShadow = resolveProp<string>(node, 'boxShadow', viewport)
  const border = resolveProp<string>(node, 'border', viewport)
  return (
    <GridContainer
      node={node}
      tag="div"
      baseStyle={{ padding, backgroundColor, minHeight, borderRadius, boxShadow, border }}
    />
  )
}

let pendingEditCaret: { x: number; y: number } | null = null

function caretRangeAt(x: number, y: number): Range | null {
  if (typeof document.caretRangeFromPoint === 'function') {
    return document.caretRangeFromPoint(x, y)
  }
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: globalThis.Node; offset: number } | null
  }
  if (typeof doc.caretPositionFromPoint === 'function') {
    const pos = doc.caretPositionFromPoint(x, y)
    if (!pos) return null
    const r = document.createRange()
    r.setStart(pos.offsetNode, pos.offset)
    r.collapse(true)
    return r
  }
  return null
}

function TextNode({ node }: ContainerRenderProps) {
  const editingId = useEditorStore((s) => s.editingId)
  const updateNode = useEditorStore((s) => s.updateNode)
  const endTextEdit = useEditorStore((s) => s.endTextEdit)
  const viewport = useEditorStore((s) => s.viewport)
  const isEditing = editingId === node.id
  const ref = useRef<HTMLElement | null>(null)

  const content = (node.props.content as string | undefined) ?? 'Text'
  const variant = resolveProp<string>(node, 'variant', viewport) ?? 'p'
  const color = resolveProp<string>(node, 'color', viewport) ?? '#09090b'
  const fontSize = resolveProp<string>(node, 'fontSize', viewport) ?? '16px'
  const fontWeight = resolveProp<string>(node, 'fontWeight', viewport) ?? '400'
  const textAlign = (resolveProp<string>(node, 'textAlign', viewport) ?? 'left') as React.CSSProperties['textAlign']
  const lineHeight = resolveProp<string>(node, 'lineHeight', viewport)
  const fontFamily = resolveProp<string>(node, 'fontFamily', viewport)
  const fontStyle = resolveProp<string>(node, 'fontStyle', viewport)
  const letterSpacing = resolveProp<string>(node, 'letterSpacing', viewport)

  const Tag = variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

  useLayoutEffect(() => {
    if (!ref.current) return
    if (!isEditing && ref.current.textContent !== content) {
      ref.current.textContent = content
    }
  }, [content, isEditing])

  useEffect(() => {
    if (!isEditing || !ref.current) return
    ref.current.focus()
    const sel = window.getSelection()
    if (!sel) return
    sel.removeAllRanges()

    const point = pendingEditCaret
    pendingEditCaret = null
    const pointRange = point ? caretRangeAt(point.x, point.y) : null
    if (pointRange && ref.current.contains(pointRange.startContainer)) {
      sel.addRange(pointRange)
      return
    }

    const range = document.createRange()
    range.selectNodeContents(ref.current)
    sel.addRange(range)
  }, [isEditing])

  return (
    <Tag
      ref={(el) => {
        ref.current = el
        if (el && !isEditing && el.textContent !== content) {
          el.textContent = content
        }
      }}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        if (!isEditing) {
          pendingEditCaret = { x: e.clientX, y: e.clientY }
        }
      }}
      onBlur={(e) => {
        if (!isEditing) return
        const next = (e.currentTarget as HTMLElement).innerText
        if (next !== content) updateNode(node.id, { content: next })
        endTextEdit()
      }}
      onKeyDown={(e) => {
        if (!isEditing) return
        if (e.key === 'Escape') {
          e.preventDefault()
          e.stopPropagation()
          ;(e.currentTarget as HTMLElement).blur()
          return
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          document.execCommand('insertLineBreak')
        }
      }}
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
        lineHeight,
        fontStyle,
        letterSpacing,
        margin: 0,
        fontFamily: fontFamily || 'inherit',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
        outline: isEditing ? 'none' : undefined,
        cursor: isEditing ? 'text' : undefined,
      }}
    />
  )
}

function ImageNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const src = (node.props.src as string | undefined) ?? 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image'
  const alt = (node.props.alt as string | undefined) ?? 'Image'
  const width = resolveProp<string>(node, 'width', viewport) ?? '100%'
  const height = resolveProp<string>(node, 'height', viewport) ?? '100%'
  const borderRadius = resolveProp<string>(node, 'borderRadius', viewport) ?? '0px'
  const objectFit = (resolveProp<string>(node, 'objectFit', viewport) ?? 'cover') as React.CSSProperties['objectFit']

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height,
        borderRadius,
        objectFit,
        maxWidth: '100%',
        display: 'block',
      }}
    />
  )
}

function ButtonNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const label = (node.props.label as string | undefined) ?? 'Button'
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#3b82f6'
  const color = resolveProp<string>(node, 'color', viewport) ?? '#ffffff'
  const borderRadius = resolveProp<string>(node, 'borderRadius', viewport) ?? '8px'
  const paddingX = resolveProp<string>(node, 'paddingX', viewport) ?? '24px'
  const paddingY = resolveProp<string>(node, 'paddingY', viewport) ?? '12px'
  const fontSize = resolveProp<string>(node, 'fontSize', viewport) ?? '16px'
  const fontWeight = resolveProp<string>(node, 'fontWeight', viewport) ?? '600'
  const border = resolveProp<string>(node, 'border', viewport) ?? 'none'
  const fontFamily = resolveProp<string>(node, 'fontFamily', viewport)
  const fontStyle = resolveProp<string>(node, 'fontStyle', viewport)
  const letterSpacing = resolveProp<string>(node, 'letterSpacing', viewport)

  return (
    <button
      type="button"
      style={{
        backgroundColor,
        color,
        borderRadius,
        padding: `${paddingY} ${paddingX}`,
        fontSize,
        fontWeight,
        fontStyle,
        letterSpacing,
        border,
        cursor: 'pointer',
        fontFamily: fontFamily || 'inherit',
        width: '100%',
        height: '100%',
      }}
    >
      {label}
    </button>
  )
}

function FormNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const placeholder = (node.props.placeholder as string | undefined) ?? 'your@email.com'
  const buttonLabel = (node.props.buttonLabel as string | undefined) ?? 'Subscribe'
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#ffffff'
  const borderColor = resolveProp<string>(node, 'borderColor', viewport) ?? '#e4e4e7'
  const borderRadius = resolveProp<string>(node, 'borderRadius', viewport) ?? '8px'
  const inputColor = resolveProp<string>(node, 'inputColor', viewport) ?? '#09090b'
  const buttonBackgroundColor = resolveProp<string>(node, 'buttonBackgroundColor', viewport) ?? '#3b82f6'
  const buttonColor = resolveProp<string>(node, 'buttonColor', viewport) ?? '#ffffff'
  const fontSize = resolveProp<string>(node, 'fontSize', viewport) ?? '14px'
  const paddingX = resolveProp<string>(node, 'paddingX', viewport) ?? '14px'
  const paddingY = resolveProp<string>(node, 'paddingY', viewport) ?? '10px'
  const gap = resolveProp<string>(node, 'gap', viewport) ?? '8px'
  const fontFamily = resolveProp<string>(node, 'fontFamily', viewport)
  const fontStyle = resolveProp<string>(node, 'fontStyle', viewport)
  const letterSpacing = resolveProp<string>(node, 'letterSpacing', viewport)

  const typographyStyle = {
    fontFamily: fontFamily || 'inherit',
    fontStyle,
    letterSpacing,
  }

  return (
    <div
      style={{
        display: 'flex',
        gap,
        alignItems: 'stretch',
        width: '100%',
        height: '100%',
      }}
    >
      <input
        type="email"
        placeholder={placeholder}
        readOnly
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor,
          color: inputColor,
          border: `1px solid ${borderColor}`,
          borderRadius,
          padding: `${paddingY} ${paddingX}`,
          fontSize,
          ...typographyStyle,
          outline: 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        role="presentation"
        style={{
          backgroundColor: buttonBackgroundColor,
          color: buttonColor,
          borderRadius,
          padding: `${paddingY} ${paddingX}`,
          fontSize,
          fontWeight: 600,
          ...typographyStyle,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {buttonLabel}
      </div>
    </div>
  )
}

function MenuBarNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#09090b'
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '16px 32px'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
  const partitioned = partitionMenuChildren(node)
  const menuDragSession = useEditorStore((s) => s.menuDragSession)
  const menuDropPreview = useEditorStore((s) => s.menuDropPreview)
  const isActive = menuDragSession?.menuBarId === node.id

  return (
    <nav
      data-menu-bar="true"
      data-node-id={node.id}
      style={{
        backgroundColor,
        padding,
        minHeight,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
        alignItems: 'center',
        gap: 16,
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {MENU_SLOTS.map((slot) => (
        <MenuSlotEl
          key={slot}
          menuBarId={node.id}
          slot={slot}
          items={partitioned[slot]}
          dropIndex={
            isActive && menuDropPreview?.slot === slot ? menuDropPreview.index : null
          }
        />
      ))}
    </nav>
  )
}

function MenuSlotEl({
  menuBarId,
  slot,
  items,
  dropIndex,
}: {
  menuBarId: string
  slot: MenuSlot
  items: Node[]
  dropIndex: number | null
}) {
  const menuDragSession = useEditorStore((s) => s.menuDragSession)
  const setMenuDropPreview = useEditorStore((s) => s.setMenuDropPreview)
  const reorderMenuChild = useEditorStore((s) => s.reorderMenuChild)
  const endMenuDrag = useEditorStore((s) => s.endMenuDrag)

  const justifyContent =
    slot === 'left' ? 'flex-start' : slot === 'right' ? 'flex-end' : 'center'

  function computeIndex(e: React.DragEvent<HTMLDivElement>): number {
    const slotEl = e.currentTarget
    const itemEls = Array.from(
      slotEl.querySelectorAll<HTMLElement>(':scope > [data-menu-item="true"]'),
    )
    for (let k = 0; k < itemEls.length; k++) {
      const r = itemEls[k].getBoundingClientRect()
      if (e.clientX < r.left + r.width / 2) return k
    }
    return itemEls.length
  }

  const isReceptive =
    menuDragSession !== null && menuDragSession.menuBarId === menuBarId

  return (
    <div
      data-menu-slot={slot}
      onDragOver={(e) => {
        if (!isReceptive) return
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        setMenuDropPreview({ menuBarId, slot, index: computeIndex(e) })
      }}
      onDragLeave={(e) => {
        if (!isReceptive) return
        const next = e.relatedTarget as globalThis.Node | null
        if (next && e.currentTarget.contains(next)) return
        setMenuDropPreview(null)
      }}
      onDrop={(e) => {
        if (!isReceptive || !menuDragSession) return
        e.preventDefault()
        e.stopPropagation()
        reorderMenuChild(menuBarId, menuDragSession.id, slot, computeIndex(e))
        endMenuDrag()
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        gap: 16,
        minHeight: 24,
        minWidth: isReceptive && items.length === 0 ? 80 : undefined,
        position: 'relative',
        outline:
          isReceptive && items.length === 0
            ? '1px dashed rgba(236,72,153,0.5)'
            : undefined,
      }}
    >
      {items.map((child, i) => (
        <Fragment key={child.id}>
          {dropIndex === i && <DropIndicator />}
          <NodeRenderer
            node={child}
            parentId={menuBarId}
            parentType="menu-bar"
            sectionId={menuBarId}
            parentGridLayout={false}
            indexInParent={i}
          />
        </Fragment>
      ))}
      {dropIndex === items.length && <DropIndicator />}
    </div>
  )
}

function DropIndicator() {
  return (
    <span
      aria-hidden
      style={{
        width: 2,
        alignSelf: 'stretch',
        minHeight: 20,
        backgroundColor: '#ec4899',
        borderRadius: 1,
      }}
    />
  )
}

function FooterNode({ node }: ContainerRenderProps) {
  const viewport = useEditorStore((s) => s.viewport)
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#09090b'
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '40px 24px'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
  return (
    <GridContainer
      node={node}
      tag="footer"
      baseStyle={{ backgroundColor, padding, minHeight }}
    />
  )
}

const renderers: Record<string, React.FC<ContainerRenderProps>> = {
  text: TextNode,
  image: ImageNode,
  button: ButtonNode,
  form: FormNode,
  'menu-bar': MenuBarNode,
  footer: FooterNode,
}

export function NodeRenderer({
  node,
  parentId,
  parentType,
  sectionId,
  parentGridLayout,
  indexInParent = 0,
  isRoot = false,
}: NodeRendererProps) {
  const Renderer =
    node.type === 'section'
      ? isRoot
        ? RootSectionNode
        : SectionNode
      : renderers[node.type]
  if (!Renderer) return null

  const effectiveSectionId = sectionId ?? (parentId ? node.id : undefined)

  return (
    <SelectableWrapper
      node={node}
      parentId={parentId}
      parentType={parentType}
      sectionId={effectiveSectionId}
      parentGridLayout={parentGridLayout}
      indexInParent={indexInParent}
    >
      <Renderer node={node} sectionId={effectiveSectionId} />
    </SelectableWrapper>
  )
}
