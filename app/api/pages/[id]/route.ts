import { pages } from '@/lib/storage'
import type { Page } from '@/lib/types'

export async function GET(
  _request: Request,
  ctx: RouteContext<'/api/pages/[id]'>,
) {
  const { id } = await ctx.params
  const page = pages.get(id)
  if (!page) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(page)
}

export async function PUT(
  request: Request,
  ctx: RouteContext<'/api/pages/[id]'>,
) {
  const { id } = await ctx.params
  const existing = pages.get(id)
  if (!existing)
    return Response.json({ error: 'Not found' }, { status: 404 })
  const body = await request.json()
  const updated: Page = { ...existing, ...body, id }
  pages.set(id, updated)
  return Response.json(updated)
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/pages/[id]'>,
) {
  const { id } = await ctx.params
  if (!pages.has(id))
    return Response.json({ error: 'Not found' }, { status: 404 })
  pages.delete(id)
  return new Response(null, { status: 204 })
}
