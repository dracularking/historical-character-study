import { useParams, Link } from 'react-router-dom'
import { traitRepo, personRepo, trainingRepo } from '../lib/repository'
import { Card, Tag, EmptyState, Disclaimer } from '../components/ui'
import { useArchive, archiveStore } from '../lib/store'

export default function TraitDetailPage() {
  const { slug } = useParams()
  const trait = traitRepo.bySlug(slug)
  const { learningTraits } = useArchive()

  if (!trait) {
    return (
      <EmptyState
        title="品质不存在"
        action={<Link to="/traits" className="btn btn-primary">返回品质图谱</Link>}
      />
    )
  }

  const { related, opposite } = traitRepo.linkedSlugs(trait.slug)
  const people = personRepo.byTrait(trait.slug)
  const fullPeople = people.filter((p) => p.depth === 'full')
  const spectrums = fullPeople
    .map((p) => ({ p, s: p.spectrums?.find((x) => x.traitSlug === trait.slug) }))
    .filter((x) => x.s)
  const training = trainingRepo.all().find((m) => m.traitSlug === trait.slug)
  const learning = learningTraits.includes(trait.slug)

  return (
    <div className="space-y-6">
      <header>
        <Link to="/traits" className="text-sm text-muted hover:accent">
          ← 品质图谱
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{trait.name}</h1>
            {trait.aliases?.length ? <p className="mt-1 text-sm text-muted">亦称：{trait.aliases.join('、')}</p> : null}
          </div>
          <button
            className={`btn ${learning ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => archiveStore.toggleTrait(trait.slug)}
          >
            {learning ? '✓ 正在修炼（点击取消）' : '＋ 加入我的修炼'}
          </button>
        </div>
      </header>

      <Card>
        <p className="label-title">精确定义</p>
        <p className="mt-2 text-lg leading-relaxed">{trait.definition}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-sky-600/60">
          <p className="font-bold text-sky-600 dark:text-sky-400">不足</p>
          <p className="mt-2 text-sm text-muted">{trait.deficient}</p>
        </Card>
        <Card className="border-l-4 border-l-[var(--accent)]">
          <p className="accent font-bold">合理表现</p>
          <p className="mt-2 text-sm text-muted">{trait.healthy}</p>
        </Card>
        <Card className="border-l-4 border-l-rose-600/60">
          <p className="font-bold text-rose-600 dark:text-rose-400">过度表现</p>
          <p className="mt-2 text-sm text-muted">{trait.excess}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="label-title">心理学机制与研究提示（非诊断）</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{trait.psychology}</p>
        </Card>
        <Card>
          <p className="label-title">如何培养</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{trait.cultivation}</p>
        </Card>
      </div>

      <Card>
        <p className="label-title">历史正面案例（有深度档案的人物）</p>
        {fullPeople.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {fullPeople.map((p) => {
              const strength = p.strengths?.find((s) => s.traitSlug === trait.slug)
              return (
                <Link
                  key={p.slug}
                  to={`/person/${p.slug}#strengths`}
                  className="rounded-lg border border-app p-3 hover:border-[var(--accent)]"
                >
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {strength?.name ?? p.oneLiner}
                  </p>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">该品质的深度案例正在整理。</p>
        )}
      </Card>

      {spectrums.length > 0 && (
        <Card>
          <p className="label-title">双刃剑情境分析</p>
          <div className="mt-2 space-y-2">
            {spectrums.map(({ p, s }) => (
              <Link
                key={p.slug}
                to={`/person/${p.slug}#spectrum`}
                className="block rounded-lg border border-app px-4 py-3 text-sm hover:border-[var(--accent)]"
              >
                <strong>{p.name}</strong>：{s!.thesis}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <p className="label-title">品质关联</p>
        <div className="mt-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">相近/互补：</span>
            {related.map((t) => (
              <Link key={t.slug} to={`/traits/${t.slug}`}>
                <Tag>{t.name}</Tag>
              </Link>
            ))}
            {!related.length && <span className="text-sm text-muted">—</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">过度时的对面：</span>
            {opposite.map((t) => (
              <Link key={t.slug} to={`/traits/${t.slug}`}>
                <Tag neutral>{t.name}</Tag>
              </Link>
            ))}
            {!opposite.length && <span className="text-sm text-muted">—</span>}
          </div>
        </div>
        <Disclaimer className="mt-4">
          品质之间不必然互相排斥；成熟人格可以同时具备看似相反的能力（如勇气与审慎、坚定与灵活）。
        </Disclaimer>
      </Card>

      {training && (
        <Card className="bg-accent-soft">
          <h2 className="text-lg font-bold">可实践的训练课程：{training.name}</h2>
          <p className="mt-1 text-sm text-muted">{training.subtitle}</p>
          <Link to={`/training/${training.slug}`} className="btn btn-primary mt-3">
            开始训练
          </Link>
        </Card>
      )}
    </div>
  )
}
