'use client'

import { Pencil, Eye, Trash2, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import type { Page } from '@/lib/types'

interface PageCardProps {
  page: Page
  onDelete: (id: string) => void
}

export function PageCard({ page, onDelete }: PageCardProps) {
  const router = useRouter()

  return (
    <div className="group relative flex flex-col rounded-xl border border-surface-3 bg-surface-1 p-5 transition-all duration-200 hover:border-surface-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-text-primary">
            {page.title}
          </h3>
          <p className="mt-1 truncate text-sm text-text-muted">
            /{page.slug}
          </p>
        </div>
        <Badge variant={page.published ? 'success' : 'default'}>
          {page.published ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <p className="text-xs text-text-muted">
        {new Date(page.createdAt).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}
      </p>

      <div className="mt-4 flex items-center gap-1 border-t border-surface-3 pt-4">
        <button
          onClick={() => router.push(`/editor/${page.id}`)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => window.open(`/preview/${page.id}`, '_blank')}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </button>
        <button
          onClick={() => onDelete(page.id)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger ml-auto cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
