import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 開発環境での複数レンダリングを防ぐために一時的に無効化
  // 本番環境には影響なし
  reactStrictMode: false,
}

export default nextConfig
