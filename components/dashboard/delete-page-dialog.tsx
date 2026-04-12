'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deletePage } from '@/lib/api-client'

interface DeletePageDialogProps {
  pageId: string | null
  pageTitle: string
  open: boolean
  onClose: () => void
  onDeleted: () => void
}

export function DeletePageDialog({
  pageId,
  pageTitle,
  open,
  onClose,
  onDeleted,
}: DeletePageDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!pageId) return
    setLoading(true)
    try {
      await deletePage(pageId)
      onDeleted()
      onClose()
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Delete Page">
      <div className="flex items-start gap-3 mb-6">
        <div className="rounded-lg bg-danger/10 p-2">
          <AlertTriangle className="h-5 w-5 text-danger" />
        </div>
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete{' '}
          <span className="font-medium text-text-primary">{pageTitle}</span>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete} loading={loading}>
          Delete
        </Button>
      </div>
    </Dialog>
  )
}
