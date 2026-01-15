import { infoPanelVariants } from './const'
import type { InfoItemProps, InfoPanelProps } from './type'

import { Typography } from '@/components/ui/Typography'

const styles = infoPanelVariants()

/**
 * 情報パネル（右サイドバー）
 * リールの詳細情報を表示
 */
export const InfoPanel = ({ reel }: InfoPanelProps) => {
  return (
    <div className={styles.container()}>
      <Typography as="h2" size="md" weight="semibold" className="mb-4">
        リール情報
      </Typography>

      <div className="flex flex-col gap-4">
        {/* リール名 */}
        <InfoItem label="リール名" value={reel?.name ?? '-'} />

        {/* Standard */}
        <InfoItem label="Standard" value={reel?.videoStandard ?? '-'} />

        {/* Definition */}
        <InfoItem label="Definition" value={reel?.videoDefinition ?? '-'} />

        {/* 合計再生時間 */}
        <InfoItem label="リールの所要時間" value={reel?.totalDuration ?? '00:00:00:00'} />
      </div>
    </div>
  )
}

/** 情報アイテム */
const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className={styles.itemContainer()}>
    <Typography as="span" size="sm" variant="description">
      {label}
    </Typography>
    <Typography as="span" size="md">
      {value}
    </Typography>
  </div>
)
