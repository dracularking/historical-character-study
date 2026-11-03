import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { trainingRepo, personRepo } from '../lib/repository'
import { Card, Tag, EmptyState, Disclaimer } from '../components/ui'
import { useArchive, archiveStore } from '../lib/store'

export default function TrainingDetailPage() {
  const { slug } = useParams()
  const mod = trainingRepo.bySlug(slug)
  const { training } = useArchive()

  useEffect(() => {
    if (mod && !training[mod.slug]) archiveStore.startTraining(mod.slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const progress = mod ? training[mod.slug] : undefined

  const pct = useMemo(() => {
    if (!mod || !progress) return 0
    return Math.round((progress.completedSteps.length / mod.steps.length) * 100)
  }, [mod, progress])

  if (!mod) {
    return (
      <EmptyState
        title="训练课程不存在"
        action={<Link to="/training" className="btn btn-primary">返回训练中心</Link>}
      />
    )
  }

  const toggleStep = (stepId: string) => archiveStore.toggleTrainingStep(mod.slug, stepId)

  return (
    <div className="space-y-6">
      <Link to="/training" className="text-sm text-muted hover:accent">
        ← 训练中心
      </Link>

      <header>
        <h1 className="text-2xl font-bold md:text-3xl">{mod.name}</h1>
        <p className="mt-1 text-sm text-muted">{mod.subtitle}</p>
        {progress?.completed && <Tag>✓ 已完成（可继续复盘）</Tag>}
      </header>

      <div>
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            进度 {progress?.completedSteps.length ?? 0}/{mod.steps.length}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--border)]">
          <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <Card>
        <p className="label-title">概念解释</p>
        <p className="mt-2 leading-relaxed">{mod.concept}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-emerald-600/60">
          <p className="font-bold">历史正面案例</p>
          <ul className="mt-2 space-y-2 text-sm">
            {mod.positiveCases.map((c, i) => {
              const p = personRepo.bySlug(c.personSlug)
              return (
                <li key={i}>
                  {p && (
                    <Link to={`/person/${p.slug}`} className="font-medium hover:accent">
                      {p.name}：
                    </Link>
                  )}
                  <span className="text-muted">{c.point}</span>
                </li>
              )
            })}
          </ul>
        </Card>
        <Card className="border-l-4 border-l-rose-600/60">
          <p className="font-bold">历史反面案例</p>
          <ul className="mt-2 space-y-2 text-sm">
            {mod.negativeCases.map((c, i) => {
              const p = personRepo.bySlug(c.personSlug)
              return (
                <li key={i}>
                  {p && (
                    <Link to={`/person/${p.slug}`} className="font-medium hover:accent">
                      {p.name}：
                    </Link>
                  )}
                  <span className="text-muted">{c.point}</span>
                </li>
              )
            })}
          </ul>
        </Card>
      </div>

      <Card>
        <p className="label-title">心理学研究提示（非诊断）</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{mod.psychology}</p>
      </Card>

      <Card>
        <p className="label-title">常见认知误区</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {mod.misconceptions.map((m2, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-rose-500">✗</span>
              <span className="text-muted">{m2}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 分步练习 */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">分步练习（工作表）</h2>
        {mod.steps.map((step, i) => {
          const done = progress?.completedSteps.includes(step.id)
          const entry = progress?.entries[step.id] ?? ''
          return (
            <Card key={step.id} className={done ? 'border-emerald-600/40' : ''}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-[var(--accent)]"
                  checked={Boolean(done)}
                  onChange={() => toggleStep(step.id)}
                  aria-label={`完成 ${step.title}`}
                />
                <div className="flex-1">
                  <h3 className="font-bold">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{step.instruction}</p>
                  <p className="mt-2 rounded-md bg-accent-soft px-3 py-2 text-sm">📝 {step.prompt}</p>
                  <textarea
                    className="input mt-3 min-h-[110px]"
                    placeholder="在这里写你的练习记录（自动保存到本地）…"
                    value={entry}
                    onChange={(e) => archiveStore.saveTrainingEntry(mod.slug, step.id, e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </section>

      <Card>
        <p className="label-title">现实应用场景</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          {mod.applications.map((a, i) => (
            <li key={i}>· {a}</li>
          ))}
        </ul>
        <p className="label-title mt-4">定期复盘问题</p>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          {mod.reviewQuestions.map((q, i) => (
            <li key={i}>{i + 1}. {q}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <p className="label-title">阶段反思（保存到学习档案，可导出 Markdown）</p>
        <textarea
          className="input mt-2 min-h-[140px]"
          placeholder="一周后回来写：我做了哪个小行动？预测与结果差多少？下一步放大到什么程度？"
          value={progress?.reflection ?? ''}
          onChange={(e) => archiveStore.saveTrainingReflection(mod.slug, e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            className="btn btn-primary"
            disabled={pct < 100}
            onClick={() => archiveStore.completeTraining(mod.slug)}
            title={pct < 100 ? '完成全部步骤后可标记结业' : ''}
          >
            {progress?.completed ? '✓ 已标记完成' : '完成训练并归档'}
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (confirm('确定清空这门课的全部练习记录？')) archiveStore.resetTraining(mod.slug)
            }}
          >
            重置记录
          </button>
          <Link to="/archive" className="btn btn-ghost">
            去我的档案
          </Link>
        </div>
        {pct < 100 && <p className="mt-2 text-xs text-muted">完成全部 {mod.steps.length} 步后可标记结业。</p>}
      </Card>

      <Card>
        <p className="label-title">推荐阅读</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {mod.readings.map((r) => (
            <li key={r}>
              <Tag neutral>{r}</Tag>
            </li>
          ))}
        </ul>
      </Card>

      <Disclaimer className="border-rose-500/40">{mod.safetyNote}</Disclaimer>
    </div>
  )
}
