import { useMemo, useState } from 'react'
import PersonCard from '../components/PersonCard'
import { Card, EmptyState } from '../components/ui'
import { personRepo } from '../lib/repository'
import { civilizationGroups, fieldOptions } from '../data'

export default function ExplorePage() {
  const [text, setText] = useState('')
  const [civs, setCivs] = useState<string[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [depth, setDepth] = useState<'all' | 'full'>('all')

  const results = useMemo(
    () => personRepo.search({ text, civilizations: civs, fields, depth }),
    [text, civs, fields, depth],
  )

  const toggle = (list: string[], setter: (v: string[]) => void, value: string) => {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value])
  }

  const activeCount = civs.length + fields.length + (depth === 'full' ? 1 : 0)

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* 筛选侧栏 */}
      <aside>
        <Card className="lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">筛选</h2>
            {activeCount > 0 && (
              <button
                className="text-xs accent hover:underline"
                onClick={() => {
                  setCivs([])
                  setFields([])
                  setDepth('all')
                }}
              >
                清除 ({activeCount})
              </button>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="search" className="label-title">
              全文搜索
            </label>
            <input
              id="search"
              className="input mt-1"
              placeholder="姓名 / 标签 / 文明…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <FilterGroup title="档案深度">
            <CheckRow
              label="只看完整深度档案"
              checked={depth === 'full'}
              onChange={(v) => setDepth(v ? 'full' : 'all')}
            />
          </FilterGroup>

          <FilterGroup title="文明">
            {civilizationGroups.map((c) => (
              <CheckRow
                key={c}
                label={c}
                checked={civs.includes(c)}
                onChange={() => toggle(civs, setCivs, c)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="领域">
            <div className="flex flex-wrap gap-1.5">
              {fieldOptions.map((f) => (
                <button
                  key={f}
                  onClick={() => toggle(fields, setFields, f)}
                  className={fields.includes(f) ? 'chip' : 'chip-neutral hover:border-[var(--accent)]'}
                >
                  {f}
                </button>
              ))}
            </div>
          </FilterGroup>
        </Card>
      </aside>

      {/* 结果 */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold">历史人物探索</h1>
          <p className="text-sm text-muted">{results.length} 位人物</p>
        </div>
        {results.length === 0 ? (
          <EmptyState
            title="没有匹配的人物"
            desc="试试减少筛选条件，或用更短的关键词。"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <PersonCard key={p.slug} person={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-app pt-4">
      <p className="label-title mb-2">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      {label}
    </label>
  )
}
