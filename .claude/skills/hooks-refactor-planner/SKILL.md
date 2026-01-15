---
name: hooks-refactor-planner
description: 'カスタムフックへのリファクタリング判断を支援するスキル。ロジックをフックに切り出すべきかどうか、また配置場所の決定に使用してください。'
---

# Hooks Refactor Planner

コンポーネントからロジックをカスタムフックに切り出すタイミングと配置場所を判断するためのガイドラインです。

## フックへのリファクタリング判断基準

### リファクタリングすべきケース

以下のいずれかに該当する場合、カスタムフックへの切り出しを検討してください。

| 判断基準           | 説明                                                       | 例                                     |
| ------------------ | ---------------------------------------------------------- | -------------------------------------- |
| **再利用性**       | 同じロジックが2箇所以上で使用されている                    | フォームバリデーション、データフェッチ |
| **複雑性**         | 3つ以上の `useState` や複数の `useEffect` が絡み合っている | 複雑なフォーム状態管理                 |
| **テスタビリティ** | ロジック単体でテストしたい                                 | ビジネスロジック、計算処理             |
| **関心の分離**     | UIとロジックを明確に分離したい                             | データ取得とレンダリング               |
| **行数の増加**     | コンポーネントが200行を超えている                          | 大規模なコンポーネント                 |

### リファクタリング不要なケース

以下の場合は、無理にフックに切り出す必要はありません。

- 単一の `useState` のみで、ロジックがシンプル
- そのコンポーネントでのみ使用され、再利用の見込みがない
- 数行程度の簡単な処理

```tsx
// ❌ 不要なリファクタリング（シンプルすぎる）
const useInputValue = () => {
  const [value, setValue] = useState('')
  return { value, setValue }
}

// ✅ そのまま使用で十分
const SearchInput = () => {
  const [value, setValue] = useState('')
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}
```

## 配置場所の決定

フックの配置場所は**使用スコープ**に基づいて決定します。

### 配置場所一覧

| 使用スコープ         | 配置場所                                          | 例                                                                 |
| -------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| アプリ全体で共有     | `src/hooks/`                                      | `useLocalStorage`, `useDebounce`, `useMediaQuery`, `useDisclosure` |
| 特定ページ内のみ     | `src/components/page/{PageName}/hooks/`           | `useReelList`, `useReelFormState`                                  |
| 特定レイアウト内のみ | `src/components/layout/{LayoutName}/hooks/`       | `useSidebarState`                                                  |
| 特定セクション内のみ | `src/components/page/{PageName}/{Section}/hooks/` | `useReelCardActions`                                               |
| 特定フィーチャー内   | `src/components/feature/{FeatureName}/hooks/`     | `useVideoPlayerControls`                                           |

### ディレクトリ構成

```
apps/web/src/
├── hooks/                              # アプリ全体で共有するフック
│   ├── useLocalStorage/
│   │   ├── useLocalStorage.ts
│   │   ├── index.ts
│   │   └── __test__/
│   │       └── useLocalStorage.test.ts
│   ├── useDebounce/
│   │   ├── useDebounce.ts
│   │   ├── index.ts
│   │   └── __test__/
│   │       └── useDebounce.test.ts
│   └── useMediaQuery/
│       ├── useMediaQuery.ts
│       ├── index.ts
│       └── __test__/
│           └── useMediaQuery.test.ts
│
├── components/page/{PageName}/
│   └── hooks/                          # ページ固有のフック
│       └── use{Hook}/
│           ├── use{Hook}.ts
│           ├── index.ts
│           └── __test__/
│               └── use{Hook}.test.ts
│
├── components/layout/{LayoutName}/
│   └── hooks/                          # レイアウト固有のフック
│       └── use{Hook}/
│           ├── use{Hook}.ts
│           └── index.ts
│
└── components/feature/{FeatureName}/
    └── hooks/                          # フィーチャー固有のフック
        └── use{Hook}/
            ├── use{Hook}.ts
            └── index.ts
```

## グローバルフック（src/hooks/）の判断基準

以下のいずれかに該当する場合、`src/hooks/` に配置してください。

### 1. ブラウザAPIのラッパー

```tsx
// src/hooks/useLocalStorage/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    window.localStorage.setItem(key, JSON.stringify(valueToStore))
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
```

### 2. ユーティリティ的なフック

