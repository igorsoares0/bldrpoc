'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { SelectableWrapper } from './selectable-wrapper'
import { GridOverlay } from './grid-overlay'
import { useEditorStore } from '@/lib/store'
import { colsForViewport, gridSectionClassName, DEFAULT_ROW_HEIGHT } from '@/lib/grid-utils'
import type { Node } from '@/lib/types'

interface NodeRendererProps {
  node: Node
  parentId?: string
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
  const {
    padding = '24px',
    backgroundColor = '#ffffff',
    minHeight,
    borderRadius,
    boxShadow,
    border,
  } = node.props
  return (
    <GridContainer
      node={node}
      tag="div"
      baseStyle={{ padding, backgroundColor, minHeight, borderRadius, boxShadow, border }}
    />
  )
}

function TextNode({ node }: ContainerRenderProps) {
  const editingId = useEditorStore((s) => s.editingId)
  const updateNode = useEditorStore((s) => s.updateNode)
  const endTextEdit = useEditorStore((s) => s.endTextEdit)
  const isEditing = editingId === node.id
  const ref = useRef<HTMLElement | null>(null)

  const {
    content = 'Text',
    variant = 'p',
    color = '#09090b',
    fontSize = '16px',
    fontWeight = '400',
    textAlign = 'left',
    lineHeight,
    fontFamily,
    fontStyle,
    letterSpacing,
  } = node.props

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
    const range = document.createRange()
    range.selectNodeContents(ref.current)
    range.collapse(false)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
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
      onBlur={(e) => {
        if (!isEditing) return
        const next = (e.currentTarget as HTMLElement).innerText
        if (next !== content) updateNode(node.id, { content: next })
        endTextEdit()
      }}
      onKeyDown={(e) => {
        if (!isEditing) return
        if (e.key === 'Escape' || e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
          ;(e.currentTarget as HTMLElement).blur()
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
        outline: isEditing ? 'none' : undefined,
        cursor: isEditing ? 'text' : undefined,
      }}
    />
  )
}

function ImageNode({ node }: ContainerRenderProps) {
  const {
    src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
    alt = 'Image',
    width = '100%',
    height = '100%',
    borderRadius = '0px',
    objectFit = 'cover',
  } = node.props

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
  const {
    label = 'Button',
    backgroundColor = '#3b82f6',
    color = '#ffffff',
    borderRadius = '8px',
    paddingX = '24px',
    paddingY = '12px',
    fontSize = '16px',
    fontWeight = '600',
    border = 'none',
    fontFamily,
    fontStyle,
    letterSpacing,
  } = node.props

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
  const {
    placeholder = 'your@email.com',
    buttonLabel = 'Subscribe',
    backgroundColor = '#ffffff',
    borderColor = '#e4e4e7',
    borderRadius = '8px',
    inputColor = '#09090b',
    buttonBackgroundColor = '#3b82f6',
    buttonColor = '#ffffff',
    fontSize = '14px',
    paddingX = '14px',
    paddingY = '10px',
    gap = '8px',
    fontFamily,
    fontStyle,
    letterSpacing,
  } = node.props

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
  const { backgroundColor = '#09090b', padding = '16px 32px', minHeight } = node.props
  return (
    <GridContainer
      node={node}
      tag="nav"
      baseStyle={{ backgroundColor, padding, minHeight }}
    />
  )
}

function FooterNode({ node }: ContainerRenderProps) {
  const { backgroundColor = '#09090b', padding = '40px 24px', minHeight } = node.props
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
      sectionId={effectiveSectionId}
      parentGridLayout={parentGridLayout}
      indexInParent={indexInParent}
    >
      <Renderer node={node} sectionId={effectiveSectionId} />
    </SelectableWrapper>
  )
}
