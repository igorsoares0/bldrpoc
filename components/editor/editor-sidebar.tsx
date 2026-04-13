'use client'

import { MousePointer, Trash2 } from 'lucide-react'
import { useEditorStore } from '@/lib/store'
import { getNodeById } from '@/lib/tree-utils'
import { Button } from '@/components/ui/button'
import { TextProps } from './property-panels/text-props'
import { ImageProps } from './property-panels/image-props'
import { ButtonProps } from './property-panels/button-props'
import { SectionProps } from './property-panels/section-props'
import { MenuBarProps } from './property-panels/menu-bar-props'
import { FooterProps } from './property-panels/footer-props'
import type { Node, NodeType } from '@/lib/types'

const typeLabels: Record<NodeType, string> = {
  section: 'Section',
  text: 'Text',
  image: 'Image',
  button: 'Button',
  'menu-bar': 'Menu Bar',
  footer: 'Footer',
}

const propPanels: Record<NodeType, React.FC<{ node: Node }>> = {
  section: SectionProps,
  text: TextProps,
  image: ImageProps,
  button: ButtonProps,
  'menu-bar': MenuBarProps,
  footer: FooterProps,
}

export function EditorSidebar() {
  const selectedId = useEditorStore((s) => s.selectedId)
  const tree = useEditorStore((s) => s.tree)
  const deleteNode = useEditorStore((s) => s.deleteNode)

  const selectedNode = selectedId ? getNodeById(tree, selectedId) : null

  if (!selectedNode) {
    return (
      <div className="w-[280px] shrink-0 border-l border-surface-3 bg-surface-1 flex flex-col items-center justify-center p-6">
        <div className="rounded-xl bg-surface-2 p-4 mb-3">
          <MousePointer className="h-6 w-6 text-text-muted" />
        </div>
        <p className="text-sm text-text-muted text-center">
          Click an element on the canvas to edit its properties
        </p>
      </div>
    )
  }

  const PropsPanel = propPanels[selectedNode.type]
  const isRoot = selectedNode.id === tree.id

  return (
    <div className="w-[280px] shrink-0 border-l border-surface-3 bg-surface-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-surface-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
            {typeLabels[selectedNode.type]}
          </span>
        </div>
        {!isRoot && (
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="rounded-lg p-1.5 text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
            title="Delete element"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {PropsPanel && <PropsPanel node={selectedNode} />}
      </div>
    </div>
  )
}
