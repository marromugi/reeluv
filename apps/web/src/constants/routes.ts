/**
 * アプリケーションのルート定義
 */
export const ROUTES = {
  /** ホームページ */
  HOME: '/',
  /** リール一覧ページ */
  REELS: '/reels',
  /** リール編集ページ */
  REEL_EDIT: (id: string) => `/reels/${id}`,
} as const
