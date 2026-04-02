'use client'

import { memo } from 'react'

import { Search } from '@/components/shared/Search'

type BacklogTableToolbarProps = {
  count: number
  countLabel: string
  searchPlaceholder: string
  onSearch: (value: string) => void
}

function BacklogTableToolbarComponent({
  count,
  countLabel,
  searchPlaceholder,
  onSearch,
}: BacklogTableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Search
        onSearch={onSearch}
        placeholder={searchPlaceholder}
        className="max-w-sm"
      />
      <div className="text-xs text-muted-foreground">
        {count} {countLabel}
      </div>
    </div>
  )
}

const BacklogTableToolbar = memo(BacklogTableToolbarComponent)

export default BacklogTableToolbar
