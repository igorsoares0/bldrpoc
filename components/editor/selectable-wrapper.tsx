'use client'

import { useEditorStore } from '@/lib/store'
import type { NodeType } from '@/lib/types'

const typeLabels: Record<NodeType, string> = {
  section: 'Section',
  text: 'Text',
  image: 'Image',
  button: 'Button',
  'menu-bar': 'Menu Bar',
  footer: 'Footer',
}

interface SelectableWrapperProps {
  nodeId: string
  nodeType: NodeType
  children: React.ReactNode
}

export function SelectableWrapper({
  nodeId,
  nodeType,
  children,
}: SelectableWrapperProps) {
  const selectedId = useEditorStore((s) => s.selectedId)
  const selectNode = useEditorStore((s) => s.selectNode)
  const isSelected = selectedId === nodeId

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        selectNode(nodeId)
      }}
      className={`relative group/sel cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'ring-2 ring-accent ring-offset-1 ring-offset-white rounded-sm'
          : 'hover:ring-1 hover:ring-accent/40 hover:ring-offset-1 hover:ring-offset-white rounded-sm'
      }`}
    >
      {isSelected && (
        <span className="absolute -top-5 left-0 z-10 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white whitespace-nowrap">
          {typeLabels[nodeType]}
        </span>
      )}
      {children}
    </div>
  )
}
