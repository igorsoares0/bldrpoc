'use client'

import { useEditorStore } from './store'
import type { Node, Viewport } from './types'

export function resolveProp<T = any>(
  node: Node,
  key: string,
  viewport: Viewport,
): T | undefined {
  if (viewport === 'mobile') {
    const overrides = node.props.mobile as Record<string, any> | undefined
    if (overrides && key in overrides) return overrides[key] as T
  }
  return node.props[key] as T | undefined
}

export function hasMobileOverride(node: Node, key: string): boolean {
  const overrides = node.props.mobile as Record<string, any> | undefined
  return Boolean(overrides && key in overrides)
}

export function buildResponsiveUpdate(
  node: Node,
  key: string,
  value: unknown,
  viewport: Viewport,
): Record<string, any> {
  if (viewport === 'desktop') return { [key]: value }
  const existing = (node.props.mobile as Record<string, any> | undefined) ?? {}
  return { mobile: { ...existing, [key]: value } }
}

export function clearMobileOverrideUpdate(
  node: Node,
  key: string,
): Record<string, any> {
  const existing = (node.props.mobile as Record<string, any> | undefined) ?? {}
  const next = { ...existing }
  delete next[key]
  return { mobile: Object.keys(next).length > 0 ? next : undefined }
}

export function useResponsiveProp<T = any>(
  node: Node,
  key: string,
  defaultValue?: T,
): {
  value: T | undefined
  setValue: (v: T) => void
  isOverride: boolean
  reset: () => void
  viewport: Viewport
} {
  const viewport = useEditorStore((s) => s.viewport)
  const updateNode = useEditorStore((s) => s.updateNode)
  const resolved = resolveProp<T>(node, key, viewport)
  const value = resolved !== undefined ? resolved : defaultValue
  const isOverride = viewport === 'mobile' && hasMobileOverride(node, key)
  const setValue = (v: T) => {
    updateNode(node.id, buildResponsiveUpdate(node, key, v, viewport))
  }
  const reset = () => {
    updateNode(node.id, clearMobileOverrideUpdate(node, key))
  }
  return { value, setValue, isOverride, reset, viewport }
}
