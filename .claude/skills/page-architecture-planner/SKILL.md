---
name: page-architecture-planner
description: 'Next.jsのページコンポーネント設計を支援するスキル。新規ページ作成や既存ページの修正時に使用してください。'
---

# Page Architecture Planner

Next.js App Routerのページコンポーネント設計・実装を支援します。

## ディレクトリ構成

```
apps/web/src/
├── app/{route}/
│   ├── page.tsx                    # src/components/page からエクスポートするだけ
│   ├── layout.tsx                  # src/components/layout からエクスポートするだけ
│   ├── loading.tsx                 # Suspense用ローディングUI
│   └── error.tsx                   # エラーUI（必要時）
│
├── components/page/{PageName}/     # ページ固有のコンポーネント
│   ├── {PageName}.tsx              # ページルートコンポーネント（Server Component）
│   ├── index.ts                    # エクスポート
│   ├── type.ts                     # 型定義
│   ├── {Section}/                  # セクションコンポーネント（ネスト構造）
│   │   ├── {Section}.tsx
│   │   ├── index.ts
│   │   ├── type.ts
│   │   ├── {SubComponent}/         # サブコンポーネント（さらにネスト）
│   │   │   ├── {SubComponent}.tsx
│   │   │   ├── index.ts
│   │   │   └── type.ts
│   │   └── hooks/
│   │       └── use{Hook}/
│   │           ├── use{Hook}.ts
│   │           └── index.ts
│   ├── hooks/                      # ページ固有のフック
│   │   └── use{Hook}/
│   │       ├── use{Hook}.ts
│   │       ├── index.ts
│   │       └── __test__/
│   │           └── use{Hook}.test.ts
│   └── utils/                      # ページ固有のユーティリティ
│       ├── {util}.ts
│       └── {util}.test.ts
│
├── components/layout/{LayoutName}/ # レイアウトコンポーネント
│   ├── {LayoutName}.tsx            # レイアウトコンポーネント（Server Component）
│   ├── index.ts                    # エクスポート
│   ├── type.ts                     # 型定義
│   ├── {Section}/                  # レイアウト内のセクション（Header, Sidebar等）
│   │   ├── {Section}.tsx
│   │   ├── index.ts
│   │   └── type.ts
│   └── hooks/
│       └── use{Hook}/
│           ├── use{Hook}.ts
│           └── index.ts
│
└── components/feature/{FeatureName}/  # 複数ページで共有するコンポーネント
    ├── {FeatureName}.tsx
    ├── index.ts
    ├── type.ts
    ├── {SubComponent}/
    │   ├── {SubComponent}.tsx
    │   ├── index.ts
    │   └── type.ts
    └── hooks/
        └── use{Hook}/
            ├── use{Hook}.ts
            └── index.ts
```

### 配置基準

| 使用範囲         | 配置場所                        | 例                             |
| ---------------- | ------------------------------- | ------------------------------ |
| 単一ページ       | `components/page/{PageName}/`   | `ReelListSection`, `ReelCard`  |
| 複数ページで共有 | `components/feature/{Feature}/` | `VideoPlayer`, `ClipSelector`  |
| レイアウト       | `components/layout/{Layout}/`   | `DashboardLayout`              |
| アプリ全体（UI） | `components/ui/{Component}/`    | `Button`, `Modal`, `TextField` |

## 設計原則

### 1. Server Component と Client Component の使い分け

- **Server Component**: 静的なレイアウト、機密情報アクセス、大きな依存関係
- **Client Component**: データフェッチ（SWR）、`useState`/`useEffect`、ブラウザAPI、イベントハンドラ

```tsx
// src/components/page/ReelList/ReelList.tsx
import { CreateReelModalButton } from './CreateReelModalButton'
import { ReelListSection } from './ReelListSection'

import { Typography } from '@/components/ui/Typography'

export const ReelListPage = () => (
  <div>
    <Typography as="h1" size="xl" weight="semibold">
      ショーリール
    </Typography>
    <CreateReelModalButton />
    <ReelListSection />
  </div>
)
```

### 2. データフェッチ: SWR + isLoading

orval 生成の SWR フックを使用し、`isLoading` でスケルトンを表示する。

```tsx
// ReelListSection.tsx（Client Component）
'use client'

import { ReelCard } from './ReelCard'
import { ReelListSkeleton } from './ReelListSkeleton'

import { useGetApiReels } from '@/client/api/reel/reel'

export const ReelListSection = () => {
  const { data, isLoading } = useGetApiReels()

  if (isLoading) {
    return <ReelListSkeleton />
  }

  const showReels = data?.data?.showReels ?? []

  return (
    <div>
      {showReels.map((reel, index) => (
        <ReelCard key={reel.id} reel={reel} index={index} />
      ))}
    </div>
  )
}
```

> ✅ Suspense は使用しない。SWR の `isLoading` で直接スケルトンを表示する。

### 3. 単一責務・ファイル行数

- 1コンポーネント = 1責務
- **目安: 200行以内**（超える場合は分割）

### 4. useEffect の適切な使用

**使う**: 外部システム同期（イベントリスナー等）、クリーンアップが必要な副作用
**使わない**: データ取得（→ SWR）、データ変換（→ `useMemo`）

### 5. メモ化

**必要**: 子に渡すコールバック、計算コストの高い処理、参照が変わると再レンダリングを起こすオブジェクト
**不要**: プリミティブ値、単純な計算、レンダリング頻度が低いコンポーネント

### 6. orval 生成コードの使い分け

```tsx
// GET: SWR フックを使用
import { useGetApiReels } from '@/client/api/reel/reel'
const { data, isLoading, mutate } = useGetApiReels()

// POST/PATCH/DELETE: mutation フックを使用
import { usePostApiReels } from '@/client/api/reel/reel'
const { trigger, isMutating } = usePostApiReels()
await trigger({ name: '新規', videoDefinition: 'HD', videoStandard: 'NTSC' })
```

### 7. 命名規則

| 対象         | 規則                 | 例                |
| ------------ | -------------------- | ----------------- |
| ページ       | PascalCase + Page    | `ReelDetailPage`  |
| レイアウト   | PascalCase + Layout  | `DashboardLayout` |
| セクション   | PascalCase + Section | `ReelListSection` |
| フック       | use + camelCase      | `useReelList`     |
| 定数         | SCREAMING_SNAKE_CASE | `MAX_CLIP_COUNT`  |
| ディレクトリ | PascalCase           | `ReelListSection` |

## 実装後チェックリスト

1. `pnpm tsc --noEmit`
2. `pnpm lint`
3. `web-quality-guardian` エージェント実行
4. `web-code-cleaner` エージェント実行

## 行動指針

- 不明点は `AskUserQuestionTool` でユーザーに確認
- 新しい共通のUIコンポーネントが必要な場合は `ui-component-architecture-planner` スキルを使用
