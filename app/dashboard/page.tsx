import { pages } from '@/lib/storage'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import type { Page } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const allPages: Page[] = Array.from(pages.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return <DashboardShell initialPages={allPages} />
}
