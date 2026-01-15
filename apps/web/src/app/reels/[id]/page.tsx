import { ReelEditPage } from '@/components/page/ReelEdit'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ReelDetailPage({ params }: Props) {
  const { id } = await params
  return <ReelEditPage reelId={id} />
}
