'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createPage } from '@/lib/api-client'

export function CreatePageButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    try {
      const page = await createPage({ title: 'Untitled Page' })
      router.push(`/editor/${page.id}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCreate} loading={loading}>
      <Plus className="h-4 w-4" />
      New Page
    </Button>
  )
}
