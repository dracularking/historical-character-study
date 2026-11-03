import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag, EmptyState } from '../components/ui'
import { traitRepo, personRepo, trainingRepo } from '../lib/repository'
import { useArchive, archiveStore } from '../lib/store'

export default function TraitsPage() {
  const [q, setQ] = useState('')
  const { learningTraits } = useArchive()
  const traits = traitRepo.all()

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    if (!text) return traits
    return traits.filter(
      (t) =>
        t.name.includes(text) ||
        t.definition.toLowerCase().includes(text) ||
        (t.aliases ?? []).some((a) => a.toLowerCase().includes(text)),
    )
  }, [q, traits])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">人格品质知识图谱</h1>
        <p className="mt-1 text-sm text-muted">
          不从人物出发，而从品质出发：每个品质都有合理、过度、不足三种形态；成熟的人格可能同时拥有看似相反的能力（如勇气与审慎）。
        </p>
      </header>

      <input
        className="input max-w-md"
        placeholder="搜索品质（如：勇气、自信、耐心）"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="搜索品质"
      />

      {filtered.length === 0 ? (
        <EmptyState title="没有匹配的品质" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => {
            const people = personRepo.byTrait(t.slug)
            const hasTraining = trainingRepo.all().some((m) => m.traitSlug === t.slug)
            const learning = learningTraits.includes(t.slug)
            return (
              <Card key={t.slug} hover>
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/traits/${t.slug}`}>
                    <h2 className="text-lg font-bold hover:accent">{t.name}</h2>
                  </Link>
                  <button
                    className={learning ? 'chip' : 'chip-neutral hover:border-[var(--accent)]'}
                    onClick={() => archiveStore.toggleTrait(t.slug)}
                  >
                    {learning ? '✓ 修炼中' : '＋ 修炼'}
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{t.definition}</p>
                <div className="mt-3 space-y-1 text-xs">
                  <p><span className="text-sky-500">不足：</span>{t.deficient}</p>
                  <p><span className="accent">合理：</span>{t.healthy}</p>
                  <p><span className="text-rose-500">过度：</span>{t.excess}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Tag neutral>{people.length} 位相关人物</Tag>
                  {hasTraining && <Tag>有训练课程</Tag>}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
