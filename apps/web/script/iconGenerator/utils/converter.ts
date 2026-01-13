import type { Config } from 'svgo'

/**
 * svgoの設定を取得
 * - xmlns属性を削除
 * - fill属性をcurrentColorに変換（noneは保持）
 * - コメントやメタデータを削除
 */
export const getSvgoConfig = (): Config => ({
  plugins: [
    'removeXMLNS',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'cleanupIds',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    {
      name: 'convertColors',
      params: {
        currentColor: true,
      },
    },
    {
      name: 'removeViewBox',
      active: false,
    },
  ],
})
