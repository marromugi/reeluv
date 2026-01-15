import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { ReelListPage } from './ReelList'

import type { ShowReelListResponse } from '@/client/api/model'
import { getGetApiReelsMockHandler, getPostApiReelsMockHandler } from '@/client/api/reel/reel.msw'

const meta: Meta<typeof ReelListPage> = {
  title: 'Page/ReelListPage',
  component: ReelListPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-neutral-900 p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ReelListPage>

/**
 * モックデータ
 */
const mockReels: ShowReelListResponse = {
  data: {
    showReels: [
      {
        id: '1',
        name: 'プロモーションビデオ1',
        videoStandard: 'NTSC',
        videoDefinition: 'HD',
        clipCount: 5,
        totalDuration: '00:05:30:00',
        createdAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-14T15:30:00Z',
      },
      {
        id: '2',
        name: 'プロモーションビデオ2',
        videoStandard: 'PAL',
        videoDefinition: 'HD',
        clipCount: 3,
        totalDuration: '00:03:20:00',
        createdAt: '2025-01-08T09:00:00Z',
        updatedAt: '2025-01-13T12:00:00Z',
      },
      {
        id: '3',
        name: 'プロモーションビデオ3',
        videoStandard: 'NTSC',
        videoDefinition: 'SD',
        clipCount: 8,
        totalDuration: '00:10:00:00',
        createdAt: '2025-01-05T08:00:00Z',
        updatedAt: '2025-01-12T18:45:00Z',
      },
    ],
  },
}

/**
 * デフォルト表示（3件のリール）
 */
export const Default: Story = {
  parameters: {
    msw: {
      handlers: [getGetApiReelsMockHandler(mockReels), getPostApiReelsMockHandler()],
    },
  },
}

/**
 * 空の状態
 */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsMockHandler({
          data: {
            showReels: [],
          },
        }),
      ],
    },
  },
}

/**
 * 多くのリール（グリッドレイアウト確認用）
 */
export const ManyReels: Story = {
  parameters: {
    msw: {
      handlers: [
        getGetApiReelsMockHandler({
          data: {
            showReels: Array.from({ length: 9 }, (_, i) => ({
              id: String(i + 1),
              name: `ショーリール ${i + 1}`,
              videoStandard: i % 2 === 0 ? 'NTSC' : 'PAL',
              videoDefinition: i % 3 === 0 ? 'SD' : 'HD',
              clipCount: Math.floor(Math.random() * 10) + 1,
              totalDuration: `00:0${Math.floor(Math.random() * 9) + 1}:00:00`,
              createdAt: '2025-01-01T00:00:00Z',
              updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
            })),
          },
        }),
        getPostApiReelsMockHandler(),
      ],
    },
  },
}

/**
 * 作成モーダルを開く
 */
export const OpenCreateModal: Story = {
  parameters: {
    msw: {
      handlers: [getGetApiReelsMockHandler(mockReels), getPostApiReelsMockHandler()],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 作成ボタンをクリック
    const createButton = canvas.getByRole('button', { name: /作成/i })
    await userEvent.click(createButton)

    // モーダルが表示されることを確認
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByText('ショーリールを作成')).toBeInTheDocument()
  },
}
