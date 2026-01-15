/**
 * 秒数を表示用フォーマットに変換
 */
export const formatTime = (seconds: number): string => {
  if (seconds === 0) return '0s'
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (remainingSeconds === 0) return `${minutes}m`
  return `${minutes}m${remainingSeconds}s`
}

/**
 * ISO日付文字列から「X日前」形式の相対時間を返す
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今日'
  if (diffDays === 1) return '1日前'
  if (diffDays < 7) return `${diffDays}日前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`
  return `${Math.floor(diffDays / 365)}年前`
}
