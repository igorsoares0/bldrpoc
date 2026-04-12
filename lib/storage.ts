import type { Page } from './types'
import { createDefaultContent } from './default-content'

declare global {
  var __pages: Map<string, Page> | undefined
}

function createPages(): Map<string, Page> {
  const map = new Map<string, Page>()
  const exampleId = 'example-1'
  map.set(exampleId, {
    id: exampleId,
    title: 'My Landing Page',
    slug: 'my-landing-page',
    content: createDefaultContent(),
    published: false,
    createdAt: new Date().toISOString(),
  })
  return map
}

export const pages: Map<string, Page> =
  globalThis.__pages ?? (globalThis.__pages = createPages())
