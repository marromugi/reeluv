import { reelEditSkeletonVariants } from './const'

const styles = reelEditSkeletonVariants()

/**
 * ReelEditPage のスケルトンローディング
 */
export const ReelEditSkeleton = () => {
  return (
    <div className={styles.container()}>
      {/* ヘッダー */}
      <div className={styles.header()}>
        <div className="h-6 w-64 animate-pulse rounded-lg mx-auto bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* メインエリア */}
      <div className={styles.mainArea()}>
        {/* 左パネル */}
        <div className={styles.leftPanel()}></div>

        {/* 中央エリア */}
        <div className={styles.centerArea()}>
          <div className="w-4/5 h-4/5 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* 右パネル */}
        <div className={styles.rightPanel()}></div>
      </div>

      {/* タイムライン */}
      <div className={styles.bottomArea()}></div>
    </div>
  )
}
