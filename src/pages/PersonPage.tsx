import { useParams, Link, useLocation } from 'react-router-dom'
import { personRepo, collectPersonEvidence, traitRepo } from '../lib/repository'
import type { Person } from '../types'
import { useArchive, archiveStore } from '../lib/store'
import { useTabs, Card, Tag, EmptyState } from '../components/ui'
import OverviewSection from '../components/person/OverviewSection'
import StrengthsSection from '../components/person/StrengthsSection'
import WeaknessesSection from '../components/person/WeaknessesSection'
import DecisionsSection from '../components/person/DecisionsSection'
import RelationsSection from '../components/person/RelationsSection'
import NoteBox from '../components/person/NoteBox'
import SpectrumSlider from '../components/SpectrumSlider'
import { EvidenceList } from '../components/Evidence'

const hashToTab: Record<string, string> = {
  '#overview': 'overview',
  '#strengths': 'strengths',
  '#weaknesses': 'weaknesses',
  '#spectrum': 'spectrum',
  '#decisions': 'decisions',
}

export default function PersonPage() {
  const { slug } = useParams()
  const location = useLocation()
  const person = personRepo.bySlug(slug)
  const { favoritePeople } = useArchive()

  // 注意：使用 HashRouter 时必须读 react-router 解析后的 location，
  // window.location.hash 是整段路由（如 "#/person/x#weaknesses"），
  // window.location.search 也拿不到路由内的查询串。
  const initialTab = () => {
    const fromHash = hashToTab[location.hash]
    if (fromHash) return fromHash
    const params = new URLSearchParams(location.search)
    return params.get('tab') ?? 'overview'
  }

  const tabsDef = person
    ? [
        { id: 'overview', label: '概览' },
        ...(person.strengths?.length ? [{ id: 'strengths', label: `优点 ${person.strengths.length}`, badge: person.strengths.length }] : []),
        ...(person.weaknesses?.length ? [{ id: 'weaknesses', label: `弱点 ${person.weaknesses.length}`, badge: person.weaknesses.length }] : []),
        ...(person.spectrums?.length ? [{ id: 'spectrum', label: '双刃剑' }] : []),
        ...(person.decisions?.length ? [{ id: 'decisions', label: `重大决策 ${person.decisions.length}`, badge: person.decisions.length }] : []),
        { id: 'relations', label: '关系' },
        { id: 'notes', label: '笔记' },
        { id: 'sources', label: '史料' },
      ]
    : []

  const tabs = useTabs({ tabs: tabsDef, initial: initialTab() })

  if (!person) {
    return (
      <EmptyState
        title="找不到这位人物"
        desc="可能是链接有误，或者这位人物尚未入库。"
        action={
          <Link to="/explore" className="btn btn-primary">
            返回人物探索
          </Link>
        }
      />
    )
  }

  const fav = favoritePeople.includes(person.slug)
  const allEvidence = collectPersonEvidence(person)

  return (
    <div>
      {/* 头部 */}
      <header className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">{person.name}</h1>
            {person.originalName && <p className="mt-1 text-sm text-muted">{person.originalName}</p>}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/compare?a=${person.slug}&b=caesar`}
              className="btn btn-ghost"
            >
              ⚖️ 对比
            </Link>
            <button
              className={`btn ${fav ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => archiveStore.togglePerson(person.slug)}
              aria-pressed={fav}
            >
              {fav ? '★ 已收藏' : '☆ 收藏'}
            </button>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted">
          {person.yearLabel} · {person.civilization} · {person.eraLabel} · {person.region}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {person.fields.map((f) => (
            <Tag key={f} neutral>
              {f}
            </Tag>
          ))}
          {person.tags.map((t) => (
            <Tag key={t}>
              {t}
            </Tag>
          ))}
          {person.depth === 'full' ? <Tag>完整深度档案</Tag> : <Tag neutral>骨架档案</Tag>}
        </div>
        <p className="mt-4 max-w-3xl text-base italic leading-relaxed">{person.oneLiner}</p>
      </header>

      {tabs.bar}

      {/* Tab 内容 */}
      <div>
        {tabs.active === 'overview' &&
          (person.overview ? (
            <OverviewSection person={person} />
          ) : (
            <BasicProfile person={person} />
          ))}

        {tabs.active === 'strengths' && person.strengths && (
          <StrengthsSection strengths={person.strengths} />
        )}
        {tabs.active === 'weaknesses' && person.weaknesses && (
          <WeaknessesSection weaknesses={person.weaknesses} />
        )}
        {tabs.active === 'spectrum' &&
          (person.spectrums?.length ? (
            <div className="space-y-4">
              {person.spectrums.map((s) => (
                <SpectrumSlider key={s.traitSlug} spectrum={s} />
              ))}
            </div>
          ) : (
            <p className="text-muted">双刃剑分析尚未建设。</p>
          ))}
        {tabs.active === 'decisions' && person.decisions && (
          <DecisionsSection decisions={person.decisions} />
        )}
        {tabs.active === 'relations' && <RelationsSection person={person} />}
        {tabs.active === 'notes' && (
          <div className="space-y-4">
            <NoteBox person={person} />
            {person.reflections && person.reflections.length > 0 && (
              <Card>
                <h3 className="font-bold">三个现实反思问题</h3>
                <ol className="mt-3 space-y-3">
                  {person.reflections.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="accent font-bold">{i + 1}.</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </div>
        )}
        {tabs.active === 'sources' && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold">史料可靠程度总说明</h3>
              <p className="mt-2 text-sm text-muted">{person.recordNote}</p>
            </Card>
            <EvidenceList evidence={allEvidence} />
          </div>
        )}
      </div>
    </div>
  )
}

function BasicProfile({ person: p }: { person: Person }) {
  return (
    <div className="space-y-4">
      <Card className="border-amber-500/40 bg-amber-500/5">
        <h3 className="font-bold">📋 骨架档案 · 深度分析建设中</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          为避免用未经考证的"AI 传记"填充，这位人物目前只提供可核验的基础信息。
          深度档案（优点/弱点十要素、双刃剑、三决策、史料证据）将在考证后补齐。
          你可以先收藏、做笔记，或与已有深度档案的人物进行对比。
        </p>
      </Card>
      <Card>
        <p className="label-title">定位</p>
        <p className="mt-2 leading-relaxed">{p.oneLiner}</p>
        <p className="label-title mt-4">相关品质（可进入品质知识库）</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.traitSlugs.map((slug) => (
            <Link key={slug} to={`/traits/${slug}`} className="chip">
              {traitRepo.bySlug(slug)?.name ?? slug}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
