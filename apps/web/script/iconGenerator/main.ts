import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { optimize } from 'svgo'

import { getSvgoConfig } from './utils/converter'
import { toLabel, toPascalCase } from './utils/nameUtils'
import { generateComponentCode, generateIndexCode } from './utils/template'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SVG_INPUT_DIR = path.resolve(__dirname, './svg')
const OUTPUT_DIR = path.resolve(__dirname, '../../src/components/icon')

type IconGeneratorError =
  | { type: 'FILE_NOT_FOUND'; path: string }
  | { type: 'INVALID_SVG'; path: string; reason: string }
  | { type: 'WRITE_ERROR'; path: string; error: Error }
  | { type: 'DUPLICATE_NAME'; name: string; files: string[] }

const handleErrors = (errors: IconGeneratorError[]): void => {
  if (errors.length === 0) return

  console.error('\n========== エラー一覧 ==========')

  for (const error of errors) {
    switch (error.type) {
      case 'FILE_NOT_FOUND':
        console.error(`[FILE_NOT_FOUND] ${error.path}`)
        break
      case 'INVALID_SVG':
        console.error(`[INVALID_SVG] ${error.path}: ${error.reason}`)
        break
      case 'WRITE_ERROR':
        console.error(`[WRITE_ERROR] ${error.path}: ${error.error.message}`)
        break
      case 'DUPLICATE_NAME':
        console.error(`[DUPLICATE_NAME] "${error.name}" が重複: ${error.files.join(', ')}`)
        break
    }
  }

  process.exit(1)
}

const main = async (): Promise<void> => {
  console.log('アイコン生成を開始します...')

  // 1. 入力ディレクトリの確認
  try {
    await fs.access(SVG_INPUT_DIR)
  } catch {
    console.error(`入力ディレクトリが見つかりません: ${SVG_INPUT_DIR}`)
    console.log('svg/ ディレクトリを作成してSVGファイルを配置してください')
    process.exit(1)
  }

  const svgFiles = await fs.readdir(SVG_INPUT_DIR)
  const svgFileNames = svgFiles.filter((f) => f.endsWith('.svg'))

  if (svgFileNames.length === 0) {
    console.log('SVGファイルが見つかりませんでした')
    console.log(`${SVG_INPUT_DIR} にSVGファイルを配置してください`)
    return
  }

  console.log(`${svgFileNames.length}個のSVGファイルを検出`)

  // 2. 出力ディレクトリの作成
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // 3. 各SVGファイルを変換
  const componentNames: string[] = []
  const errors: IconGeneratorError[] = []
  const nameToFiles: Map<string, string[]> = new Map()

  // まず重複チェック
  for (const fileName of svgFileNames) {
    const componentName = toPascalCase(fileName)
    const existing = nameToFiles.get(componentName) || []
    nameToFiles.set(componentName, [...existing, fileName])
  }

  for (const [name, files] of nameToFiles) {
    if (files.length > 1) {
      errors.push({
        type: 'DUPLICATE_NAME',
        name,
        files,
      })
    }
  }

  if (errors.length > 0) {
    handleErrors(errors)
    return
  }

  for (const fileName of svgFileNames) {
    try {
      const componentName = toPascalCase(fileName)
      const label = toLabel(componentName)

      const svgContent = await fs.readFile(path.join(SVG_INPUT_DIR, fileName), 'utf-8')

      const optimized = optimize(svgContent, getSvgoConfig())
      const componentCode = generateComponentCode(componentName, label, optimized.data)

      await fs.writeFile(path.join(OUTPUT_DIR, `${componentName}.tsx`), componentCode)

      componentNames.push(componentName)
      console.log(`  [OK] ${fileName} → ${componentName}.tsx`)
    } catch (error) {
      errors.push({
        type: 'INVALID_SVG',
        path: fileName,
        reason: error instanceof Error ? error.message : '不明なエラー',
      })
    }
  }

  // 4. index.tsの生成
  if (componentNames.length > 0) {
    const indexCode = generateIndexCode(componentNames)
    await fs.writeFile(path.join(OUTPUT_DIR, 'index.ts'), indexCode)
    console.log('  [OK] index.ts を生成')
  }

  // 5. エラーレポート
  if (errors.length > 0) {
    handleErrors(errors)
  }

  console.log(`\n完了: ${componentNames.length}個のコンポーネントを生成しました`)
}

main().catch(console.error)
