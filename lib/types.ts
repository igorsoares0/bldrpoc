export type NodeType = 'section' | 'text' | 'image' | 'button' | 'menu-bar' | 'footer'

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
