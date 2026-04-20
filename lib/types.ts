export type NodeType = 'section' | 'text' | 'image' | 'button' | 'form' | 'menu-bar' | 'footer'

export type Viewport = 'desktop' | 'mobile'

export type GridPlacement = {
  col: number
  row: number
  colSpan: number
  rowSpan: number
}

export type GridProps = {
  desktop: GridPlacement
  mobile?: GridPlacement
}

export type Node = {
  id: string
  type: NodeType
  props: Record<string, any>
  children?: Node[]
}

export type Page = {
  id: string
  title: string
  slug: string
  content: Node
  published: boolean
  createdAt: string
}
