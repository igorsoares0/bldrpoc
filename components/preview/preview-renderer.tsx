'use client'

import { useState } from 'react'
import type { Node } from '@/lib/types'
import {
  buildGridStyles,
  gridSectionClassName,
  isPlaceable,
} from '@/lib/grid-utils'

interface PreviewNodeProps {
  node: Node
  insideGrid?: boolean
  isRoot?: boolean
}

function cssId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_')
}

function GridSectionWrapper({
  node,
  tag: Tag,
  baseStyle,
  insideGrid,
}: {
  node: Node
  tag: 'div' | 'nav' | 'footer'
  baseStyle: React.CSSProperties
  insideGrid?: boolean
}) {
  const css = buildGridStyles(node)
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Tag
        className={gridSectionClassName(node.id)}
        style={{
          ...baseStyle,
          width: '100%',
          height: insideGrid ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {node.children?.map((child) => (
          <PreviewNode key={child.id} node={child} insideGrid={true} />
        ))}
      </Tag>
    </>
  )
}

function RootSectionNode({ node }: PreviewNodeProps) {
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
      {node.children?.map((child) => (
        <PreviewNode key={child.id} node={child} />
      ))}
    </div>
  )
}

function SectionNode({ node, insideGrid }: PreviewNodeProps) {
  const {
    padding = '24px',
    backgroundColor = '#ffffff',
    minHeight,
    borderRadius,
    boxShadow,
    border,
  } = node.props
  return (
    <GridSectionWrapper
      node={node}
      tag="div"
      baseStyle={{ padding, backgroundColor, minHeight, borderRadius, boxShadow, border }}
      insideGrid={insideGrid}
    />
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
        maxWidth: '100%',
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
    border = 'none',
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
        border,
        cursor: 'pointer',
        fontFamily: 'system-ui, sans-serif',
        width: '100%',
        height: '100%',
      }}
    >
      {label}
    </button>
  )
}

function FormNode({ node }: PreviewNodeProps) {
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
    successMessage = 'Thanks! Check your inbox.',
    action,
  } = node.props

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || status === 'submitting') return
    setStatus('submitting')
    try {
      if (typeof action === 'string' && action.length > 0) {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) throw new Error('Submit failed')
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: inputColor,
          fontSize,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {successMessage}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        disabled={status === 'submitting'}
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor,
          color: inputColor,
          border: `1px solid ${borderColor}`,
          borderRadius,
          padding: `${paddingY} ${paddingX}`,
          fontSize,
          fontFamily: 'system-ui, sans-serif',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          backgroundColor: buttonBackgroundColor,
          color: buttonColor,
          borderRadius,
          padding: `${paddingY} ${paddingX}`,
          fontSize,
          fontWeight: 600,
          border: 'none',
          cursor: status === 'submitting' ? 'wait' : 'pointer',
          fontFamily: 'system-ui, sans-serif',
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'submitting' ? '...' : buttonLabel}
      </button>
    </form>
  )
}

function MenuBarNode({ node, insideGrid }: PreviewNodeProps) {
  const { backgroundColor = '#09090b', padding = '16px 32px', minHeight } = node.props
  return (
    <GridSectionWrapper
      node={node}
      tag="nav"
      baseStyle={{ backgroundColor, padding, minHeight }}
      insideGrid={insideGrid}
    />
  )
}

function FooterNode({ node, insideGrid }: PreviewNodeProps) {
  const { backgroundColor = '#09090b', padding = '40px 24px', minHeight } = node.props
  return (
    <GridSectionWrapper
      node={node}
      tag="footer"
      baseStyle={{ backgroundColor, padding, minHeight }}
      insideGrid={insideGrid}
    />
  )
}

const renderers: Record<string, React.FC<PreviewNodeProps>> = {
  text: TextNode,
  image: ImageNode,
  button: ButtonNode,
  form: FormNode,
  'menu-bar': MenuBarNode,
  footer: FooterNode,
}

function PreviewNode({ node, insideGrid, isRoot }: PreviewNodeProps) {
  const Renderer =
    node.type === 'section'
      ? isRoot
        ? RootSectionNode
        : SectionNode
      : renderers[node.type]
  if (!Renderer) return null
  const element = <Renderer node={node} insideGrid={insideGrid} />
  if (insideGrid && isPlaceable(node.type)) {
    return <div data-id={cssId(node.id)}>{element}</div>
  }
  return element
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
      <PreviewNode node={tree} isRoot={true} />
    </div>
  )
}
