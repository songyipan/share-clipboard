import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@share-clipboard/i18n'
import { Button } from '@share-clipboard/ui/components/button'

import { NotebookPanel } from '../components/notebook/NotebookPanel'

export function NotebookPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="h-10 w-full shrink-0" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties} />
      <div className="flex shrink-0 items-center gap-2 px-4 pb-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          {t('main.backToHome')}
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <NotebookPanel skipEntryGate />
      </div>
    </div>
  )
}
