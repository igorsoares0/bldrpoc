import type { Page } from './types'

export async function getPages(): Promise<Page[]> {
  const res = await fetch('/api/pages')
  if (!res.ok) throw new Error('Failed to fetch pages')
  return res.json()
}

export async function getPage(id: string): Promise<Page> {
  const res = await fetch(`/api/pages/${id}`)
  if (!res.ok) throw new Error('Failed to fetch page')
  return res.json()
}

export async function createPage(
  data: Partial<Pick<Page, 'title' | 'slug'>> & { template?: string },
): Promise<Page> {
  const res = await fetch('/api/pages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create page')
  return res.json()
}

export async function updatePage(
  id: string,
  data: Partial<Page>,
): Promise<Page> {
  const res = await fetch(`/api/pages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update page')
  return res.json()
}

export async function deletePage(id: string): Promise<void> {
  const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete page')
}
