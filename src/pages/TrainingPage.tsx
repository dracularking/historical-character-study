import { Link } from 'react-router-dom'
import { Card, Tag, Disclaimer } from '../components/ui'
import { trainingRepo, traitRepo } from '../lib/repository'
import { useArchive } from '../lib/store'

export default function TrainingPage() {
  const modules = trainingRepo.all()
  const { training } = useArchive()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">个人品质训练中心</h1>
        <p className="mt-1 text-sm text-muted">
          把历史人物的优点转化为可练习的现代能力：概念 → 历史正/反案例 → 认知误区 → 分步工作表练习 → 现实应用 → 定期复盘。进度只保存在你的浏览器中。
        </p>
      </header>

      <Disclaimer>
        训练内容是自我管理与反思工具，不是心理治疗。涉及自伤、暴力、严重情绪困扰时请优先寻求专业帮助（见每门课的安全边界）。
      </Disclaimer>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => {
          const trait = traitRepo.bySlug(m.traitSlug)
          const progress = training[m.slug]
          const done = progress?.completedSteps.length ?? 0
          const pct = progress ? Math.round((done / m.steps.length) * 100) : 0
          return (
            <Card key={m.slug} hover>
              <Link to={`/training/${m.slug}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold hover:accent">{m.name}</h2>
                  {progress?.completed ? <Tag>已完成</Tag> : progress ? <Tag neutral>进行中</Tag> : null}
                </div>
                <p className="mt-1 text-sm text-muted">{m.subtitle}</p>
                {trait && <p className="mt-2 text-xs text-muted">对应品质：{trait.name}</p>}
              </Link>
              {progress && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--border)]">
                    <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {done}/{m.steps.length} 步 · {pct}%
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Card>
        <h2 className="font-bold">规划中的训练主题</h2>
        <p className="mt-2 text-sm text-muted">
          战略思考、长期主义、独立判断、情绪调节、批判性思维、逆境韧性、沟通表达、领导与合作、自我反省、谦逊、原则与灵活性的平衡——
          将随第二、三阶段扩展。你可以先在 <Link to="/traits" className="accent hover:underline">品质图谱</Link> 中收藏想修炼的品质。
        </p>
      </Card>
    </div>
  )
}
