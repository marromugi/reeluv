import AxeBuilder from '@axe-core/playwright'
import type { BrowserCommand } from 'vitest/node'

export const a11yTestResultCommand: BrowserCommand<[]> = async (ctx) => {
  if (ctx.provider.name === 'playwright') {
    const results = await new AxeBuilder({ page: ctx.page })
      .exclude([
        'iframe[data-vitest="true"]', // Vitest iframe を除外
        '[name="vitest-iframe"]',
        '[class*="sb-"]', // Storybook クラスを除外
        '[class="storybook-docs"]',
        '[id="storybook-highlights-root"]',
      ]) // コンテナを除く
      .disableRules([
        'frame-title', // テスト環境のiframeはタイトルを持たないため除外
      ])
      .withTags([
        'wcag2a', // WCAG2.0 A
        'wcag2aa', // WCAG2.0 AA
        'wcag21a', // WCAG2.1 A
        'wcag21aa', // WCAG2.1 AA
        'wcag22a', // WCAG2.2 A
        'wcag22aa', // WCAG2.2 AA
      ])
      .analyze()
    return results
  }

  throw new Error('Use Playwright for browser provider to use a11yTestResultCommand')
}
