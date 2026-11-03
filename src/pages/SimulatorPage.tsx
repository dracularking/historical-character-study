import { Link } from 'react-router-dom'
import { Card, Tag, Disclaimer } from '../components/ui'
import { scenarioRepo, personRepo } from '../lib/repository'
import { useArchive } from '../lib/store'

export default function SimulatorPage() {
  const scenarios = scenarioRepo.all()
  const { simulations } = useArchive()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">互动式历史决策模拟器</h1>
        <p className="mt-1 text-sm text-muted">
          "如果你是他，你会怎么选择？" 先在只提供当时信息的情况下独立决策，再揭示真实历史与史家分歧——目的是训练决策思维，而不是预测平行历史。
        </p>
      </header>

      <Disclaimer>
        本模块不会"算分"或假装能预测平行历史。每个选项后的后果分析都标注为推测；你的选择被记录在本地学习档案中，可随时重置。
      </Disclaimer>

      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((s) => {
          const person = personRepo.bySlug(s.personSlug)
          const done = simulations.find((r) => r.scenarioSlug === s.slug)
          return (
            <Card key={s.slug} hover>
              <div className="flex items-start justify-between gap-2">
                <Link to={`/simulator/${s.slug}`}>
                  <h2 className="text-lg font-bold hover:accent">{s.title}</h2>
                </Link>
                {done && <Tag>已完成</Tag>}
              </div>
              <p className="mt-1 text-xs text-muted">
                {person?.name} · {s.year}
              </p>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">{s.brief}</p>
              <Link to={`/simulator/${s.slug}`} className="btn btn-primary mt-4 w-full">
                {done ? '重新推演' : '进入场景'}
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
