'use client'

import { CircleAlert, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

type BacklogErrorProps = {
  onRetry: () => void
  isRetrying: boolean
}

export default function BacklogError({ onRetry, isRetrying }: BacklogErrorProps) {
  const tDashboard = useTranslations('dashboard')
  const tCommon = useTranslations('common')

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </div>
        <p className="text-base font-semibold text-foreground">{tDashboard('board.errorLoadingColumns')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{tDashboard('board.errorHint')}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 cursor-pointer min-w-30"
        >
          {isRetrying ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-3.5 animate-spin" />
              {tCommon('status.loading')}
            </span>
          ) : (
            tCommon('actions.retry')
          )}
        </Button>
      </div>
    </div>
  )
}
