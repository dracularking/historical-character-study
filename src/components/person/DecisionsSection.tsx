import { useState } from 'react'
import type { Decision } from '../../types'
import { Card, Tag, Disclaimer } from '../ui'
import { EvidenceRefs } from '../Evidence'

export default function DecisionsSection({ decisions }: { decisions: Decision[] }) {
  const [open, setOpen] = useState<string | null>(decisions[0]?.id ?? null)

  return (
    <div className="space-y-4">
      <Disclaimer>
        决策质量与结果质量分开评价：好决策可能因运气失败，坏决策也可能走运成功。所有反事实分析均为推测，不是历史事实。
      </Disclaimer>
      {decisions.map((d) => {
        const isOpen = open === d.id
        return (
          <Card key={d.id}>
            <button
              className="flex w-full items-start justify-between gap-3 text-left"
              onClick={() => setOpen(isOpen ? null : d.id)}
              aria-expanded={isOpen}
            >
              <div>
                <h3 className="text-lg font-bold">{d.title}</h3>
                <p className="mt-1 text-sm text-muted">{d.year}</p>
              </div>
              <span className="mt-1 text-xl text-muted" aria-hidden>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="mt-5 space-y-5 text-sm leading-relaxed">
                <Block title="① 历史背景">
                  <p>{d.background}</p>
                </Block>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-app p-3">
                    <p className="label-title mb-1">② 他当时知道</p>
                    <ul className="space-y-1 text-muted">
                      {d.infoConditions.known.map((x, i) => (
                        <li key={i}>· {x}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-app p-3">
                    <p className="label-title mb-1">② 他当时不知道</p>
                    <ul className="space-y-1 text-muted">
                      {d.infoConditions.unknown.map((x, i) => (
                        <li key={i}>· {x}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="label-title mb-1">只有后世知道</p>
                    <ul className="space-y-1 text-muted">
                      {d.infoConditions.hindsight.map((x, i) => (
                        <li key={i}>· {x}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Block title="③ 公开宣称的目标">{d.goals.stated}</Block>
                  <Block title="③ 史家推测的动机">{d.goals.inferred}</Block>
                </div>

                <Block title="④ 当时现实可行的方案">
                  <div className="space-y-2">
                    {d.alternatives.map((a) => (
                      <div key={a.id} className="rounded-lg border border-app p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong>{a.label}</strong>
                          <Tag neutral>{a.feasibility}</Tag>
                        </div>
                        <p className="mt-1.5 text-xs text-muted">利：{a.pros}</p>
                        <p className="mt-0.5 text-xs text-muted">弊：{a.cons}</p>
                      </div>
                    ))}
                  </div>
                </Block>

                <div className="rounded-lg border border-[var(--accent)] bg-accent-soft p-4">
                  <p className="label-title mb-1">⑤ 实际选择</p>
                  <p>{d.actualChoice}</p>
                  <p className="label-title mb-1 mt-3">⑥ 决策逻辑</p>
                  <p className="text-muted">{d.rationale}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Block title="⑦ 短期结果">{d.outcome.shortTerm}</Block>
                  <Block title="⑦ 长期结果">{d.outcome.longTerm}</Block>
                </div>

                <Block title="⑧ 反事实分析（推测，非史实）">
                  <ul className="space-y-2">
                    {d.counterfactuals.map((c, i) => (
                      <li key={i} className="rounded-lg border border-dashed border-app p-3 text-muted">
                        <Tag neutral>
                          {d.alternatives.find((a) => a.id === c.alternativeId)?.label ?? '另一方案'}
                        </Tag>
                        <p className="mt-1.5">{c.text}</p>
                      </li>
                    ))}
                  </ul>
                </Block>

                <Block title="⑨ 现代启示">
                  <ul className="space-y-1.5">
                    {d.modernLessons.map((l, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="accent">▸</span>
                        {l}
                      </li>
                    ))}
                  </ul>
                </Block>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-sky-600/30 bg-sky-600/5 p-3">
                    <p className="label-title mb-1">⑩ 决策质量</p>
                    <p className="text-xs text-muted">{d.qualityVsLuck.decisionQuality}</p>
                  </div>
                  <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-3">
                    <p className="label-title mb-1">⑩ 结果质量</p>
                    <p className="text-xs text-muted">{d.qualityVsLuck.outcomeQuality}</p>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                    <p className="label-title mb-1">运气/噪声</p>
                    <p className="text-xs text-muted">{d.qualityVsLuck.noise}</p>
                  </div>
                </div>

                <Block title="历史学家的不同解释">
                  <ul className="space-y-1.5">
                    {d.debate.map((x, i) => (
                      <li key={i} className="text-muted">
                        · {x}
                      </li>
                    ))}
                  </ul>
                </Block>

                <EvidenceRefs evidence={d.evidence} />
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-title mb-1.5">{title}</p>
      <div className="text-muted">{children}</div>
    </div>
  )
}
