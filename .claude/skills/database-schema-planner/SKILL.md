---
name: database-schema-planner
description: Drizzle ORM + SQLiteを使用したデータベーススキーマの設計を支援します。テーブル設計、リレーション定義、インデックス設計などをプロジェクトの規約に沿って行います。You MUST use this when you create Drizzle ORM + SQLite schema.
---

# データベーススキーマ設計スキル

Drizzle ORM + SQLite向けのスキーマ設計ガイドライン。

## 構成

- **配置場所**: `databases/core/src/schema/*.schema.ts`
- **命名**: スキーマファイルは `*.schema.ts` パターン

## 命名規則

| 対象       | 規則                   | 例                      |
| ---------- | ---------------------- | ----------------------- |
| テーブル名 | スネークケース・複数形 | `users`, `blog_posts`   |
| カラム名   | スネークケース         | `created_at`, `user_id` |
| TS変数     | キャメルケース         | `users`, `blogPosts`    |
| 主キー     | `id`                   | nanoid使用              |
| 外部キー   | `<単数形>_id`          | `user_id`               |

## カラム型

| 用途   | Drizzle型                                          |
| ------ | -------------------------------------------------- |
| ID     | `text('id').primaryKey()`                          |
| 文字列 | `text('name')`                                     |
| 数値   | `integer('count')`                                 |
| 真偽値 | `integer('is_active', { mode: 'boolean' })`        |
| 日時   | `integer('created_at', { mode: 'timestamp' })`     |
| JSON   | `text('metadata', { mode: 'json' })`               |
| Enum   | `text('status', { enum: ['draft', 'published'] })` |

## インデックス設計

**作成する**:

- 外部キー（JOIN用）
- WHERE/ORDER BYで頻繁に使用するカラム
- ユニーク制約が必要なカラム

**作成しない**:

- 小規模テーブル（〜1000件）
- カーディナリティが低い単体カラム（`is_active`など）
- 更新頻度が高いカラム

**複合インデックス**: カーディナリティが高いカラムを先に配置

## ID生成

```typescript
// databases/core/src/id.ts
import { nanoid } from 'nanoid'

export const generateId = () => nanoid()
```

## テンプレート

```typescript
// databases/core/src/schema/posts.schema.ts
import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { generateId } from '../id'

export const posts = sqliteTable(
  'posts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => generateId()),
    authorId: text('author_id').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    status: text('status', { enum: ['draft', 'published'] })
      .notNull()
      .default('draft'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [
    index('posts_author_id_idx').on(table.authorId),
    uniqueIndex('posts_slug_idx').on(table.slug),
  ]
)
```

## リレーション

```typescript
// databases/core/src/schema/relations.schema.ts
import { relations } from 'drizzle-orm'

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}))
```

## チェックリスト

- [ ] `id`主キーがあるか
- [ ] `createdAt`/`updatedAt`があるか
- [ ] 外部キーにインデックスがあるか
- [ ] ユニーク制約が設定されているか
- [ ] 命名規則に従っているか
