'use client'

import { useState, useEffect } from 'react'
import { FileText, LayoutDashboard } from 'lucide-react'
import { PageCard } from './page-card'
import { CreatePageButton } from './create-page-button'
import { DeletePageDialog } from './delete-page-dialog'
import { getPages } from '@/lib/api-client'
import type { Page } from '@/lib/types'

interface DashboardShellProps {
  initialPages: Page[]
}

export function DashboardShell({ initialPages }: DashboardShellProps) {
  const [pages, setPages] = useState<Page[]>(initialPages)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)

  async function refreshPages() {
    const updated = await getPages()
    setPages(updated)
  }

  function handleDelete(id: string) {
    const page = pages.find((p) => p.id === id)
    if (page) setDeleteTarget({ id: page.id, title: page.title })
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <header className="border-b border-surface-3 bg-surface-1/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-text-primary">PageCraft</h1>
          </div>
          <CreatePageButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="mb-4 rounded-2xl bg-surface-1 p-6">
              <FileText className="h-12 w-12 text-text-muted" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-text-primary">
              No pages yet
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              Create your first landing page to get started
            </p>
            <CreatePageButton />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-sm font-medium text-text-secondary">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <DeletePageDialog
        pageId={deleteTarget?.id ?? null}
        pageTitle={deleteTarget?.title ?? ''}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={refreshPages}
      />
    </div>
  )
}
