import { Link } from 'react-router-dom'
import type { Person } from '../../types'
import { Card, Tag, Disclaimer } from '../ui'

export default function OverviewSection({ person }: { person: Person }) {
  const o = person.overview!
  return (
    <div className="space-y-6">
      <Card>
        <p className="label-title">人物总结（≤200字）</p>
        <p className="mt-2 leading-loose">{o.summary}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-[var(--accent)]">
          <p className="font-bold">① 为什么值得研究？</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{o.threeQuestions.whyStudy}</p>
        </Card>
        <Card className="border-l-4 border-l-emerald-600/60">
          <p className="font-bold">② 最值得学习的品质</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{o.threeQuestions.bestTrait}</p>
        </Card>
        <Card className="border-l-4 border-l-rose-600/60">
          <p className="font-bold">③ 最值得警惕的弱点</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{o.threeQuestions.worstWeakness}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="label-title">主要身份</p>
          <ul className="mt-2 space-y-1 text-sm">
            {o.identities.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="label-title">代表成就</p>
          <ul className="mt-2 space-y-1 text-sm">
            {o.achievements.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="label-title">代表思想</p>
          <ul className="mt-2 space-y-1 text-sm">
            {o.ideas.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="label-title">主要历史争议</p>
          <ul className="mt-2 space-y-1 text-sm">
            {o.controversies.map((x) => (
              <li key={x}>· {x}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <p className="label-title">关键人生转折</p>
        <ol className="mt-3 space-y-3 border-l border-app pl-5">
          {o.turningPoints.map((t, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[26px] top-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
              <p className="text-sm font-medium">
                <span className="accent mr-2">{t.year}</span>
                {t.event}
              </p>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <p className="label-title">推荐传记与原始史料</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {o.biographyPicks.map((b) => (
            <li key={b}>
              <Tag neutral>{b}</Tag>
            </li>
          ))}
        </ul>
        <Link to={`/person/${person.slug}?tab=sources`} className="mt-3 inline-block text-sm accent hover:underline">
          查看完整证据与出处 →
        </Link>
      </Card>

      <Disclaimer>
        史料可靠程度：{person.recordNote} 本页所有关键结论均标注 A/B/C/D 证据等级；演说词等重构内容会在出处中注明。
      </Disclaimer>
    </div>
  )
}
