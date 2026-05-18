import type { JSX } from 'react'

import type { TFunction } from '@share-clipboard/i18n'
import { Button } from '@share-clipboard/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@share-clipboard/ui/components/card'
import { Textarea } from '@share-clipboard/ui/components/textarea'

export type NotebookEntryGateStep = 'choice' | 'later'

interface NotebookEntryGateProps {
  step: NotebookEntryGateStep
  remark: string
  busy: boolean
  onRemarkChange: (v: string) => void
  onEditLater: () => void
  onEditNow: () => void
  onBack: () => void
  onSaveToList: () => void
  t: TFunction
}

export function NotebookEntryGate(props: NotebookEntryGateProps): JSX.Element {
  const { step, remark, busy, onRemarkChange, onEditLater, onEditNow, onBack, onSaveToList, t } =
    props
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 p-3"
      role="presentation"
    >
      <Card
        className="w-full max-w-sm gap-4 py-4 shadow-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notebook-entry-title"
      >
        <CardHeader className="gap-1.5 px-4">
          <CardTitle id="notebook-entry-title" className="text-base">
            {t('panel.notebookEntryTitle')}
          </CardTitle>
          <CardDescription className="text-xs">
            {step === 'choice' ? t('panel.notebookEntryHint') : t('panel.notebookEntryLaterHint')}
          </CardDescription>
        </CardHeader>

        {step === 'later' ? (
          <NotebookEntryRemarkBlock
            remark={remark}
            busy={busy}
            onRemarkChange={onRemarkChange}
            t={t}
          />
        ) : null}

        <NotebookEntryGateFooter
          step={step}
          busy={busy}
          onEditLater={onEditLater}
          onEditNow={onEditNow}
          onBack={onBack}
          onSaveToList={onSaveToList}
          t={t}
        />
      </Card>
    </div>
  )
}

function NotebookEntryRemarkBlock(props: {
  remark: string
  busy: boolean
  onRemarkChange: (v: string) => void
  t: TFunction
}): JSX.Element {
  const { remark, busy, onRemarkChange, t } = props
  return (
    <CardContent className="space-y-2 px-4">
      <label htmlFor="notebook-entry-remark" className="text-xs font-medium text-foreground">
        {t('panel.notebookRemarkLabel')}
      </label>
      <Textarea
        id="notebook-entry-remark"
        value={remark}
        onChange={(e) => onRemarkChange(e.target.value)}
        placeholder={t('panel.notebookRemarkPlaceholder')}
        rows={3}
        className="min-h-18 resize-none text-sm"
        disabled={busy}
      />
    </CardContent>
  )
}

function NotebookEntryGateFooter(props: {
  step: NotebookEntryGateStep
  busy: boolean
  onEditLater: () => void
  onEditNow: () => void
  onBack: () => void
  onSaveToList: () => void
  t: TFunction
}): JSX.Element {
  const { step, busy, onEditLater, onEditNow, onBack, onSaveToList, t } = props
  return (
    <CardFooter className="flex flex-col gap-2 border-t px-4 pt-4 sm:flex-row sm:justify-end">
      {step === 'choice' ? (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onEditLater}
            disabled={busy}
          >
            {t('panel.notebookEditLater')}
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onEditNow}
            disabled={busy}
          >
            {t('panel.notebookEditNow')}
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full sm:mr-auto sm:w-auto"
            onClick={onBack}
            disabled={busy}
          >
            {t('panel.notebookEntryBack')}
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto"
            onClick={onSaveToList}
            disabled={busy}
          >
            {t('panel.notebookSaveToList')}
          </Button>
        </>
      )}
    </CardFooter>
  )
}
