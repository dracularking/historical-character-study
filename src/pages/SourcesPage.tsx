import { useState } from 'react'
import { Card, Tag, Disclaimer } from '../components/ui'
import { sourceRepo } from '../lib/repository'
import { evidenceGradeLabels } from '../data'

const typeLabels: Record<string, string> = {
  'ancient-primary': '古代原始文献',
  'ancient-literary': '古代叙事/传记',
  inscription: '铭文/纸草',
  modern: '现代研究',
  reference: '工具书/参考',
}

export default function SourcesPage() {
  const sources = sourceRepo.all()
  const [filter, setFilter] = useState<string>('all')
  const types = Array.from(new Set(sources.map((s) => s.type)))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">史料与证据中心</h1>
        <p className="mt-1 text-sm text-muted">
          每条关键结论都挂靠出处；引文定位使用卷/章/节，不杜撰页码；演说词等重构内容会注明。
        </p>
      </header>

      <Card>
        <h2 className="mb-3 font-bold">证据分级（产品内部透明框架，非学界统一标准）</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(['A', 'B', 'C', 'D'] as const).map((g) => (
            <div key={g} className="rounded-lg border border-app p-3">
              <p className="font-bold">
                {g} 级 · {evidenceGradeLabels[g].label}
              </p>
              <p className="mt-1 text-sm text-muted">{evidenceGradeLabels[g].desc}</p>
            </div>
          ))}
        </div>
        <Disclaimer className="mt-4">
          等级评估由本产品的研究整理作出，目的是让读者看到证据强弱，而不是冒充学术定论；同一史料在不同事实点上的可靠度可能不同。
        </Disclaimer>
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">来源使用原则</h2>
        <ul className="space-y-1.5 text-sm text-muted">
          <li>· 优先使用当事人文本、铭文纸草与通行古典文献；古代叙事作者（普鲁塔克等）的道德化与修辞传统会在条目局限中说明。</li>
          <li>· 演说词、对话按史学惯例标注为"重构"，不作为逐字速记引用。</li>
          <li>· 不编造名言、事件、文献与页码；无法核实的内容明确标注 C/D 级或"传说"。</li>
          <li>· 不对历史人物做现代精神疾病诊断；心理学内容仅作为"可能的机制类比"。</li>
        </ul>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        <button className={filter === 'all' ? 'chip' : 'chip-neutral'} onClick={() => setFilter('all')}>
          全部（{sources.length}）
        </button>
        {types.map((t) => (
          <button
            key={t}
            className={filter === t ? 'chip' : 'chip-neutral'}
            onClick={() => setFilter(t)}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sources
          .filter((s) => filter === 'all' || s.type === filter)
          .map((s) => (
            <Card key={s.id}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold">{s.title}</h3>
                <Tag neutral>{typeLabels[s.type]}</Tag>
              </div>
              <p className="mt-1 text-sm text-muted">
                {s.author} · {s.dateWritten}
              </p>
              <p className="mt-2 text-sm">{s.reliability}</p>
              {s.limitations && <p className="mt-2 text-xs text-muted">局限：{s.limitations}</p>}
            </Card>
          ))}
      </div>
    </div>
  )
}
