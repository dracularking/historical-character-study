import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { personRepo, comparisonRepo } from '../lib/repository'
import { comparisonDims } from '../data'
import type { Person } from '../types'
import { Card, Tag, Disclaimer, EmptyState } from '../components/ui'
import { RadarChart, ScoreBar, Legend, type RadarSeries } from '../components/charts'
import { archiveStore, useArchive } from '../lib/store'

export default function ComparePage() {
  const [params, setParams] = useSearchParams()
  const [a, setA] = useState(params.get('a') ?? 'alexander')
  const [b, setB] = useState(params.get('b') ?? 'caesar')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  useArchive()

  useEffect(() => {
    setParams({ a, b })
  }, [a, b, setParams])

  const pa = personRepo.bySlug(a)
  const pb = personRepo.bySlug(b)
  const people = personRepo.all()
  const presets = comparisonRepo.presets()

  const analysis = useMemo(() => buildAnalysis(pa, pb), [pa, pb])
  const comparable = Boolean(pa?.comparisonProfile && pb?.comparisonProfile)

  const radarData: RadarSeries[] = comparable
    ? [
        { name: pa!.name, color: '#c2a36b', values: pa!.comparisonProfile! },
        { name: pb!.name, color: '#3b82f6', values: pb!.comparisonProfile! },
      ]
    : []

  const save = () => {
    archiveStore.saveComparison(a, b, note.trim())
    setNote('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">历史人物对比实验室</h1>
        <p className="mt-1 text-sm text-muted">
          任选两位人物，按 14 个维度并排比较。评分为研究性启发判断，每条都附依据与不确定性，不是客观精确数据。
        </p>
      </header>

      {/* 预设组合 */}
      <Card>
        <p className="label-title">经典组合</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={`${p.a}-${p.b}`}
              onClick={() => {
                setA(p.a)
                setB(p.b)
              }}
              className={a === p.a && b === p.b ? 'chip' : 'chip-neutral hover:border-[var(--accent)]'}
              title={p.angle + (p.ready ? '' : '（一方暂无深度档案）')}
            >
              {p.title}
              {!p.ready && ' · 骨架'}
            </button>
          ))}
        </div>
      </Card>

      {/* 选择器 */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <PersonSelect label="人物 A" value={a} onChange={setA} />
        <button
          className="btn btn-ghost mx-auto"
          aria-label="交换两人"
          onClick={() => {
            setA(b)
            setB(a)
          }}
        >
          ⇄
        </button>
        <PersonSelect label="人物 B" value={b} onChange={setB} />
      </div>

      {!pa || !pb ? (
        <EmptyState title="请选择两位真实存在于资料库的人物" />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <CompareHeader person={pa} />
            <CompareHeader person={pb} />
          </div>

          {comparable ? (
            <>
              <Card>
                <h2 className="mb-4 text-lg font-bold">14 维度并排比较</h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-app text-left text-muted">
                        <th className="pb-2 pr-2 font-medium">维度</th>
                        <th className="pb-2 pr-2 font-medium">{pa.name}</th>
                        <th className="pb-2 font-medium">{pb.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonDims.map((dim) => {
                        const da = pa.comparisonProfile!.find((x) => x.dim === dim)!
                        const db = pb.comparisonProfile!.find((x) => x.dim === dim)!
                        return (
                          <tr key={dim} className="border-b border-app/60 align-top">
                            <td className="py-3 pr-2 font-medium">{dim}</td>
                            <td className="py-3 pr-2">
                              <ScoreCell d={da} color="#c2a36b" />
                            </td>
                            <td className="py-3">
                              <ScoreCell d={db} color="#3b82f6" />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card>
                <h2 className="mb-2 text-lg font-bold">雷达图</h2>
                <Disclaimer>
                  雷达图是研究性启发工具，用于可视化同一作者基于史料的相对判断；1–5 分不是心理测量值，跨人物的微小差异没有统计意义，请连同每条依据与不确定性一起阅读。
                </Disclaimer>
                <div className="mt-4 max-w-[560px] mx-auto">
                  <RadarChart series={radarData} />
                </div>
                <div className="mt-2 flex justify-center">
                  <Legend items={radarData.map((r) => ({ name: r.name, color: r.color }))} />
                </div>
              </Card>

              <Card>
                <h2 className="mb-4 text-lg font-bold">自动分析</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <AnalysisBox title="共同优势" items={analysis.commonStrengths} tone="good" />
                  <AnalysisBox title="关键差异" items={analysis.keyDiffs} tone="accent" />
                  <AnalysisBox title="共同弱点 / 风险" items={analysis.commonWeaknesses} tone="warn" />
                  <div>
                    <p className="label-title mb-2">不同命运的可能原因（非决定论）</p>
                    <p className="text-sm leading-relaxed text-muted">{analysis.fateNote}</p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <h2 className="font-bold">其中一方尚无深度档案</h2>
              <p className="mt-2 text-sm text-muted">
                为了不把骨架信息包装成"看起来精确"的评分，14 维评分与雷达图仅在双方都有深度档案时开放。
                你仍然可以阅读两人的概览与一句话定位，或选择一组有"深度档案"标记的组合。
              </p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {[pa, pb].map((p) => (
                  <div key={p.slug} className="rounded-lg border border-app p-3 text-sm">
                    <strong>{p.name}</strong>
                    <span className="ml-2">{p.depth === 'full' ? <Tag>深度档案</Tag> : <Tag neutral>骨架档案</Tag>}</span>
                    <p className="mt-2 text-muted">{p.oneLiner}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <h2 className="mb-2 text-lg font-bold">保存这次比较</h2>
            <p className="mb-3 text-xs text-muted">保存后可在"我的档案"中查看与导出。</p>
            <textarea
              className="input min-h-[72px]"
              placeholder={`一句话记录：${pa.name} 和 ${pb.name} 的比较让我想到……`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mt-3 flex items-center gap-3">
              <button className="btn btn-primary" onClick={save}>
                保存到我的档案
              </button>
              {saved && <span className="text-sm text-emerald-600 dark:text-emerald-400">✓ 已保存</span>}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

function PersonSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="label-title">{label}</span>
      <select className="input mt-1" value={value} onChange={(e) => onChange(e.target.value)}>
        {personRepo.all().map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}（{p.yearLabel}）{p.depth === 'basic' ? ' · 骨架' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}

function CompareHeader({ person }: { person: Person }) {
  return (
    <Card hover>
      <Link to={`/person/${person.slug}`} className="block">
        <h3 className="text-lg font-bold hover:accent">{person.name}</h3>
        <p className="text-xs text-muted">
          {person.yearLabel} · {person.civilization}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{person.oneLiner}</p>
      </Link>
    </Card>
  )
}

function ScoreCell({
  d,
  color,
}: {
  d: NonNullable<Person['comparisonProfile']>[number]
  color: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex items-center gap-2">
        <ScoreBar score={d.score} color={color} />
        <button className="text-xs text-muted underline-offset-2 hover:underline" onClick={() => setOpen(!open)}>
          {open ? '收起' : '依据'}
        </button>
      </div>
      {open && (
        <div className="mt-1.5 rounded-md border border-app p-2 text-xs text-muted">
          <p>{d.basis}</p>
          <p className="mt-1 opacity-80">不确定性：{d.uncertainty}</p>
        </div>
      )}
    </div>
  )
}

function AnalysisBox({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'good' | 'warn' | 'accent'
}) {
  const cls =
    tone === 'good'
      ? 'border-emerald-600/30 bg-emerald-600/5'
      : tone === 'warn'
        ? 'border-rose-500/30 bg-rose-500/5'
        : 'border-app bg-accent-soft'
  return (
    <div className={`rounded-lg border p-4 ${cls}`}>
      <p className="label-title mb-2">{title}</p>
      {items.length ? (
        <ul className="space-y-1.5 text-sm">
          {items.map((x, i) => (
            <li key={i}>· {x}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">在 1–5 分阈值内没有显著项——这本身也是信息：差异是程度性的。</p>
      )}
    </div>
  )
}

function buildAnalysis(pa?: Person, pb?: Person) {
  if (!pa?.comparisonProfile || !pb?.comparisonProfile) {
    return { commonStrengths: [], keyDiffs: [], commonWeaknesses: [], fateNote: '' }
  }
  const commonStrengths: string[] = []
  const keyDiffs: string[] = []
  const commonWeaknesses: string[] = []
  comparisonDims.forEach((dim) => {
    const da = pa.comparisonProfile!.find((x) => x.dim === dim)!
    const db = pb.comparisonProfile!.find((x) => x.dim === dim)!
    if (da.score >= 4 && db.score >= 4) commonStrengths.push(`${dim}（${da.score} : ${db.score}）`)
    if (da.score <= 3 && db.score <= 3) commonWeaknesses.push(`${dim}（${da.score} : ${db.score}）`)
    if (Math.abs(da.score - db.score) >= 2) {
      const [hi, lo] = da.score > db.score ? [pa.name, pb.name] : [pb.name, pa.name]
      keyDiffs.push(`${dim}：${hi} 明显强于 ${lo}（${Math.max(da.score, db.score)} : ${Math.min(da.score, db.score)}）`)
    }
  })

  const fateNote =
    `两人的结局差异不能从性格单独推出。${pa.name}（${pa.yearLabel}）与${pb.name}（${pb.yearLabel}）处于不同的制度约束、资源结构与随机事件中：` +
    `请结合"历史环境""对权力的态度""失败后的反应"三项评分阅读，而不是把结果倒推成人格因果。` +
    `——${pa.oneLiner} ｜ ${pb.oneLiner}`

  return { commonStrengths, keyDiffs, commonWeaknesses, fateNote }
}
