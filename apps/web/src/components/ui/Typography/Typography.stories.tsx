import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, within } from 'storybook/test'

import { Typography } from './Typography'

const meta = {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'description', 'alert', 'fill'],
      description: 'テキストの用途・カラー',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'フォントサイズ',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'フォントの太さ',
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label'],
      description: 'レンダリングする要素の種類',
    },
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

/**
 * デフォルトのTypography（body / md / normal）
 */
export const Default: Story = {
  args: {
    children: 'デフォルトのテキスト',
  },
}

// ===== Variant Stories =====

/**
 * Body バリアント - 本文テキスト
 */
export const VariantBody: Story = {
  args: {
    variant: 'body',
    children: '本文テキスト（Body）',
  },
}

/**
 * Description バリアント - 説明文
 */
export const VariantDescription: Story = {
  args: {
    variant: 'description',
    children: '説明文（Description）',
  },
}

/**
 * Alert バリアント - 警告・エラー
 */
export const VariantAlert: Story = {
  args: {
    variant: 'alert',
    children: '警告メッセージ（Alert）',
  },
}

/**
 * Fill バリアント - 強調テキスト
 */
export const VariantFill: Story = {
  args: {
    variant: 'fill',
    children: '強調テキスト（Fill）',
  },
}

// ===== Size Stories =====

/**
 * XS サイズ
 */
export const SizeXs: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small (xs)',
  },
}

/**
 * SM サイズ
 */
export const SizeSm: Story = {
  args: {
    size: 'sm',
    children: 'Small (sm)',
  },
}

/**
 * MD サイズ（デフォルト）
 */
export const SizeMd: Story = {
  args: {
    size: 'md',
    children: 'Medium (md)',
  },
}

/**
 * LG サイズ
 */
export const SizeLg: Story = {
  args: {
    size: 'lg',
    children: 'Large (lg)',
  },
}

/**
 * XL サイズ
 */
export const SizeXl: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large (xl)',
  },
}

// ===== Weight Stories =====

/**
 * Normal ウェイト
 */
export const WeightNormal: Story = {
  args: {
    weight: 'normal',
    children: 'Normal Weight',
  },
}

/**
 * Medium ウェイト
 */
export const WeightMedium: Story = {
  args: {
    weight: 'medium',
    children: 'Medium Weight',
  },
}

/**
 * Semibold ウェイト
 */
export const WeightSemibold: Story = {
  args: {
    weight: 'semibold',
    children: 'Semibold Weight',
  },
}

/**
 * Bold ウェイト
 */
export const WeightBold: Story = {
  args: {
    weight: 'bold',
    children: 'Bold Weight',
  },
}

// ===== As Prop Stories =====

/**
 * h1 要素として使用
 */
export const AsH1: Story = {
  args: {
    as: 'h1',
    size: 'xl',
    weight: 'bold',
    children: '見出し1（h1）',
  },
}

/**
 * p 要素として使用
 */
export const AsP: Story = {
  args: {
    as: 'p',
    children: '段落テキスト（p）',
  },
}

/**
 * label 要素として使用
 */
export const AsLabel: Story = {
  args: {
    as: 'label',
    weight: 'medium',
    children: 'ラベル（label）',
  },
}

// ===== Combination Stories =====

/**
 * 全バリアント一覧
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {/* Variants */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Variants</h3>
        <div className="flex flex-col gap-2">
          <Typography variant="body">Body - 本文テキスト</Typography>
          <Typography variant="description">Description - 説明文</Typography>
          <Typography variant="alert">Alert - 警告・エラー</Typography>
          <Typography variant="fill">Fill - 強調テキスト</Typography>
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Sizes</h3>
        <div className="flex flex-col gap-1">
          <Typography size="xs">Extra Small (xs)</Typography>
          <Typography size="sm">Small (sm)</Typography>
          <Typography size="md">Medium (md)</Typography>
          <Typography size="lg">Large (lg)</Typography>
          <Typography size="xl">Extra Large (xl)</Typography>
        </div>
      </div>

      {/* Weights */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Weights</h3>
        <div className="flex flex-col gap-1">
          <Typography weight="normal">Normal</Typography>
          <Typography weight="medium">Medium</Typography>
          <Typography weight="semibold">Semibold</Typography>
          <Typography weight="bold">Bold</Typography>
        </div>
      </div>

      {/* As Elements */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">As Elements</h3>
        <div className="flex flex-col gap-1">
          <Typography as="h1" size="xl" weight="bold">
            h1 見出し
          </Typography>
          <Typography as="h2" size="lg" weight="semibold">
            h2 見出し
          </Typography>
          <Typography as="p">p 段落</Typography>
          <Typography as="span">span インライン</Typography>
        </div>
      </div>

      {/* Combinations */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">Combinations</h3>
        <div className="flex flex-col gap-2">
          <Typography as="h1" variant="fill" size="xl" weight="bold">
            ページタイトル
          </Typography>
          <Typography variant="body" size="md">
            本文テキストの例です。これは通常のコンテンツに使用されます。
          </Typography>
          <Typography variant="description" size="sm">
            補足説明や注釈などに使用する説明文です。
          </Typography>
          <Typography variant="alert" size="sm" weight="medium">
            エラー: 入力内容に問題があります。
          </Typography>
        </div>
      </div>
    </div>
  ),
}

// ===== Interaction Tests =====

/**
 * インタラクションテスト - 正しい要素でレンダリングされることを確認
 */
export const RenderAsCorrectElement: Story = {
  args: {
    as: 'h2',
    children: 'テスト見出し',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // h2 要素としてレンダリングされていることを確認
    const heading = canvas.getByRole('heading', { level: 2 })
    await expect(heading).toBeInTheDocument()
    await expect(heading).toHaveTextContent('テスト見出し')
  },
}

/**
 * インタラクションテスト - className が正しく適用されることを確認
 */
export const CustomClassName: Story = {
  args: {
    className: 'custom-test-class',
    children: 'カスタムクラス付きテキスト',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const text = canvas.getByText('カスタムクラス付きテキスト')
    await expect(text).toHaveClass('custom-test-class')
  },
}
