import { notFound } from 'next/navigation'
import { pages } from '@/lib/storage'
import { PreviewRenderer } from '@/components/preview/preview-renderer'
import { migrateFreeLayoutToGrid } from '@/lib/grid-utils'

export const dynamic = 'force-dynamic'

export default async function PreviewPage(
  props: PageProps<'/preview/[pageId]'>,
) {
  const { pageId } = await props.params
  const page = pages.get(pageId)

  if (!page) notFound()

  const { tree } = migrateFreeLayoutToGrid(page.content)

  return (
    <div className="bg-white text-black min-h-screen">
      <PreviewRenderer tree={tree} />
    </div>
  )
}
