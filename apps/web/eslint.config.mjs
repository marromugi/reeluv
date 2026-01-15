// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import storybook from 'eslint-plugin-storybook'

import rootConfig from '../../eslint.config.js'

const config = [
  ...rootConfig,
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/client/api/**', // orval自動生成ファイル
  ]),
  ...storybook.configs['flat/recommended'],
]

export default config
