import type { Evidence } from '../types'
import { sourceRepo } from '../lib/repository'
import { evidenceGradeLabels } from '../data'
import { Tag } from './ui'

const gradeStyle: Record<string, string> = {
  A: 'border-emerald-600/50 text-emerald-700 dark:text-emerald-400',
  B: 'border-sky-600/50 text-sky-700 dark:text-sky-400',
  C: 'border-amber-600/50 text-amber-700 dark:text-amber-400',
  D: 'border-rose-600/50 text-rose-700 dark:text-rose-400',
}

export function GradeBadge({ grade, withLabel = false }: { grade: Evidence['grade']; withLabel?: boolean }) {
  return (
    <span
      title={`${evidenceGradeLabels[grade]?.label}：${evidenceGradeLabels[grade]?.desc}`}
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${gradeStyle[grade] ?? ''}`}
    >
      {grade}
      {withLabel && <span className="ml-1 font-normal">{evidenceGradeLabels[grade]?.label}</span>}
    </span>
  )
}

/** 内联的证据引用小标记（标题旁） */
export function EvidenceRefs({ evidence }: { evidence: Evidence[] }) {
  if (!evidence.length) return null
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] text-muted">史料：</span>
      {evidence.map((e, i) => {
        const src = sourceRepo.byId(e.sourceId)
        return (
          <span key={i} className="inline-flex items-center gap-1">
            <Tag>
              {src?.author?.split('（')[0] ?? src?.title.slice(0, 8) ?? '来源'}
              {e.locator ? ` ${e.locator}` : ''}
            </Tag>
            <GradeBadge grade={e.grade} />
          </span>
        )
      })}
    </div>
  )
}

/** 完整证据卡列表 */
export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  if (!evidence.length)
    return <p className="text-sm text-muted">本模块暂无已整理的证据条目。</p>
  return (
    <ul className="space-y-3">
      {evidence.map((e, i) => {
        const src = sourceRepo.byId(e.sourceId)
        return (
          <li key={i} className="rounded-lg border border-app p-4">
            <div className="flex flex-wrap items-center gap-2">
              <GradeBadge grade={e.grade} withLabel />
              <span className="font-medium">{src?.title ?? e.sourceId}</span>
              {e.locator && <Tag neutral>{e.locator}</Tag>}
            </div>
            <p className="mt-2 text-sm text-muted">
              {src?.author} · {src?.dateWritten}
            </p>
            {e.excerpt && <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-sm">{e.excerpt}</p>}
            {e.note && <p className="mt-2 text-sm">📌 {e.note}</p>}
            {src?.reliability && (
              <p className="mt-2 text-xs text-muted">来源可靠性：{src.reliability}</p>
            )}
            {src?.limitations && <p className="text-xs text-muted">局限：{src.limitations}</p>}
          </li>
        )
      })}
    </ul>
  )
}
