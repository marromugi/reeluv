---
name: component-file-cleaner
description: 'You MUST use this skill when adding or modifying shared ui component'
---

# Component Structure Cleaner

単一コンポーネントのディレクトリ構造を整理・最適化します。

## 標準ディレクトリ構造

```
{ComponentName}/
├── {ComponentName}.tsx           # メインコンポーネント
├── index.ts                      # エクスポート
├── type.ts                       # 型定義
├── const.ts                      # variants / 定数
├── {ComponentName}.stories.tsx   # Storybook
├── util.ts                       # ユーティリティ（必要時）
├── util.test.ts                  # ユーティリティのテスト（必要時）
├── {ComponentName}Context.tsx    # Context（複合コンポーネント時）
├── hooks/                        # カスタムフック（必要時）
│   └── use{Hook}/
│       ├── use{Hook}.ts
│       ├── index.ts
│       └── __test__/
│           └── use{Hook}.test.ts
└── {SubComponent}/               # サブコンポーネント（必要時）
    ├── {SubComponent}.tsx
    ├── index.ts
    ├── type.ts
    ├── const.ts
    └── ...
```

## ファイル配置ルール

| ファイル                      | 必須 | 説明                     |
| ----------------------------- | ---- | ------------------------ |
| `{ComponentName}.tsx`         | ○    | メインコンポーネント     |
| `index.ts`                    | ○    | 公開APIのエクスポート    |
| `type.ts`                     | ○    | Props等の型定義          |
| `const.ts`                    | △    | variants、定数がある場合 |
| `{ComponentName}.stories.tsx` | ○    | Storybook                |
| `util.ts`                     | △    | 複雑なロジックがある場合 |
| `{ComponentName}Context.tsx`  | △    | 複合コンポーネントの場合 |

## 整理の指針

1. **単一責任**: 1ファイル1責務
2. **コロケーション**: 関連ファイルは同じディレクトリに配置
3. **明示的なエクスポート**: `index.ts` で公開APIを明示
4. **テストの近接配置**: テスト対象と同じ場所に配置

## 行動指針

- 不明点や曖昧な点がある場合は、`AskUserQuestionTool` を使用してユーザーに確認すること