```tsx
// src/hooks/useDebounce/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

### 3. レスポンシブ対応

```tsx
// src/hooks/useMediaQuery/useMediaQuery.ts
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
```

### 4. グローバルフックの候補一覧

| フック名                  | 用途                     |
| ------------------------- | ------------------------ |
| `useLocalStorage`         | LocalStorageの状態管理   |
| `useSessionStorage`       | SessionStorageの状態管理 |
| `useDebounce`             | 値のデバウンス           |
| `useThrottle`             | 値のスロットル           |
| `useMediaQuery`           | メディアクエリの監視     |
| `useClickOutside`         | 要素外クリックの検知     |
| `useKeyPress`             | キーボードイベントの監視 |
| `useCopyToClipboard`      | クリップボードへのコピー |
| `useWindowSize`           | ウィンドウサイズの取得   |
| `useScrollPosition`       | スクロール位置の取得     |
| `useIntersectionObserver` | 要素の可視性監視         |
| `usePrevious`             | 前回の値の保持           |
| `useToggle`               | ブール値のトグル         |
| `useDisclosure`           | モーダル等の開閉状態管理 |

## コロケーションフックの判断基準

特定のコンポーネント・ページ・フィーチャーに密接に関連するロジックは、該当するディレクトリ内の `hooks/` に配置してください。

### 1. ページ固有のデータ取得・操作

```tsx
// src/components/page/ReelsPage/hooks/useReelList/useReelList.ts
import { useGetApiReels, usePostApiReels } from '@/client/api/reel/reel'

export const useReelList = () => {
  const { data, mutate, isLoading } = useGetApiReels({
    swr: { suspense: true },
  })

  const { trigger: createReel, isMutating } = usePostApiReels()

  const handleCreate = async (name: string) => {
    await createReel({
      name,
      videoDefinition: 'HD',
      videoStandard: 'NTSC',
    })
    mutate()
  }

  return {
    reels: data?.data ?? [],
    isLoading,
    isMutating,
    createReel: handleCreate,
    refresh: mutate,
  }
}
```

### 2. セクション固有のUI状態管理

```tsx
// src/components/page/ReelsPage/ReelListSection/hooks/useReelCardSelection/useReelCardSelection.ts
export const useReelCardSelection = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const select = useCallback((id: string) => {
    setSelectedIds((prev) => [...prev, id])
  }, [])

  const deselect = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }, [])

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }, [])

  const clear = useCallback(() => {
    setSelectedIds([])
  }, [])

  return {
    selectedIds,
    isSelected: (id: string) => selectedIds.includes(id),
    select,
    deselect,
    toggle,
    clear,
  }
}
```

### 3. フォーム状態管理

```tsx
// src/components/page/ReelDetailPage/hooks/useReelEditForm/useReelEditForm.ts
type ReelEditFormState = {
  name: string
  errors: { name?: string }
}

export const useReelEditForm = (initialName: string) => {
  const [state, setState] = useState<ReelEditFormState>({
    name: initialName,
    errors: {},
  })

  const setName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      name,
      errors: { ...prev.errors, name: undefined },
    }))
  }, [])

  const validate = useCallback((): boolean => {
    const errors: ReelEditFormState['errors'] = {}

    if (!state.name.trim()) {
      errors.name = '名前を入力してください'
    } else if (state.name.length > 100) {
      errors.name = '名前は100文字以内で入力してください'
    }

    setState((prev) => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }, [state.name])

  const reset = useCallback(() => {
    setState({ name: initialName, errors: {} })
  }, [initialName])

  return {
    ...state,
    setName,
    validate,
    reset,
    isDirty: state.name !== initialName,
  }
}
```

## リファクタリングの手順

### Step 1: 切り出すロジックを特定

コンポーネント内で以下を確認します。

- 状態管理（`useState`）
- 副作用（`useEffect`）
- 計算ロジック（`useMemo`, `useCallback`）
- 外部データ取得

### Step 2: 使用スコープを判断

```
Q: このロジックは他のページ/コンポーネントでも使用する可能性があるか？
├─ Yes → Q: ドメインに依存しない汎用的なロジックか？
│         ├─ Yes → src/hooks/ に配置
│         └─ No  → src/components/feature/{FeatureName}/hooks/ に配置
└─ No  → Q: どのスコープで使用されるか？
          ├─ ページ全体 → src/components/page/{PageName}/hooks/ に配置
          ├─ セクション内 → src/components/page/{PageName}/{Section}/hooks/ に配置
          └─ レイアウト内 → src/components/layout/{LayoutName}/hooks/ に配置
