'use client'

import { useState } from 'react'
import { AlertDialog } from '@astryxdesign/core/AlertDialog'
import { Button, type ButtonVariant } from '@astryxdesign/core/Button'
import { IconButton } from '@astryxdesign/core/IconButton'
import styles from './confirmAction.module.css'

interface ConfirmActionProps {
  triggerLabel: string
  title: string
  description: string
  actionLabel: string
  onConfirm: () => unknown | Promise<unknown>
  isPending?: boolean
  triggerVariant?: ButtonVariant
  triggerSize?: 'sm' | 'md' | 'lg'
  triggerIcon?: React.ReactNode
  isTriggerIconOnly?: boolean
}

export function ConfirmAction({ triggerLabel, title, description, actionLabel, onConfirm, isPending = false, triggerVariant = 'ghost', triggerSize = 'sm', triggerIcon, isTriggerIconOnly = false }: ConfirmActionProps) {

  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = async () => {

    await onConfirm()
    setIsOpen(false)

  }

  return (
    <>
      {isTriggerIconOnly && triggerIcon ? (
        <IconButton label={triggerLabel} variant={triggerVariant} size={triggerSize} icon={triggerIcon} onClick={() => setIsOpen(true)} />
      ) : (
        <Button label={triggerLabel} variant={triggerVariant} size={triggerSize} icon={triggerIcon} onClick={() => setIsOpen(true)} />
      )}
      <AlertDialog
        className={styles.dialog}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        description={description}
        actionLabel={actionLabel}
        isActionLoading={isPending}
        onAction={handleConfirm}
      />
    </>
  )

}
