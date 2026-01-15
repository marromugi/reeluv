import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { FormFieldContainer } from './FormFieldContainer'
import { FormFieldLabel } from './FormFieldLabel'

const meta = {
  title: 'UI/FormField',
  component: FormFieldContainer,
  tags: ['autodocs'],
} satisfies Meta<typeof FormFieldContainer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのフォームフィールド
 */
export const Default: Story = {
  render: () => (
    <FormFieldContainer>
      <FormFieldLabel htmlFor="default-input">ラベル</FormFieldLabel>
      <input
        id="default-input"
        type="text"
        placeholder="入力してください"
        className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
      />
    </FormFieldContainer>
  ),
}

/**
 * 必須マーク付きラベル
 */
export const WithRequired: Story = {
  render: () => (
    <FormFieldContainer>
      <FormFieldLabel htmlFor="required-input" required>
        必須項目
      </FormFieldLabel>
      <input
        id="required-input"
        type="text"
        placeholder="入力してください"
        className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
      />
    </FormFieldContainer>
  ),
}

/**
 * ラベルサイズバリエーション
 */
export const LabelSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FormFieldContainer>
        <FormFieldLabel htmlFor="sm-input" size="sm">
          Small ラベル
        </FormFieldLabel>
        <input
          id="sm-input"
          type="text"
          placeholder="Small"
          className="h-10 w-full rounded-md border border-neutral-200 bg-neutral-100 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer>
        <FormFieldLabel htmlFor="md-input" size="md">
          Medium ラベル
        </FormFieldLabel>
        <input
          id="md-input"
          type="text"
          placeholder="Medium"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer>
        <FormFieldLabel htmlFor="lg-input" size="lg">
          Large ラベル
        </FormFieldLabel>
        <input
          id="lg-input"
          type="text"
          placeholder="Large"
          className="h-14 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-5 text-lg dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>
    </div>
  ),
}

/**
 * コンテナのギャップバリエーション
 */
export const ContainerGaps: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <FormFieldContainer gap="sm">
        <FormFieldLabel htmlFor="gap-sm-input">Gap: Small</FormFieldLabel>
        <input
          id="gap-sm-input"
          type="text"
          placeholder="gap-1"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer gap="md">
        <FormFieldLabel htmlFor="gap-md-input">Gap: Medium</FormFieldLabel>
        <input
          id="gap-md-input"
          type="text"
          placeholder="gap-1.5"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer gap="lg">
        <FormFieldLabel htmlFor="gap-lg-input">Gap: Large</FormFieldLabel>
        <input
          id="gap-lg-input"
          type="text"
          placeholder="gap-2"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>
    </div>
  ),
}

/**
 * フォーム例
 */
export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4">
      <FormFieldContainer>
        <FormFieldLabel htmlFor="email" required>
          メールアドレス
        </FormFieldLabel>
        <input
          id="email"
          type="email"
          placeholder="example@example.com"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer>
        <FormFieldLabel htmlFor="password" required>
          パスワード
        </FormFieldLabel>
        <input
          id="password"
          type="password"
          placeholder="パスワードを入力"
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>

      <FormFieldContainer>
        <FormFieldLabel htmlFor="bio">自己紹介（任意）</FormFieldLabel>
        <textarea
          id="bio"
          placeholder="自己紹介を入力"
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 text-base dark:border-neutral-700 dark:bg-neutral-800"
        />
      </FormFieldContainer>
    </form>
  ),
}
