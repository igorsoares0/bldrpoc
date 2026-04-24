'use client'

import {
  ResponsiveColorField,
  ResponsiveTextField,
} from './responsive-fields'
import type { Node } from '@/lib/types'

export function FooterProps({ node }: { node: Node }) {
  return (
    <div className="flex flex-col gap-4">
      <ResponsiveColorField
        node={node}
        propKey="backgroundColor"
        label="Background Color"
        fallback="#09090b"
      />

      <ResponsiveTextField
        node={node}
        propKey="padding"
        label="Padding"
        defaultValue="40px 24px"
      />

      <ResponsiveTextField
        node={node}
        propKey="gap"
        label="Gap"
        defaultValue="16px"
      />
    </div>
  )
}
