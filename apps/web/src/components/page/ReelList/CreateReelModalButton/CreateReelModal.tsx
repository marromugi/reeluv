'use client'

import { useCreateReelForm } from './hooks/useCreateReelForm'
import type { CreateReelModalProps } from './type'

import { FormFieldRadioGroup, FormFieldTextField } from '@/components/form'
import { AddFill } from '@/components/icon'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { RadioGroupItem } from '@/components/ui/RadioGroup'
import { Typography } from '@/components/ui/Typography'

/**
 * ショーリール作成モーダル
 * リール名、ビデオ規格、解像度を入力して作成
 */
export const CreateReelModal = ({ open, onClose }: CreateReelModalProps) => {
  const {
    name,
    setName,
    videoStandard,
    setVideoStandard,
    videoDefinition,
    setVideoDefinition,
    handleSubmit,
    isSubmitting,
    reset,
  } = useCreateReelForm({ onSuccess: onClose })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <Modal.Header title="ショーリールを作成" />
      <Modal.Body>
        <Typography variant="description" className="mb-6 block">
          ショーリールを作成するにあたって、規格を選択してください。
        </Typography>

        <div className="flex flex-col gap-6">
          {/* リール名入力 */}
          <FormFieldTextField
            label="リール名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="リール名を入力"
          />

          {/* ビデオ規格 */}
          <FormFieldRadioGroup
            label="Standard"
            name="videoStandard"
            direction="horizontal"
            value={videoStandard}
            onChange={(value) => setVideoStandard(value as typeof videoStandard)}
          >
            <RadioGroupItem value="NTSC" label="NTSC" />
            <RadioGroupItem value="PAL" label="PAL" />
          </FormFieldRadioGroup>

          {/* 解像度 */}
          <FormFieldRadioGroup
            label="Definition"
            name="videoDefinition"
            direction="horizontal"
            value={videoDefinition}
            onChange={(value) => setVideoDefinition(value as typeof videoDefinition)}
          >
            <RadioGroupItem value="SD" label="SD" />
            <RadioGroupItem value="HD" label="HD" />
          </FormFieldRadioGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline" theme="secondary" onClick={handleClose}>
          キャンセル
        </Button>
        <Button leftIcon={AddFill} onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
          作成
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
