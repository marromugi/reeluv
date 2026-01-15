import type { ShowReelDetail } from '@/client/api/model'

/** InfoPanel の Props */
export type InfoPanelProps = {
  reel: ShowReelDetail | undefined
}

/** 情報アイテムの Props */
export type InfoItemProps = {
  label: string
  value: string
}
