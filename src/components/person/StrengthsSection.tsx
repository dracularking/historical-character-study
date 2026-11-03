import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PersonStrength } from '../../types'
import { Card, Tag, Disclaimer } from '../ui'
import { EvidenceRefs } from '../Evidence'
import { useArchive, archiveStore } from '../../lib/store'

const trainableLabel = { high: '较可训练', medium: '部分可训练', limited: '训练空间有限' }

export default function StrengthsSection({ strengths }: { strengths: PersonStrength[] }) {
  const [open, setOpen] = useState<string | null>(strengths[0]?.traitSlug ?? null)
  const { learningTraits } = useArchive()

  return (
    <div className="space-y-4">
      <Disclaimer>
        每条品质按 10 个要素展开：定义、行为证据、形成背景、心理机制、生效条件、成功贡献、适用边界、可训练性、现代实践。心理机制为启发性类比，不构成对古人的心理诊断。
      </Disclaimer>
      {strengths.map((s) => {
        const isOpen = open === s.traitSlug
        const learning = learningTraits.includes(s.traitSlug)
        return (
          <Card key={s.traitSlug}>
            <button
              className="flex w-full items-start justify-between gap-3 text-left"
              onClick={() => setOpen(isOpen ? null : s.traitSlug)}
              aria-expanded={isOpen}
            >
              <div>
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted">{s.preciseDefinition}</p>
              </div>
              <span className="mt-1 text-xl text-muted" aria-hidden>
                {isOpen ? '−' : '+'}
              </span>
            </button>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link to={`/traits/${s.traitSlug}`} className="chip">
                品质知识库：{s.name.split('的')[0] ?? s.name}
              </Link>
              <Tag neutral>可训练性：{trainableLabel[s.trainable]}</Tag>
              <button
                className={learning ? 'chip' : 'chip-neutral hover:border-[var(--accent)]'}
                onClick={() => archiveStore.toggleTrait(s.traitSlug)}
              >
                {learning ? '✓ 已加入我的修炼' : '＋ 加入修炼'}
              </button>
            </div>

            {isOpen && (
              <div className="mt-5 space-y-5 text-sm leading-relaxed">
                <Block title="② 历史行为证据">
                  <ul className="space-y-2">
                    {s.behaviorEvidence.map((e, i) => (
                      <li key={i}>
                        <strong className="accent">{e.event}：</strong>
                        {e.detail}
                      </li>
                    ))}
                  </ul>
                </Block>
                <div className="grid gap-4 md:grid-cols-2">
                  <Block title="③ 形成背景">{s.formation}</Block>
                  <Block title="④ 可能的心理机制（非诊断）">{s.mechanism}</Block>
                  <Block title="⑤ 在什么情况下发挥作用">{s.conditionsWorks}</Block>
                  <Block title="⑥ 对成功的具体贡献">{s.contribution}</Block>
                </div>
                <Block title="⑦ 适用边界（何时失效甚至有害）">
                  <p className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">{s.boundary}</p>
                </Block>
                <Block title="⑧ 是否能通过训练培养">
                  <p>{s.trainableNote}</p>
                </Block>
                <Block title="⑨/⑩ 现代生活实践方法">
                  <ul className="space-y-1.5">
                    {s.modernPractice.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="accent">{i + 1}.</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </Block>
                <EvidenceRefs evidence={s.evidence} />
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
