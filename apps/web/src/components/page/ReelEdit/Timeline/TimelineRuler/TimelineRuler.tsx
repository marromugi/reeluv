import { INTERVAL_SECONDS, MAX_SECONDS, timelineRulerVariants } from './const'

const styles = timelineRulerVariants()

/**
 * タイムライン上部の時間目盛り
 */
export const TimelineRuler = () => {
  const marks = []
  for (let i = 0; i <= MAX_SECONDS; i += INTERVAL_SECONDS) {
    marks.push(i)
  }

  return <div className={styles.container()}></div>
}
