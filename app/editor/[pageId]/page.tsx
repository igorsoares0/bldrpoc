import { notFound } from 'next/navigation'
import { pages } from '@/lib/storage'
import { EditorShell } from '@/components/editor/editor-shell'

export const dynamic = 'force-dynamic'

export default async function EditorPage(
  props: PageProps<'/editor/[pageId]'>,
) {
  const { pageId } = await props.params
  const page = pages.get(pageId)

  if (!page) notFound()

  return <EditorShell initialPage={page} />
}
