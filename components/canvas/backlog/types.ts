import type { Issue } from '@/lib/api/issue'

export type IssueRow = Issue & {
  assigneeName: string
  statusName: string
}
