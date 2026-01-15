'use client'

import { useCallback, useRef, useState } from 'react'

import type { AddClipModalProps } from './type'

import { usePostApiClips } from '@/client/api/clip/clip'
import type { CreateVideoClipRequest } from '@/client/api/model'
import { FormFieldTextField } from '@/components/form'
import { AddFill } from '@/components/icon'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Typography } from '@/components/ui/Typography'

/**
 * クリップ作成モーダル
 * 新しいクリップをアップロード（ダミーデータで作成）
 */
export const AddClipModal = ({ isOpen, onClose, reel, onMutate }: AddClipModalProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // クリップ作成ミューテーション
  const { trigger: createClip, isMutating } = usePostApiClips()

  /** ファイル選択ボタンクリック */
  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  /** ファイル選択時 */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setSelectedFile(file)
        // ファイル名からクリップ名を自動設定（拡張子を除く）
        if (!name) {
          const fileName = file.name.replace(/\.[^/.]+$/, '')
          setName(fileName)
        }
      }
    },
    [name]
  )

  /** モーダルを閉じる */
  const handleClose = useCallback(() => {
    setName('')
    setDescription('')
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }, [onClose])

  /** クリップを作成 */
  const handleCreate = useCallback(async () => {
    if (!name.trim() || !reel) return

    // ダミーデータでクリップを作成
    const request: CreateVideoClipRequest = {
      name: name.trim(),
      description: description.trim() || null,
      videoStandard: reel.videoStandard as CreateVideoClipRequest['videoStandard'],
      videoDefinition: reel.videoDefinition as CreateVideoClipRequest['videoDefinition'],
      startTimecode: '00:00:00:00',
      endTimecode: '00:00:10:00', // 10秒のダミー
    }
    await createClip(request)

    onMutate()
    handleClose()
  }, [name, description, reel, createClip, onMutate, handleClose])

  return (
    <Modal open={isOpen} onClose={handleClose} size="lg">
      <Modal.Header title="クリップを作成" />
      <Modal.Body>
        <Typography variant="description" className="mb-6 block">
          新しいクリップを作成します。リールと同じ規格（{reel?.videoStandard} /{' '}
          {reel?.videoDefinition}）で作成されます。
        </Typography>

        <div className="flex flex-col gap-6">
          {/* ファイル選択 */}
          <div className="flex flex-col gap-2">
            <Typography as="label" size="sm" weight="semibold">
              動画ファイル
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <Button variant="outline" theme="secondary" size="sm" onClick={handleFileButtonClick}>
                ファイルを選択
              </Button>
              <Typography as="span" size="sm" variant="description">
                {selectedFile ? selectedFile.name : '選択されていません'}
              </Typography>
            </div>
          </div>

          {/* クリップ名入力 */}
          <FormFieldTextField
            label="クリップ名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="クリップ名を入力"
          />

          {/* 説明入力 */}
          <FormFieldTextField
            label="説明（オプション）"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="クリップの説明を入力"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" theme="secondary" onClick={handleClose}>
          キャンセル
        </Button>
        <Button leftIcon={AddFill} onClick={handleCreate} disabled={isMutating || !name.trim()}>
          作成
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
