'use client'
import { useCallback, useMemo, useState } from 'react'
import type { SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useLocale, useTranslations } from 'next-intl'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createDateFormatter } from '@/lib/format-date'
import type { IssueRow } from './types'
import BacklogTableToolbar from './BacklogTableToolbar'
import { createBacklogTableColumns } from './BacklogTableColumns'

type BacklogTableProps = {
  rows: IssueRow[]
  onIssueSelect: (issueId: string) => void
}

export default function BacklogTable({ rows, onIssueSelect }: BacklogTableProps) {
  const tDashboard = useTranslations('dashboard')
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'updatedAt', desc: true },
  ])
  const [globalFilter, setGlobalFilter] = useState('')

  const dateFormatter = useMemo(() => createDateFormatter(locale), [locale])

  const tableColumns = useMemo(
    () => createBacklogTableColumns({ tDashboard, dateFormatter }),
    [dateFormatter, tDashboard]
  )

  const globalFilterFn = useCallback((row: { original: IssueRow }, _columnId: string, filterValue: unknown) => {
    const search = String(filterValue ?? '').trim().toLowerCase()
    if (!search) return true

    const issue = row.original
    const tokens = [
      issue.title,
      String(issue.number),
      issue.assigneeName,
      issue.statusName,
    ]

    return tokens.some((token) => token.toLowerCase().includes(search))
  }, [])

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="space-y-4">
      <BacklogTableToolbar
        count={rows.length}
        countLabel={tDashboard('backlog.countLabel')}
        searchPlaceholder={tDashboard('backlog.searchPlaceholder')}
        onSearch={setGlobalFilter}
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => onIssueSelect(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
