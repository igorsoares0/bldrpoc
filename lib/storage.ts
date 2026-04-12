import type { Page } from './types'
import { createDefaultContent } from './default-content'

export const pages = new Map<string, Page>()

const exampleId = 'example-1'
pages.set(exampleId, {
  id: exampleId,
  title: 'My Landing Page',
  slug: 'my-landing-page',
  content: createDefaultContent(),
  published: false,
  createdAt: new Date().toISOString(),
})
