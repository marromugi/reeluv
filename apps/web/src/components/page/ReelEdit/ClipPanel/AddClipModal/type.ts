import type { ShowReelDetail } from '@/client/api/model'

/** AddClipModal の Props */
export type AddClipModalProps = {
  isOpen: boolean
  onClose: () => void
  reel: ShowReelDetail | undefined
  onMutate: () => void
}
