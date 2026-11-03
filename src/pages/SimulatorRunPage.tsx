import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { scenarioRepo, personRepo } from '../lib/repository'
import { Card, Tag, EmptyState, Disclaimer } from '../components/ui'
import { EvidenceList } from '../components/Evidence'
import { useArchive, archiveStore } from '../lib/store'

export default function SimulatorRunPage() {
  const { slug } = useParams()
  const scenario = scenarioRepo.bySlug(slug)
  const { simulations } = useArchive()
  const previous = simulations.find((s) => s.scenarioSlug === slug)
  const [chosen, setChosen] = useState<string | null>(previous?.optionId ?? null)
  const [revealed, setRevealed] = useState(Boolean(previous))
  const [reflection, setReflection] = useState(previous?.reflection ?? '')
  const [savedFlash, setSavedFlash] = useState(false)
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (revealed) {
      setTimeout(() => revealRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }, [revealed])

  if (!scenario) {
    return (
      <EmptyState
        title="场景不存在"
        action={<Link to="/simulator" className="btn btn-primary">返回模拟列表</Link>}
      />
    )
  }

  const person = personRepo.bySlug(scenario.personSlug)
  const actual = scenario.options.find((o) => o.id === scenario.actualOptionId)!

  const choose = (id: string) => {
    setChosen(id)
    setRevealed(true)
  }

  const reset = () => {
    archiveStore.resetSimulation(scenario.slug)
    setChosen(null)
    setRevealed(false)
    setReflection('')
  }

  const saveReflection = () => {
    if (chosen) archiveStore.recordSimulation(scenario.slug, chosen, reflection)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2500)
  }

  return (
    <div className="space-y-6">
      <Link to="/simulator" className="text-sm text-muted hover:accent">
        ← 决策模拟列表
      </Link>

      <header>
        <h1 className="text-2xl font-bold md:text-3xl">{scenario.title}</h1>
        <p className="mt-1 text-sm text-muted">
          {person?.name} · {scenario.year}
        </p>
      </header>

      {/* 第一幕 */}
      <Card>
        <p className="label-title">第一幕 · 你当时知道什么</p>
        <p className="mt-3 leading-relaxed">{scenario.brief}</p>
        <p className="label-title mt-5">你可获得的信息</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {scenario.knownInfo.map((k, i) => (
            <li key={i} className="flex gap-2">
              <span className="accent">✓</span>
              {k}
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-lg border border-dashed border-app p-3 text-sm text-muted">
          🔒 你此时不知道的事、真实历史的结果、历史学家的分歧——都被密封在第二幕。先做选择。
        </div>
      </Card>

      <Card>
        <p className="label-title">你的决策</p>
        <div className="mt-3 grid gap-3">
          {scenario.options.map((o) => (
            <button
              key={o.id}
              onClick={() => !revealed && choose(o.id)}
              disabled={revealed}
              className={`rounded-lg border p-4 text-left transition-colors ${
                revealed && o.id === chosen
                  ? 'border-[var(--accent)] bg-accent-soft'
                  : revealed && o.id === scenario.actualOptionId
                    ? 'border-emerald-600/50'
                    : 'border-app hover:border-[var(--accent)]'
              } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <strong>{o.label}</strong>
                {revealed && o.id === scenario.actualOptionId && <Tag>真实历史选择</Tag>}
                {revealed && o.id === chosen && o.id !== scenario.actualOptionId && (
                  <Tag neutral>你的选择</Tag>
                )}
              </div>
              <p className="mt-1.5 text-sm text-muted">{o.hint}</p>
            </button>
          ))}
        </div>
        {previous && (
          <p className="mt-3 text-xs text-muted">
            你之前已完成此场景（选择：{actual && scenario.options.find((o) => o.id === previous.optionId)?.label}）。
            <button className="ml-2 accent hover:underline" onClick={reset}>
              重置重新推演
            </button>
          </p>
        )}
      </Card>

      {/* 第二幕 */}
      {revealed && chosen && (
        <div ref={revealRef} className="space-y-6 scroll-mt-20">
          <div className="rounded-2xl border border-[var(--accent)] p-1 text-center">
            <p className="py-2 font-serif text-lg font-bold">第二幕 · 历史揭晓</p>
          </div>

          <Card className="border-amber-500/40 bg-amber-500/5">
            <p className="label-title">你当时不知道的事</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {scenario.unknownAtTime.map((u, i) => (
                <li key={i} className="flex gap-2">
                  <span>🔎</span>
                  {u}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <p className="label-title">你的选择：{scenario.options.find((o) => o.id === chosen)?.label}</p>
            {(() => {
              const opt = scenario.options.find((o) => o.id === chosen)!
              return (
                <div className="mt-3 space-y-3 text-sm leading-relaxed">
                  <p><strong>风险：</strong>{opt.reveal.risks}</p>
                  <p><strong>各方可能反应：</strong>{opt.reveal.stakeholderReactions}</p>
                  <p className="text-muted">{opt.reveal.counterfactualNote}</p>
                </div>
              )
            })()}
          </Card>

          <Card>
            <p className="label-title">真实历史：{actual.label}</p>
            <p className="mt-3 leading-relaxed">{scenario.actualResult}</p>
          </Card>

          <Card>
            <p className="label-title">历史学家的不同解释</p>
            <ul className="mt-3 space-y-3">
              {scenario.historians.map((h, i) => (
                <li key={i} className="rounded-lg border border-app p-3 text-sm">
                  <strong>{h.view}</strong>
                  {h.note && <span className="text-muted">：{h.note}</span>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <p className="label-title">你的决策可能体现的思维方式</p>
            <p className="mt-2 text-sm leading-relaxed">{scenario.thinkingPrompts[chosen]}</p>
          </Card>

          <Card>
            <p className="label-title">复盘问题（保存在本地档案）</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              {scenario.reflection.map((r, i) => (
                <li key={i}>{i + 1}. {r}</li>
              ))}
            </ul>
            <textarea
              className="input mt-3 min-h-[120px]"
              placeholder="写下你的一条复盘：我的选择基于什么假设？这个假设在现代生活的哪个决定里也出现过？"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              aria-label="决策反思"
            />
            <div className="mt-3 flex items-center gap-3">
              <button className="btn btn-primary" onClick={saveReflection}>
                保存我的决策与反思
              </button>
              {savedFlash && <span className="text-sm text-emerald-600 dark:text-emerald-400">✓ 已保存到我的档案</span>}
            </div>
          </Card>

          <Disclaimer>
            选项分析中的"可能反应"均为基于史料的推测，不是对平行历史的预测。模拟训练的是信息条件下的决策质量意识，而不是结果崇拜。
          </Disclaimer>

          <Card>
            <p className="label-title">史料证据</p>
            <div className="mt-3">
              <EvidenceList evidence={scenario.evidence} />
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Link to={`/person/${scenario.personSlug}`} className="btn btn-ghost">
              阅读 {person?.name} 完整档案
            </Link>
            <Link to="/training/rational-courage" className="btn btn-primary">
              继续：理性勇气训练
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
