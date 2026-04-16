'use client'

import { SelectableWrapper } from './selectable-wrapper'
import type { Node } from '@/lib/types'

interface NodeRendererProps {
  node: Node
  parentId?: string
  sectionId?: string
}

interface ContainerRenderProps {
  node: Node
  sectionId?: string
}

function renderChildren(node: Node, sectionId?: string) {
  return node.children?.map((child) => (
    <NodeRenderer
      key={child.id}
      node={child}
      parentId={node.id}
      sectionId={sectionId}
    />
  ))
}

function SectionNode({ node, sectionId }: ContainerRenderProps) {
  const {
    padding = '24px',
    backgroundColor = '#ffffff',
    flexDirection = 'column',
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    gap = '16px',
    minHeight,
    freeLayout,
  } = node.props

  if (freeLayout) {
    return (
      <div
        style={{
          position: 'relative',
          padding,
          backgroundColor,
          minHeight,
          width: '100%',
        }}
      >
        {renderChildren(node, sectionId)}
      </div>
    )
  }

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
      {renderChildren(node, sectionId)}
    </div>
  )
}

function TextNode({ node }: ContainerRenderProps) {
  const {
    content = 'Text',
    variant = 'p',
    color = '#09090b',
    fontSize = '16px',
    fontWeight = '400',
    textAlign = 'left',
    lineHeight,
  } = node.props

  const Tag = variant as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

  return (
    <Tag
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
        lineHeight,
        margin: 0,
        fontFamily: 'inherit',
      }}
    >
      {content}
    </Tag>
  )
}

function ImageNode({ node }: ContainerRenderProps) {
  const {
    src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
    alt = 'Image',
    width = '100%',
    height = 'auto',
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
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  )
}

function MenuBarNode({ node, sectionId }: ContainerRenderProps) {
  const {
    backgroundColor = '#09090b',
    padding = '16px 32px',
    gap = '24px',
    minHeight,
    freeLayout,
  } = node.props

  if (freeLayout) {
    return (
      <nav
        style={{
          position: 'relative',
          backgroundColor,
          padding,
          minHeight,
          width: '100%',
        }}
      >
        {renderChildren(node, sectionId)}
      </nav>
    )
  }

  return (
    <nav
      style={{
        backgroundColor,
        padding,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap,
        width: '100%',
      }}
    >
      {renderChildren(node, sectionId)}
    </nav>
  )
}

function FooterNode({ node, sectionId }: ContainerRenderProps) {
  const {
    backgroundColor = '#09090b',
    padding = '40px 24px',
    gap = '16px',
    minHeight,
    freeLayout,
  } = node.props

  if (freeLayout) {
    return (
      <footer
        style={{
          position: 'relative',
          backgroundColor,
          padding,
          minHeight,
          width: '100%',
        }}
      >
        {renderChildren(node, sectionId)}
      </footer>
    )
  }

  return (
    <footer
      style={{
        backgroundColor,
        padding,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
        width: '100%',
      }}
    >
      {renderChildren(node, sectionId)}
    </footer>
  )
}

const renderers: Record<string, React.FC<ContainerRenderProps>> = {
  section: SectionNode,
  text: TextNode,
  image: ImageNode,
  button: ButtonNode,
  'menu-bar': MenuBarNode,
  footer: FooterNode,
}

export function NodeRenderer({ node, parentId, sectionId }: NodeRendererProps) {
  const Renderer = renderers[node.type]
  if (!Renderer) return null

  const effectiveSectionId = sectionId ?? (parentId ? node.id : undefined)

  return (
    <SelectableWrapper
      node={node}
      parentId={parentId}
      sectionId={effectiveSectionId}
    >
      <Renderer node={node} sectionId={effectiveSectionId} />
    </SelectableWrapper>
  )
}
