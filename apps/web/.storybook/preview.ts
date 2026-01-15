import type { Preview } from '@storybook/nextjs-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import React from 'react'

import '../src/app/globals.css'

// MSW を初期化
initialize()

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        light: { name: 'light', value: '#FFFFFF' },
        dark: { name: 'dark', value: '#1A1A1C' },
      },
      default: 'light',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
      config: {
        rules: [{ id: 'color-contrast', enabled: false }], // デザイン起因で無効化
      },
    },
  },
  decorators: [
    (Story, context) => {
      const selectedBackground = context.globals.backgrounds?.value
      const isDark = selectedBackground === 'dark'

      // Portal でレンダリングされるコンポーネント（Modal等）のために html 要素にも dark クラスを適用
      React.useEffect(() => {
        if (isDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return () => {
          document.documentElement.classList.remove('dark')
        }
      }, [isDark])

      return React.createElement(
        'div',
        { className: isDark ? 'dark' : '' },
        React.createElement(Story)
      )
    },
  ],
  loaders: [mswLoader],
}

export default preview
