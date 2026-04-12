'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Plus,
  LayoutTemplate,
  Type,
  ImageIcon,
  RectangleHorizontal,
} from 'lucide-react'
import { useEditorStore } from '@/lib/store'
import type { Node, NodeType } from '@/lib/types'

const elements: {
  type: NodeType
  label: string
  icon: React.FC<{ className?: string }>
  defaultProps: Record<string, any>
}[] = [
  {
    type: 'section',
    label: 'Section',
    icon: LayoutTemplate,
    defaultProps: {
      padding: '24px',
      backgroundColor: '#f4f4f5',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: Type,
    defaultProps: {
      content: 'New text block',
      variant: 'p',
      color: '#09090b',
      fontSize: '16px',
      fontWeight: '400',
      textAlign: 'left',
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: ImageIcon,
    defaultProps: {
      src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
      alt: 'Image',
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: RectangleHorizontal,
    defaultProps: {
      label: 'Click me',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderRadius: '8px',
      paddingX: '24px',
      paddingY: '12px',
      fontSize: '16px',
      fontWeight: '600',
    },
  },
]

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

  function handleAdd(element: (typeof elements)[0]) {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: element.type,
      props: { ...element.defaultProps },
      ...(element.type === 'section' ? { children: [] } : {}),
    }

    // Find the best parent: if a section is selected use it, otherwise use root
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
      if (selected?.type === 'section') {
        parentId = selected.id
      }
    }

    addNode(parentId, newNode)
    setOpen(false)
  }

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
        <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-surface-3 bg-surface-1 p-1.5 shadow-xl shadow-black/30 z-50">
          {elements.map((el) => (
            <button
              key={el.type}
              onClick={() => handleAdd(el)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
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
