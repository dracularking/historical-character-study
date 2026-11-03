import { useState } from 'react'
import type { PersonWeakness } from '../../types'
import { Card, Tag, Disclaimer } from '../ui'
import { EvidenceRefs } from '../Evidence'
import { useArchive, archiveStore } from '../../lib/store'

export default function WeaknessesSection({ weaknesses }: { weaknesses: PersonWeakness[] }) {
  const [open, setOpen] = useState<string | null>(weaknesses[0]?.id ?? null)
  const { watchWeaknesses } = useArchive()

  return (
    <div className="space-y-4">
      <Disclaimer>
        弱点分析不做现代精神疾病诊断，不做简单道德审判；每条都同时给出"相反解释"与"它是否曾帮助成功"。
      </Disclaimer>
      {weaknesses.map((w) => {
        const isOpen = open === w.id
        const watching = watchWeaknesses.includes(w.id)
        return (
          <Card key={w.id}>
            <button
              className="flex w-full items-start justify-between gap-3 text-left"
              onClick={() => setOpen(isOpen ? null : w.id)}
              aria-expanded={isOpen}
            >
              <div>
                <h3 className="text-lg font-bold">{w.name}</h3>
                <p className="mt-1 text-sm text-muted">{w.manifestation}</p>
              </div>
              <span className="mt-1 text-xl text-muted" aria-hidden>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={watching ? 'chip' : 'chip-neutral hover:border-[var(--accent)]'}
                onClick={() => archiveStore.toggleWeakness(w.id)}
              >
                {watching ? '✓ 已列入我的警惕清单' : '＋ 列入警惕清单'}
              </button>
              {w.biases.map((b) => (
                <Tag key={b} neutral>
                  可能相关偏差：{b}
                </Tag>
              ))}
            </div>

            {isOpen && (
              <div className="mt-5 space-y-5 text-sm leading-relaxed">
                <div className="grid gap-4 md:grid-cols-2">
                  <Block title="② 相关历史事件">
                    <ul className="space-y-1">
                      {w.relatedEvents.map((e) => (
                        <li key={e}>· {e}</li>
                      ))}
                    </ul>
                  </Block>
                  <Block title="④ 可能的情绪与动机">{w.emotionsMotives}</Block>
                  <Block title="⑤ 环境诱因">{w.triggers}</Block>
                  <Block title="③ 可能的认知偏差">
                    <ul className="space-y-1">
                      {w.biases.map((b) => (
                        <li key={b}>· {b}</li>
                      ))}
                    </ul>
                  </Block>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 p-4">
                    <p className="label-title mb-1">⑥ 短期收益</p>
                    <p className="text-muted">{w.shortTermGain}</p>
                  </div>
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4">
                    <p className="label-title mb-1">⑦ 长期代价</p>
                    <p className="text-muted">{w.longTermCost}</p>
                  </div>
                </div>

                <Block title="⭐ 这个缺点是否曾经帮助他成功？">
                  <p className="rounded-lg border border-[var(--accent)] bg-accent-soft p-3">
                    {w.helpedSuccess}
                  </p>
                </Block>

                <Block title="⑧ 相反解释（拒绝单一叙事）">
                  <p className="text-muted">{w.alternativeReading}</p>
                </Block>

                <Block title="⑩ 现代人如何识别和避免">
                  <ul className="space-y-1.5">
                    {w.modernGuardrails.map((g, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="accent">{i + 1}.</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </Block>

                <EvidenceRefs evidence={w.evidence} />
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
