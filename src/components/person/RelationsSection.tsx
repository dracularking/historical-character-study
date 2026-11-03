import { Link } from 'react-router-dom'
import type { Person } from '../../types'
import { Card, Tag } from '../ui'
import { GradeBadge } from '../Evidence'
import { personRepo } from '../../lib/repository'

const typeLabels: Record<string, string> = {
  'teacher-student': '师生',
  friend: '朋友',
  rival: '政敌/对手',
  ally: '盟友',
  family: '家族/监护',
  'intellectual-heir': '思想继承',
  'direct-influence': '直接影响',
  'indirect-influence': '间接影响',
  parallel: '历史对照',
}

export default function RelationsSection({ person }: { person: Person }) {
  const related = personRepo.related(person.slug)
  if (!related.length) {
    return <p className="text-sm text-muted">已有的结构化关系正在整理中；可先在"人物对比"中自行配对研究。</p>
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">
        <Tag>实线 = 有直接史料</Tag> <Tag neutral className="ml-2">虚线 = 后世思想关联/对照</Tag>{' '}
        （下方以"直接/关联"标注）
      </p>
      {related.map(({ rel, other }, i) => (
        <Card key={i} className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/person/${other.slug}`} className="font-bold hover:accent">
                {other.name}
              </Link>
              <Tag neutral>{typeLabels[rel.type] ?? rel.type}</Tag>
              {rel.direct ? <Tag>直接关系</Tag> : <Tag neutral>思想关联</Tag>}
              <GradeBadge grade={rel.evidenceGrade} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{rel.description}</p>
          </div>
        </Card>
      ))}
      <Card className="bg-accent-soft">
        <p className="text-sm">
          想看到可视化的全量人物知识图谱？这是第二阶段功能（React Flow 可交互图谱）。
          第一阶段先用结构化列表保证关系判断都有证据标注。
        </p>
      </Card>
    </div>
  )
}
