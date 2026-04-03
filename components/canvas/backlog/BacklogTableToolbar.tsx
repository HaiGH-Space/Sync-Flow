'use client'

import { Search } from '@/components/shared/Search'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type BacklogTableToolbarProps = {
  filteredCount: number
  totalCount: number
  countLabel: string
  searchPlaceholder: string
  statusFilterLabel: string
  statusFilterPlaceholder: string
  priorityFilterLabel: string
  priorityFilterPlaceholder: string
  allFilterLabel: string
  statusOptions: string[]
  selectedStatus: string
  onStatusFilterChange: (value: string) => void
  selectedPriority: string
  onPriorityFilterChange: (value: string) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  resetFiltersLabel: string
  onSearch: (value: string) => void
}

type FilterControlsProps = {
  statusFilterLabel: string
  statusFilterPlaceholder: string
  priorityFilterLabel: string
  priorityFilterPlaceholder: string
  allFilterLabel: string
  statusOptions: string[]
  selectedStatus: string
  onStatusFilterChange: (value: string) => void
  selectedPriority: string
  onPriorityFilterChange: (value: string) => void
  hasActiveFilters: boolean
  onResetFilters: () => void
  resetFiltersLabel: string
}

function FilterControls({
  statusFilterLabel,
  statusFilterPlaceholder,
  priorityFilterLabel,
  priorityFilterPlaceholder,
  allFilterLabel,
  statusOptions,
  selectedStatus,
  onStatusFilterChange,
  selectedPriority,
  onPriorityFilterChange,
  hasActiveFilters,
  onResetFilters,
  resetFiltersLabel,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex w-36 flex-col gap-1">
        <span className="text-xs text-muted-foreground">{priorityFilterLabel}</span>
        <Select value={selectedPriority} onValueChange={onPriorityFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={priorityFilterPlaceholder}
              aria-label={priorityFilterLabel}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{allFilterLabel}</SelectItem>
            <SelectItem value="HIGH">HIGH</SelectItem>
            <SelectItem value="MEDIUM">MEDIUM</SelectItem>
            <SelectItem value="LOW">LOW</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-44 flex-col gap-1">
        <span className="text-xs text-muted-foreground">{statusFilterLabel}</span>
        <Select value={selectedStatus} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={statusFilterPlaceholder}
              aria-label={statusFilterLabel}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{allFilterLabel}</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex h-14 items-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
        >
          {resetFiltersLabel}
        </Button>
      </div>
    </div>
  )
}

function BacklogTableToolbarComponent({
  filteredCount,
  totalCount,
  countLabel,
  searchPlaceholder,
  statusFilterLabel,
  statusFilterPlaceholder,
  priorityFilterLabel,
  priorityFilterPlaceholder,
  allFilterLabel,
  statusOptions,
  selectedStatus,
  onStatusFilterChange,
  selectedPriority,
  onPriorityFilterChange,
  hasActiveFilters,
  onResetFilters,
  resetFiltersLabel,
  onSearch,
}: BacklogTableToolbarProps) {
  const countText = hasActiveFilters
    ? `${filteredCount}/${totalCount} ${countLabel}`
    : `${totalCount} ${countLabel}`

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full max-w-sm">
        <Search
          onSearch={onSearch}
          placeholder={searchPlaceholder}
          className="w-full"
        />
      </div>

      <FilterControls
        statusFilterLabel={statusFilterLabel}
        statusFilterPlaceholder={statusFilterPlaceholder}
        priorityFilterLabel={priorityFilterLabel}
        priorityFilterPlaceholder={priorityFilterPlaceholder}
        allFilterLabel={allFilterLabel}
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onStatusFilterChange={onStatusFilterChange}
        selectedPriority={selectedPriority}
        onPriorityFilterChange={onPriorityFilterChange}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        resetFiltersLabel={resetFiltersLabel}
      />

      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {countText}
      </div>
    </div>
  )
}

export default BacklogTableToolbarComponent
