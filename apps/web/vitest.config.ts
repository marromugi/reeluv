import path from 'path'
import { fileURLToPath } from 'url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: './vitest.setup.ts',
    environment: 'happy-dom',
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.stories.{ts,tsx}', // storyファイルを除外
        'src/**/*.browser.{test,spec}.{ts,tsx}', // テストファイルを除外
        'src/**/{index,type,const}.{ts,tsx}', // bullet-fil, type definition, and constant
        'src/{types,test}/*.{ts,tsx}', // 型定義とテスト関連を除外
      ],
    },
    projects: [
      {
        // base
        extends: true,
        test: {
          name: 'base',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          exclude: ['src/**/*.vrt.{test,spec}.{ts,tsx}', 'src/api/**/*.{test,spec}.{ts,tsx}'],
          environment: 'happy-dom',
        },
      },
      {
        // api test
        extends: true,
        test: {
          name: 'api',
          globals: true,
          include: ['src/api/**/*.{test,spec}.{ts,tsx}'],
          environment: 'happy-dom',
          setupFiles: ['./vitest.setup.api.ts'],
        },
      },
      {
        // vrt test
        extends: true,
        test: {
          name: 'vrt',
          include: ['src/**/*.vrt.{test,spec}.{ts,tsx}'],
          setupFiles: ['./vitest.setup.browser.ts'],
          isolate: true, // 各テストファイルを独立したコンテキストで実行
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
            viewport: {
              width: 1920,
              height: 1080,
            },
            commands: {},
            expect: {
              toMatchScreenshot: {
                comparatorName: 'pixelmatch',
                comparatorOptions: {
                  allowedMismatchedPixels: 16, // 16pxの誤差まで許容
                },
                screenshotOptions: {
                  fullPage: false,
                  clip: {
                    x: 0,
                    y: 0,
                    width: 1920,
                    height: 1080,
                  },
                },
              },
            },
            screenshotFailures: false, // エラー時にスクリーンショットを撮らない
          },
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            // The location of your Storybook config, main.js|ts
            configDir: path.join(dirname, '.storybook'),
            // This should match your package.json script to run Storybook
            // The --no-open flag will skip the automatic opening of a browser
            storybookScript: 'pnpm storybook --no-open',
          }),
        ],
        test: {
          name: 'storybook',
          // Enable browser mode
          browser: {
            enabled: true,
            // Make sure to install Playwright
            provider: playwright({}),
            headless: true,
            instances: [{ browser: 'chromium' }],
            screenshotFailures: false, // エラー時にスクリーンショットを撮らない
          },
          setupFiles: ['./.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
})
