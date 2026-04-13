'use client'

import { useState } from 'react'
import { Plus, FileText, LayoutTemplate } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { createPage } from '@/lib/api-client'

const templates = [
  {
    id: 'blank',
    label: 'Blank Page',
    description: 'Start from scratch with an empty canvas',
    icon: FileText,
  },
  {
    id: 'landing-page',
    label: 'Landing Page',
    description: 'Menu bar, hero section, and footer included',
    icon: LayoutTemplate,
  },
]

export function CreatePageButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCreate(templateId: string) {
    setLoading(templateId)
    try {
      const page = await createPage({
        title: 'Untitled Page',
        template: templateId === 'blank' ? 'blank' : undefined,
      })
      router.push(`/editor/${page.id}`)
    } catch {
      setLoading(null)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New Page
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Create New Page">
        <p className="text-sm text-text-muted mb-4">
          Choose how you want to start
        </p>
        <div className="grid grid-cols-2 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleCreate(t.id)}
              disabled={loading !== null}
              className="flex flex-col items-center gap-3 rounded-xl border border-surface-3 bg-surface-2 p-5 text-center transition-all hover:border-accent hover:bg-surface-2/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="rounded-lg bg-surface-3 p-3">
                <t.icon
                  className={`h-6 w-6 ${
                    loading === t.id ? 'animate-pulse text-accent' : 'text-text-muted'
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {t.label}
                </p>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Dialog>
    </>
  )
}