```

### Step 3: ディレクトリ・ファイル作成

```bash
# グローバルフックの場合
mkdir -p src/hooks/useCustomHook/__test__
touch src/hooks/useCustomHook/useCustomHook.ts
touch src/hooks/useCustomHook/index.ts

# ページ固有フックの場合
mkdir -p src/components/page/ReelsPage/hooks/useReelList/__test__
touch src/components/page/ReelsPage/hooks/useReelList/useReelList.ts
touch src/components/page/ReelsPage/hooks/useReelList/index.ts
```

### Step 4: フックを実装

```tsx
// useCustomHook.ts
import { useState, useCallback } from 'react'

export const useCustomHook = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)

  const reset = useCallback(() => {
    setValue(initialValue)
  }, [initialValue])

  return { value, setValue, reset }
}
```

```tsx
// index.ts
export { useCustomHook } from './useCustomHook'
```

### Step 5: テストを作成

```tsx
// __test__/useCustomHook.test.ts
import { renderHook, act } from '@testing-library/react'
import { useCustomHook } from '../useCustomHook'

describe('useCustomHook', () => {
  it('初期値が設定されること', () => {
    const { result } = renderHook(() => useCustomHook('initial'))
    expect(result.current.value).toBe('initial')
  })

  it('値を更新できること', () => {
    const { result } = renderHook(() => useCustomHook('initial'))
    act(() => {
      result.current.setValue('updated')
    })
    expect(result.current.value).toBe('updated')
  })

  it('リセットで初期値に戻ること', () => {
    const { result } = renderHook(() => useCustomHook('initial'))
    act(() => {
      result.current.setValue('updated')
      result.current.reset()
    })
    expect(result.current.value).toBe('initial')
  })
})
```

## 命名規則

| 対象               | 規則                            | 例                                 |
| ------------------ | ------------------------------- | ---------------------------------- |
| フック関数         | `use` + PascalCase              | `useLocalStorage`, `useReelList`   |
| フックディレクトリ | `use` + PascalCase              | `useLocalStorage/`, `useReelList/` |
| フックファイル     | `use` + PascalCase + `.ts`      | `useLocalStorage.ts`               |
| テストファイル     | `use` + PascalCase + `.test.ts` | `useLocalStorage.test.ts`          |
| 戻り値の型         | PascalCase + `Return`           | `UseLocalStorageReturn`            |

## アンチパターン

### 1. 過度な抽象化

```tsx
// ❌ 使用箇所が1つしかないのにグローバルに配置
// src/hooks/useReelCardHover/useReelCardHover.ts
export const useReelCardHover = () => {
  const [isHovered, setIsHovered] = useState(false)
  return { isHovered, setIsHovered }
}

// ✅ コンポーネント内で直接使用するか、セクション内に配置
// src/components/page/ReelsPage/ReelListSection/ReelCard/ReelCard.tsx
const ReelCard = () => {
  const [isHovered, setIsHovered] = useState(false)
  // ...
}
```

### 2. 不適切なスコープへの配置

```tsx
// ❌ ページ固有のロジックをグローバルに配置
// src/hooks/useReelList.ts
export const useReelList = () => {
  // ReelsPage でしか使わないロジック
}

// ✅ ページ固有のフックはページディレクトリに配置
// src/components/page/ReelsPage/hooks/useReelList/useReelList.ts
export const useReelList = () => {
  // ReelsPage 固有のロジック
}
```

### 3. 循環参照

```tsx
// ❌ フック間で循環参照が発生
// useA.ts
import { useB } from './useB'
export const useA = () => {
  const b = useB()
  // ...
}

// useB.ts
import { useA } from './useA'
export const useB = () => {
  const a = useA()
  // ...
}

// ✅ 共通ロジックを別フックに切り出す
// useShared.ts
export const useShared = () => {
  /* 共通ロジック */
}

// useA.ts
import { useShared } from './useShared'
export const useA = () => {
  const shared = useShared()
  // ...
}
```

## 実装後チェックリスト

1. `pnpm tsc --noEmit` - TypeScriptエラー確認
2. `pnpm lint` - ESLintエラー確認
3. `pnpm test` - テスト実行
4. 使用スコープと配置場所が一致しているか確認
5. index.ts でエクスポートされているか確認

## 行動指針

- 不明点や曖昧な点がある場合は、`AskUserQuestionTool` を使用してユーザーに確認すること
