'use client'

import * as motion from 'motion/react-client'

/**
 * リール一覧のスケルトンローディング
 */
export const ReelListSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          className="w-[320px] flex animate-pulse flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="h-5 w-32 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-4 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
