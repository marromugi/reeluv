import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Modal } from './Modal'
import type { ModalProps } from './type'

import { AddFill } from '@/components/icon/AddFill'
import { Button } from '@/components/ui/Button'
import { RadioGroup } from '@/components/ui/RadioGroup/RadioGroup'
import { RadioGroupItem } from '@/components/ui/RadioGroup/RadioGroupItem'

/**
 * Storybook用の型（childrenを除外）
 */
type ModalStoryProps = Omit<ModalProps, 'children'>

const meta: Meta<ModalStoryProps> = {
  title: 'UI/Modal',
  component: Modal as unknown as React.ComponentType<ModalStoryProps>,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'モーダルの開閉状態',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'モーダルのサイズ',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'オーバーレイクリックで閉じるか',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'ESCキーで閉じるか',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<ModalStoryProps>

/**
 * デフォルトのModal（md サイズ）
 */
export const Default: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function DefaultModal(args) {
    const [open, setOpen] = useState(args.open)

    return (
      <div className="flex h-screen items-center justify-center bg-neutral-800">
        <Button onClick={() => setOpen(true)}>モーダルを開く</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <Modal.Header title="タイトル" />
          <Modal.Body>
            <p>モーダルの内容がここに表示されます。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setOpen(false)}>
              閉じる
            </Button>
            <Button>保存</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
}

/**
 * 小サイズ（sm）
 */
export const SizeSmall: Story = {
  args: {
    open: true,
    size: 'sm',
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="小サイズモーダル" />
        <Modal.Body>
          <p>sm サイズのモーダルです。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
}

/**
 * 中サイズ（md）- デフォルト
 */
export const SizeMedium: Story = {
  args: {
    open: true,
    size: 'md',
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="中サイズモーダル" />
        <Modal.Body>
          <p>md サイズのモーダルです（デフォルト）。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
}

/**
 * 大サイズ（lg）
 */
export const SizeLarge: Story = {
  args: {
    open: true,
    size: 'lg',
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="大サイズモーダル" />
        <Modal.Body>
          <p>lg サイズのモーダルです。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
}

/**
 * RadioGroup を含むモーダル（参考UI再現）
 */
export const WithRadioGroup: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function WithRadioGroupModal(args) {
    const [open, setOpen] = useState(args.open)
    const [standard, setStandard] = useState('')
    const [definition, setDefinition] = useState('')

    const handleClose = () => {
      setOpen(false)
      args.onClose()
    }

    return (
      <div className="flex h-screen items-center justify-center bg-neutral-800">
        <Button onClick={() => setOpen(true)}>ショーリールを作成</Button>
        <Modal open={open} onClose={handleClose} size="md">
          <Modal.Header title="ショーリールを作成" />
          <Modal.Body>
            <p className="mb-6 text-neutral-400">
              ショーリールを作成するにあたって、規格を選択してください。
            </p>
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-2 text-sm text-neutral-400">Standard</p>
                <RadioGroup
                  name="standard"
                  direction="horizontal"
                  value={standard}
                  onChange={setStandard}
                >
                  <RadioGroupItem value="ntsc" label="NTSC" />
                  <RadioGroupItem value="pal" label="PAL" />
                </RadioGroup>
              </div>
              <div>
                <p className="mb-2 text-sm text-neutral-400">Definition</p>
                <RadioGroup
                  name="definition"
                  direction="horizontal"
                  value={definition}
                  onChange={setDefinition}
                >
                  <RadioGroupItem value="hd" label="HD" />
                  <RadioGroupItem value="4k" label="4K" />
                </RadioGroup>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={handleClose}>
              閉じる
            </Button>
            <Button leftIcon={AddFill}>作成</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
}

/**
 * 長いコンテンツ（スクロール確認）
 */
export const LongContent: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="長いコンテンツ" />
        <Modal.Body>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="mb-4">
              これは段落 {i + 1}
              です。長いコンテンツがある場合、モーダルのボディはスクロール可能になります。
            </p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
}

/**
 * フッター配置バリエーション
 */
export const FooterAlignVariants: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: () => (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-neutral-800">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">align=&quot;start&quot;</span>
          <div className="relative h-48 w-80 rounded-2xl bg-neutral-900 p-4">
            <div className="flex h-full flex-col">
              <div className="flex-1" />
              <div className="flex justify-start gap-3">
                <Button variant="outline" size="sm">
                  閉じる
                </Button>
                <Button size="sm">保存</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">align=&quot;center&quot;</span>
          <div className="relative h-48 w-80 rounded-2xl bg-neutral-900 p-4">
            <div className="flex h-full flex-col">
              <div className="flex-1" />
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm">
                  閉じる
                </Button>
                <Button size="sm">保存</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">align=&quot;end&quot;</span>
          <div className="relative h-48 w-80 rounded-2xl bg-neutral-900 p-4">
            <div className="flex h-full flex-col">
              <div className="flex-1" />
              <div className="flex justify-end gap-3">
                <Button variant="outline" size="sm">
                  閉じる
                </Button>
                <Button size="sm">保存</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-neutral-400">align=&quot;between&quot;</span>
          <div className="relative h-48 w-80 rounded-2xl bg-neutral-900 p-4">
            <div className="flex h-full flex-col">
              <div className="flex-1" />
              <div className="flex justify-between gap-3">
                <Button variant="outline" size="sm">
                  閉じる
                </Button>
                <Button size="sm">保存</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

/**
 * 閉じるボタンなし
 */
export const NoCloseButton: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="閉じるボタンなし" showCloseButton={false} />
        <Modal.Body>
          <p>ヘッダーの閉じるボタンが非表示になっています。</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
}

/**
 * 全サイズ一覧
 */
export const AllSizes: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: () => (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-neutral-800">
      <div className="flex gap-8">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <span className="text-sm text-neutral-400">{size}</span>
            <div
              className={`rounded-2xl bg-neutral-900 p-4 ${
                size === 'sm' ? 'w-80' : size === 'md' ? 'w-96' : 'w-[32rem]'
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-white">{size} サイズ</span>
              </div>
              <p className="text-neutral-300">サイズ: {size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

/**
 * インタラクションテスト - 開閉動作
 */
export const InteractionTestOpen: Story = {
  args: {
    open: false,
    onClose: fn(),
  },
  render: function InteractionTestOpenModal(args) {
    const [open, setOpen] = useState(false)

    return (
      <div className="flex h-screen items-center justify-center bg-neutral-800">
        <Button data-testid="open-button" onClick={() => setOpen(true)}>
          モーダルを開く
        </Button>
        <Modal
          open={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header title="テストモーダル" />
          <Modal.Body>
            <p data-testid="modal-content">モーダルの内容</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const body = within(canvasElement.ownerDocument.body)

    // 開くボタンをクリック
    const openButton = canvas.getByTestId('open-button')
    await userEvent.click(openButton)

    // モーダルが表示されたことを確認（Portal経由でbodyにレンダリングされる）
    await expect(body.getByTestId('modal-content')).toBeInTheDocument()

    // 閉じるボタンをクリック（Portal経由）
    const closeButton = body.getByTestId('close-button')
    await userEvent.click(closeButton)

    // onClose が呼ばれたことを確認
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * インタラクションテスト - ESCキーで閉じる
 */
export const InteractionTestEscape: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function InteractionTestEscapeModal(args) {
    const [open, setOpen] = useState(true)

    return (
      <div className="h-screen bg-neutral-800">
        <Modal
          open={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header title="ESCキーテスト" />
          <Modal.Body>
            <p data-testid="modal-content">ESCキーで閉じます</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
  play: async ({ args }) => {
    // ESCキーを押す
    await userEvent.keyboard('{Escape}')

    // onClose が呼ばれたことを確認
    await expect(args.onClose).toHaveBeenCalled()
  },
}

/**
 * インタラクションテスト - オーバーレイクリックで閉じる
 */
export const InteractionTestOverlay: Story = {
  args: {
    open: true,
    onClose: fn(),
    closeOnOverlayClick: true,
  },
  render: function InteractionTestOverlayModal(args) {
    const [open, setOpen] = useState(true)

    return (
      <div className="h-screen bg-neutral-800">
        <Modal
          open={open}
          onClose={() => {
            setOpen(false)
            args.onClose()
          }}
          closeOnOverlayClick={args.closeOnOverlayClick}
        >
          <Modal.Header title="オーバーレイクリックテスト" />
          <Modal.Body>
            <p>オーバーレイクリックで閉じます</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    // コンテナ（オーバーレイ領域）をクリック（Portal経由でbodyにレンダリングされる）
    const container = canvasElement.ownerDocument.querySelector(
      '[data-testid="modal-container"]'
    ) as HTMLElement | null
    if (container) {
      // コンテナを直接クリック（モーダルコンテンツ外の領域）
      container.click()
      // onClose が呼ばれたことを確認
      await expect(args.onClose).toHaveBeenCalled()
    } else {
      throw new Error('モーダルコンテナが見つかりませんでした')
    }
  },
}

/**
 * インタラクションテスト - フォーカストラップ
 */
export const InteractionTestFocusTrap: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: (args) => (
    <div className="h-screen bg-neutral-800">
      <Modal {...args}>
        <Modal.Header title="フォーカストラップテスト" />
        <Modal.Body>
          <input
            type="text"
            placeholder="入力1"
            data-testid="input1"
            className="mb-2 w-full rounded border border-neutral-600 bg-neutral-800 p-2 text-white"
          />
          <input
            type="text"
            placeholder="入力2"
            data-testid="input2"
            className="w-full rounded border border-neutral-600 bg-neutral-800 p-2 text-white"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button data-testid="close-btn" variant="outline" onClick={args.onClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    // 最初のフォーカス可能要素（閉じるボタン）にフォーカスされていることを確認
    // 閉じるボタン（×）が最初にフォーカスされる（Portal経由）
    await expect(body.getByLabelText('閉じる')).toHaveFocus()

    // Tabで次の要素に移動（ModalBodyのtabIndex=0がフォーカスされる）
    await userEvent.tab()

    // さらにTabで移動
    await userEvent.tab()
    await expect(body.getByTestId('input1')).toHaveFocus()

    // さらにTabで移動
    await userEvent.tab()
    await expect(body.getByTestId('input2')).toHaveFocus()

    // さらにTabで移動（閉じるボタン）
    await userEvent.tab()
    await expect(body.getByTestId('close-btn')).toHaveFocus()

    // さらにTabで最初に戻る（トラップ確認）
    await userEvent.tab()
    await expect(body.getByLabelText('閉じる')).toHaveFocus()
  },
}

/**
 * ネストモーダル
 * 親モーダル内から子モーダルを開くパターン
 */
export const NestedModal: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function NestedModalStory(args) {
    const [parentOpen, setParentOpen] = useState(true)
    const [childOpen, setChildOpen] = useState(false)

    return (
      <div className="h-screen bg-neutral-800">
        <Modal
          open={parentOpen}
          onClose={() => {
            setParentOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header title="親モーダル" />
          <Modal.Body>
            <p className="mb-4">これは親モーダルです。</p>
            <Button data-testid="open-child-button" onClick={() => setChildOpen(true)}>
              子モーダルを開く
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline"
              onClick={() => {
                setParentOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 子モーダル */}
        <Modal open={childOpen} onClose={() => setChildOpen(false)} size="sm">
          <Modal.Header title="子モーダル" />
          <Modal.Body>
            <p data-testid="child-modal-content">これは子モーダルです。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-child-button"
              variant="outline"
              onClick={() => setChildOpen(false)}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
}

/**
 * インタラクションテスト - ネストモーダルの開閉
 */
export const InteractionTestNestedModal: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function InteractionTestNestedModalStory(args) {
    const [parentOpen, setParentOpen] = useState(true)
    const [childOpen, setChildOpen] = useState(false)

    return (
      <div className="h-screen bg-neutral-800">
        <Modal
          open={parentOpen}
          onClose={() => {
            setParentOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header title="親モーダル" />
          <Modal.Body>
            <p className="mb-4">これは親モーダルです。</p>
            <Button data-testid="open-child-button" onClick={() => setChildOpen(true)}>
              子モーダルを開く
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-parent-button"
              variant="outline"
              onClick={() => {
                setParentOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 子モーダル */}
        <Modal open={childOpen} onClose={() => setChildOpen(false)} size="sm">
          <Modal.Header title="子モーダル" />
          <Modal.Body>
            <p data-testid="child-modal-content">これは子モーダルです。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-child-button"
              variant="outline"
              onClick={() => setChildOpen(false)}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)

    // 子モーダルを開くボタンをクリック
    const openChildButton = body.getByTestId('open-child-button')
    await userEvent.click(openChildButton)

    // 子モーダルが表示されたことを確認
    await expect(body.getByTestId('child-modal-content')).toBeInTheDocument()

    // 子モーダルを閉じる
    const closeChildButton = body.getByTestId('close-child-button')
    await userEvent.click(closeChildButton)

    // 親モーダルがまだ表示されていることを確認
    await expect(body.getByTestId('open-child-button')).toBeInTheDocument()
  },
}

/**
 * インタラクションテスト - 閉じる順序（ESCキーで最前面のモーダルから閉じる）
 */
export const InteractionTestCloseOrder: Story = {
  args: {
    open: true,
    onClose: fn(),
  },
  render: function InteractionTestCloseOrderStory(args) {
    const [parentOpen, setParentOpen] = useState(true)
    const [childOpen, setChildOpen] = useState(true)

    return (
      <div className="h-screen bg-neutral-800">
        <Modal
          open={parentOpen}
          onClose={() => {
            setParentOpen(false)
            args.onClose()
          }}
        >
          <Modal.Header title="親モーダル" />
          <Modal.Body>
            <p data-testid="parent-modal-content">これは親モーダルです。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-parent-button"
              variant="outline"
              onClick={() => {
                setParentOpen(false)
                args.onClose()
              }}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>

        {/* 子モーダル（最初から開いている） */}
        <Modal open={childOpen} onClose={() => setChildOpen(false)} size="sm">
          <Modal.Header title="子モーダル" />
          <Modal.Body>
            <p data-testid="child-modal-content">これは子モーダルです。</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              data-testid="close-child-button"
              variant="outline"
              onClick={() => setChildOpen(false)}
            >
              閉じる
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body)

    // 両方のモーダルが表示されていることを確認
    await expect(body.getByTestId('child-modal-content')).toBeInTheDocument()
    await expect(body.getByTestId('parent-modal-content')).toBeInTheDocument()

    // ESCキーを押す（最前面の子モーダルが閉じる）
    await userEvent.keyboard('{Escape}')

    // 子モーダルが閉じるのを待つ（アニメーション完了まで）
    await waitFor(() => {
      expect(body.queryByTestId('child-modal-content')).not.toBeInTheDocument()
    })

    // 親モーダルが残っていることを確認
    await expect(body.getByTestId('parent-modal-content')).toBeInTheDocument()

    // もう一度ESCキーを押す（親モーダルが閉じる）
    await userEvent.keyboard('{Escape}')

    // 親モーダルも閉じたことを確認
    await expect(args.onClose).toHaveBeenCalled()
  },
}
