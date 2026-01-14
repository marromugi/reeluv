/**
 * Orval用のカスタムフェッチャー引数の型
 */
interface FetcherConfig {
  url: string
  method: string
  headers?: Record<string, string>
  data?: unknown
}

/**
 * Orval用のカスタムフェッチャー
 *
 * SWRと組み合わせて使用するためのfetch関数
 */
export async function customFetcher<T>(
  config: FetcherConfig,
  options?: RequestInit
): Promise<T> {
  const { url, method, headers, data } = config

  const response = await fetch(url, {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'APIエラーが発生しました')
  }

  return response.json()
}

export default customFetcher
