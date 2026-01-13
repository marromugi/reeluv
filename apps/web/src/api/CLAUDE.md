# API

## Directory Structure

```
api/
├── index.ts
├── route/                      # APIエンドポイント
├── application/                # ユースケース
├── domain/                     # ドメインロジック
│   └── {entity}/
│       ├── entity/
│       │   └── {entity}.ts
│       ├── valueObject/
│       │   └── {name}.ts
│       ├── repository/
│       │   └── {entity}Repository.ts
│       └── service/
│           └── {entity}Service.ts
└── middleware/                 # ミドルウェア
```

## Test

Vitest を使用。グローバルAPI（`describe`, `it`, `expect`）は import 不要。

```bash
pnpm test           # 全テスト実行
pnpm test --watch   # ウォッチモード
```

テストファイルは `*.test.ts` または `*.spec.ts` で作成する。
