'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  LayoutTemplate,
  Type,
  ImageIcon,
  RectangleHorizontal,
  PanelTop,
  PanelBottom,
} from 'lucide-react'
import { useEditorStore } from '@/lib/store'
import type { Node, NodeType } from '@/lib/types'

type ElementDef = {
  type: NodeType
  label: string
  icon: React.FC<{ className?: string }>
  category: 'element' | 'section'
  createNode: () => Node
}

function uid() {
  return crypto.randomUUID()
}

const elements: ElementDef[] = [
  // --- Basic elements ---
  {
    type: 'section',
    label: 'Section',
    icon: LayoutTemplate,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'section',
      props: {
        padding: '24px',
        backgroundColor: '#f4f4f5',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      },
      children: [],
    }),
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'text',
      props: {
        content: 'New text block',
        variant: 'p',
        color: '#09090b',
        fontSize: '16px',
        fontWeight: '400',
        textAlign: 'left',
      },
    }),
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'image',
      props: {
        src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
        alt: 'Image',
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
    }),
  },
  {
    type: 'button',
    label: 'Button',
    icon: RectangleHorizontal,
    category: 'element',
    createNode: () => ({
      id: uid(),
      type: 'button',
      props: {
        label: 'Click me',
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '8px',
        paddingX: '24px',
        paddingY: '12px',
        fontSize: '16px',
        fontWeight: '600',
      },
    }),
  },
  // --- Pre-built sections ---
  {
    type: 'menu-bar',
    label: 'Menu Bar',
    icon: PanelTop,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'menu-bar',
      props: {
        backgroundColor: '#09090b',
        padding: '16px 32px',
        gap: '24px',
      },
      children: [
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Brand',
            variant: 'p',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: '700',
            textAlign: 'left',
          },
        },
        {
          id: uid(),
          type: 'section',
          props: {
            padding: '0px',
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '24px',
          },
          children: [
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Home',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'About',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Services',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Contact',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '500',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'button',
              props: {
                label: 'Get Started',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '6px',
                paddingX: '20px',
                paddingY: '8px',
                fontSize: '14px',
                fontWeight: '600',
              },
            },
          ],
        },
      ],
    }),
  },
  {
    type: 'footer',
    label: 'Footer',
    icon: PanelBottom,
    category: 'section',
    createNode: () => ({
      id: uid(),
      type: 'footer',
      props: {
        backgroundColor: '#09090b',
        padding: '40px 24px',
        gap: '16px',
      },
      children: [
        {
          id: uid(),
          type: 'text',
          props: {
            content: 'Brand',
            variant: 'p',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '700',
            textAlign: 'center',
          },
        },
        {
          id: uid(),
          type: 'section',
          props: {
            padding: '0px',
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          },
          children: [
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Privacy Policy',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '400',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Terms of Service',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '400',
                textAlign: 'left',
              },
            },
            {
              id: uid(),
              type: 'text',
              props: {
                content: 'Contact',
                variant: 'p',
                color: '#a1a1aa',
                fontSize: '14px',
                fontWeight: '400',
                textAlign: 'left',
              },
            },
          ],
        },
        {
          id: uid(),
          type: 'text',
          props: {
            content: '© 2026 Brand. All rights reserved.',
            variant: 'p',
            color: '#71717a',
            fontSize: '13px',
            fontWeight: '400',
            textAlign: 'center',
          },
        },
      ],
    }),
  },
]

const containerTypes: NodeType[] = ['section', 'menu-bar', 'footer']

export function ElementPicker() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const addNode = useEditorStore((s) => s.addNode)
  const selectedId = useEditorStore((s) => s.selectedId)
  const tree = useEditorStore((s) => s.tree)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleAdd(element: ElementDef) {
    const newNode = element.createNode()

    let parentId = tree.id
    if (selectedId) {
      const findNode = (node: Node): Node | null => {
        if (node.id === selectedId) return node
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child)
            if (found) return found
          }
        }
        return null
      }
      const selected = findNode(tree)
      if (selected && containerTypes.includes(selected.type)) {
        parentId = selected.id
      }
    }

    addNode(parentId, newNode)
    setOpen(false)
  }

  const basicElements = elements.filter((e) => e.category === 'element')
  const sectionTemplates = elements.filter((e) => e.category === 'section')

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Element
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-surface-3 bg-surface-1 p-1.5 shadow-xl shadow-black/30 z-50">
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Elements
          </p>
          {basicElements.map((el) => (
            <button
              key={el.type}
              onClick={() => handleAdd(el)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
            >
              <el.icon className="h-4 w-4 text-text-muted" />
              {el.label}
            </button>
          ))}
          <div className="my-1.5 border-t border-surface-3" />
          <p className="px-3 pt-1.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Sections
          </p>
          {sectionTemplates.map((el) => (
            <button
              key={el.type}
              onClick={() => handleAdd(el)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
            >
              <el.icon className="h-4 w-4 text-text-muted" />
              {el.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
