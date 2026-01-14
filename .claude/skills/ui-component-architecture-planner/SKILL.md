---
name: ui-component-architecture-planner
description: 'You MUST use this skill when adding or modifying shared ui component'
---

# UI Component Architecture Planner

UIコンポーネントの設計・実装を支援します。

## ファイル構成

```
apps/web/src/components/ui/{ComponentName}/
├── {ComponentName}.tsx        # メインコンポーネント + variants
├── {SubComponent}
    ├── {SubComponent}.tsx # サブコンポーネント（必要時）
    ├── type.ts                    # 型定義
    ├── index.ts                   # エクスポート
    ├── const.ts    # variants
    ├── util.ts # ユーティリティ
    ├── util.test.ts   # ユニットテスト
    ├── hooks  # Hooks
    ├── use{Hook}
      ├── use{Hook}.ts
      ├── index.ts
      ├── __test__
        ├── use{Hook}.test.ts
├── const.ts    # variants
├── {ComponentName}Context.tsx # コンテキスト（複合コンポーネント時）
├── type.ts                    # 型定義
├── index.ts                   # エクスポート
├── {ComponentName}.stories.tsx    # Storybook + Interaction Test + アクセシビリティテスト
├── util.ts   # ユーティリティ
├── util.test.ts   # ユニットテスト
├── hooks  # Hooks
    ├── use{Hook}
      ├── use{Hook}.ts
      ├── index.ts
      ├── __test__
        ├── use{Hook}.test.ts
```

## 技術スタック

- **スタイリング**: `tailwind-variants` (`tv()`, `slots`), `clsx`, `tailwind-merge`
- **アニメーション**: `motion/react`
- **Storybook**: `@storybook/nextjs-vite`, `storybook/test`
- **テスト**: `vitest`, `vitest-browser-react`, `composeStories`

## アニメーション

`motion/react` を使用してアニメーションを実装：

```tsx
import { motion } from 'motion/react'
;<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: isActive ? 1 : 0 }}
  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
/>
```

## Interaction Test

機能的なコンポーネントには Storybook の `play` 関数で Interaction Test を実装：

```tsx
import { expect, fn, userEvent, within } from 'storybook/test'

export const InteractionTest: Story = {
  args: { onChange: fn() },
  render: (args) => <Component {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByLabelText('ラベル'))
    await expect(args.onChange).toHaveBeenCalled()
  },
}
```

## 実装後チェックリスト

1. `pnpm tsc --noEmit` - TypeScriptエラー確認
2. `pnpm storybook` - Storybook動作確認
3. `web-quality-guardian` エージェント実行
4. `web-code-cleaner` エージェント実行

## 行動指針

- 不明点や曖昧な点がある場合は、`AskUserQuestionTool` を使用してユーザーに確認すること
