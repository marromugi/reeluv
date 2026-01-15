'use client'

import { CreateReelModal } from './CreateReelModal'

import { AddFill } from '@/components/icon'
import { Button } from '@/components/ui/Button'
import { useDisclosure } from '@/hooks/useDisclosure'

/**
 * ショーリール作成ボタン
 * クリックでモーダルを開く
 */
export const CreateReelModalButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button leftIcon={AddFill} onClick={onOpen}>
        作成
      </Button>
      <CreateReelModal open={isOpen} onClose={onClose} />
    </>
  )
}
