'use client'

import { Inbox } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BacklogEmpty() {
  const tDashboard = useTranslations('dashboard')

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="max-w-lg w-full text-center px-4">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">{tDashboard('backlog.empty')}</p>
      </div>
    </div>
  )
}
