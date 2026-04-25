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

export type MenuSlot = 'left' | 'center' | 'right'

export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea'

export type FormField = {
  id: string
  type: FormFieldType
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  rows?: number
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
