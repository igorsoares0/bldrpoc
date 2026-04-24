'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Node, Viewport } from '@/lib/types'
import {
  buildGridStyles,
  gridSectionClassName,
  isPlaceable,
  MOBILE_BREAKPOINT_PX,
} from '@/lib/grid-utils'
import { MENU_SLOTS, partitionMenuChildren } from '@/lib/menu-utils'
import { resolveProp } from '@/lib/prop-utils'
import type { MenuSlot } from '@/lib/types'

const ViewportContext = createContext<Viewport>('desktop')
const useViewport = () => useContext(ViewportContext)

function useDeviceViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>('desktop')
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`)
    const update = () => setVp(mq.matches ? 'mobile' : 'desktop')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return vp
}

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
  const viewport = useViewport()
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '24px'
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#ffffff'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
  const borderRadius = resolveProp<string>(node, 'borderRadius', viewport)
  const boxShadow = resolveProp<string>(node, 'boxShadow', viewport)
  const border = resolveProp<string>(node, 'border', viewport)
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
  const viewport = useViewport()
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

  return (
    <Tag
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign,
        lineHeight,
        fontStyle,
        letterSpacing,
        margin: 0,
        fontFamily: fontFamily || 'system-ui, sans-serif',
        maxWidth: '100%',
        whiteSpace: 'pre-wrap',
      }}
    >
      {content}
    </Tag>
  )
}

function ImageNode({ node }: PreviewNodeProps) {
  const viewport = useViewport()
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

function ButtonNode({ node }: PreviewNodeProps) {
  const viewport = useViewport()
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
        fontFamily: fontFamily || 'system-ui, sans-serif',
        width: '100%',
        height: '100%',
      }}
    >
      {label}
    </button>
  )
}

function FormNode({ node }: PreviewNodeProps) {
  const viewport = useViewport()
  const placeholder = (node.props.placeholder as string | undefined) ?? 'your@email.com'
  const buttonLabel = (node.props.buttonLabel as string | undefined) ?? 'Subscribe'
  const successMessage = (node.props.successMessage as string | undefined) ?? 'Thanks! Check your inbox.'
  const action = node.props.action as string | undefined
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
    fontFamily: fontFamily || 'system-ui, sans-serif',
    fontStyle,
    letterSpacing,
  }

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
          ...typographyStyle,
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
          ...typographyStyle,
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
          ...typographyStyle,
          whiteSpace: 'nowrap',
        }}
      >
        {status === 'submitting' ? '...' : buttonLabel}
      </button>
    </form>
  )
}

function MenuBarNode({ node }: PreviewNodeProps) {
  const viewport = useViewport()
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#09090b'
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '16px 32px'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
  const partitioned = partitionMenuChildren(node)
  return (
    <nav
      style={{
        backgroundColor,
        padding,
        minHeight,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {MENU_SLOTS.map((slot) => (
        <PreviewMenuSlot key={slot} slot={slot} items={partitioned[slot]} />
      ))}
    </nav>
  )
}

function PreviewMenuSlot({ slot, items }: { slot: MenuSlot; items: Node[] }) {
  const justifyContent =
    slot === 'left' ? 'flex-start' : slot === 'right' ? 'flex-end' : 'center'
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        gap: 16,
        whiteSpace: 'nowrap',
      }}
    >
      {items.map((child) => (
        <PreviewNode key={child.id} node={child} insideGrid={false} />
      ))}
    </div>
  )
}

function FooterNode({ node, insideGrid }: PreviewNodeProps) {
  const viewport = useViewport()
  const backgroundColor = resolveProp<string>(node, 'backgroundColor', viewport) ?? '#09090b'
  const padding = resolveProp<string>(node, 'padding', viewport) ?? '40px 24px'
  const minHeight = resolveProp<string>(node, 'minHeight', viewport)
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
  const viewport = useDeviceViewport()
  return (
    <ViewportContext.Provider value={viewport}>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <PreviewNode node={tree} isRoot={true} />
      </div>
    </ViewportContext.Provider>
  )
}
