import type { ReactNode } from 'react'
import { useState, type CSSProperties } from 'react'

export function Card({
  children,
  className = '',
  hover = false,
  style,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
}) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} style={style}>
      {children}
    </div>
  )
}

export function SectionTitle({
  children,
  hint,
}: {
  children: ReactNode
  hint?: string
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{children}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  )
}

export function Tag({
  children,
  neutral = false,
  className = '',
}: {
  children: ReactNode
  neutral?: boolean
  className?: string
}) {
  return <span className={`${neutral ? 'chip-neutral' : 'chip'} ${className}`}>{children}</span>
}

export function useTabs({
  tabs,
  initial,
}: {
  tabs: { id: string; label: string; badge?: number }[]
  initial?: string
}) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id)
  const bar = (
    <div
      role="tablist"
      aria-label="内容分区"
      className="sticky top-14 z-20 -mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-app bg-app/95 px-4 py-2 backdrop-blur"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => setActive(t.id)}
          className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
            active === t.id
              ? 'bg-accent-soft font-medium accent'
              : 'text-muted hover:text-[var(--text)]'
          }`}
        >
          {t.label}
          {typeof t.badge === 'number' && <span className="ml-1 text-xs opacity-70">{t.badge}</span>}
        </button>
      ))}
    </div>
  )
  return { active, setActive, bar }
}

export function EmptyState({
  icon = '🏛️',
  title,
  desc,
  action,
}: {
  icon?: string
  title: string
  desc?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-app px-6 py-14 text-center">
      <div className="mb-3 text-4xl" aria-hidden>
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {desc && <p className="mt-1 max-w-md text-sm text-muted">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Disclaimer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`rounded-lg border border-app bg-accent-soft px-3 py-2 text-xs text-muted ${className}`}>
      ⚖️ {children}
    </p>
  )
}
