import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: 'http://localhost:3000/api/doc',
    },
    output: {
      mode: 'tags-split',
      target: 'src/client/api',
      schemas: 'src/client/api/model',
      client: 'swr',
      mock: true,
      override: {
        mutator: {
          path: 'src/client/api/fetcher.ts',
          name: 'customFetcher',
        },
      },
    },
  },
})
