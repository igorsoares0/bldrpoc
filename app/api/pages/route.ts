import { pages } from '@/lib/storage'
import { createDefaultContent } from '@/lib/default-content'
import type { Page } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const allPages = Array.from(pages.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  return Response.json(allPages)
}

export async function POST(request: Request) {
  const body = await request.json()
  const id = crypto.randomUUID()
  const page: Page = {
    id,
    title: body.title || 'Untitled Page',
    slug: body.slug || `page-${id.slice(0, 8)}`,
    content: body.content || createDefaultContent(),
    published: false,
    createdAt: new Date().toISOString(),
  }
  pages.set(id, page)
  return Response.json(page, { status: 201 })
}
