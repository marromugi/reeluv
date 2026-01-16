import { execSync } from 'child_process'

const run = (command: string, label: string) => {
  console.log(`\n🚀 ${label}...`)
  execSync(command, { stdio: 'inherit' })
  console.log(`✅ ${label} 完了`)
}

run('pnpm --filter @reeluv/database-core db:push:web', 'データベースのマイグレーション')
run('pnpm --filter @reeluv/database-core seed:web', 'シードデータの投入')
run('pnpm --filter @reeluv/database-core build', 'データベースクライアントのビルド')

console.log('\n🎉 セットアップが完了しました！')
