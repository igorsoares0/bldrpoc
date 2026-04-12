'use client'

import type { Node } from '@/lib/types'

interface PreviewNodeProps {
  node: Node
}

function SectionNode({ node }: PreviewNodeProps) {
  const {
    padding = '24px',
    backgroundColor = '#ffffff',
    flexDirection = 'column',
    alignItems = 'stretch',
    justifyContent = 'flex-start',
    gap = '16px',
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
      {node.children?.map((child) => (
        <PreviewNode key={child.id} node={child} />
      ))}
    </div>
  )
}

function TextNode({ node }: PreviewNodeProps) {
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
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {content}
    </Tag>
  )
}

function ImageNode({ node }: PreviewNodeProps) {
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

function ButtonNode({ node }: PreviewNodeProps) {
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
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {label}
    </button>
  )
}

const renderers: Record<string, React.FC<PreviewNodeProps>> = {
  section: SectionNode,
  text: TextNode,
  image: ImageNode,
  button: ButtonNode,
}

function PreviewNode({ node }: PreviewNodeProps) {
  const Renderer = renderers[node.type]
  if (!Renderer) return null
  return <Renderer node={node} />
}

export function PreviewRenderer({ tree }: { tree: Node }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <PreviewNode node={tree} />
    </div>
  )
}
