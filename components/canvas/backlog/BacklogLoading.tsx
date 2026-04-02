'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function BacklogLoading() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={`backlog-row-${index}`} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
