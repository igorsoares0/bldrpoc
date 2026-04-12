import { notFound } from 'next/navigation'
import { pages } from '@/lib/storage'
import { PreviewRenderer } from '@/components/preview/preview-renderer'

export const dynamic = 'force-dynamic'

export default async function PreviewPage(
  props: PageProps<'/preview/[pageId]'>,
) {
  const { pageId } = await props.params
  const page = pages.get(pageId)

  if (!page) notFound()

  return <PreviewRenderer tree={page.content} />
}
