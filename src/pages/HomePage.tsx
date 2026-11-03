import { Link } from 'react-router-dom'
import PersonCard from '../components/PersonCard'
import { Card, Tag } from '../components/ui'
import { personRepo, traitRepo, comparisonRepo, scenarioRepo, trainingRepo } from '../lib/repository'
import { useArchive } from '../lib/store'

function pickOfDay<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

export default function HomePage() {
  const fullPeople = personRepo.full()
  const dayIndex = Math.floor(Date.now() / 86400000)
  const person = pickOfDay(fullPeople, dayIndex)
  const trait = pickOfDay(traitRepo.all(), dayIndex + 2)
  const guardWeakness = person.weaknesses?.[dayIndex % (person.weaknesses?.length ?? 1)]
  const presets = comparisonRepo.presets().filter((p) => p.ready).slice(0, 3)
  const scenario = scenarioRepo.all()[0]
  const training = trainingRepo.all()[0]
  const archive = useArchive()

  const progress = {
    fav: archive.favoritePeople.length,
    notes: Object.keys(archive.notes).length,
    sims: archive.simulations.length,
    training: Object.keys(archive.training).length,
    comparisons: archive.comparisons.length,
  }
  const total = progress.fav + progress.notes + progress.sims + progress.training + progress.comparisons

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-app px-6 py-14 text-center md:px-12 md:py-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(600px 300px at 50% 0%, var(--accent-soft), transparent)',
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="mb-4 text-xs tracking-[0.3em] text-muted">HISTORICAL CHARACTER LAB</p>
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-snug md:text-5xl">
            以历史为镜，<span className="accent">认识人性</span>，修炼自己。
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
            研究伟人的卓越与局限，从他们的决策、成功与失败中，提炼可以实践的人生智慧。
            <br className="hidden md:block" />
            不造神，不审判；区分事实、记载、解释与推测；关注机制，而非标签。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/explore" className="btn btn-primary">
              探索历史人物
            </Link>
            <Link to="/compare?a=alexander&b=caesar" className="btn btn-ghost">
              比较两位人物
            </Link>
            <Link to="/training/rational-courage" className="btn btn-ghost">
              开始品质训练
            </Link>
          </div>
        </div>
      </section>

      {/* 今日三件 */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card hover>
          <p className="label-title">今日历史人物</p>
          <Link to={`/person/${person.slug}`} className="mt-2 block">
            <h3 className="text-lg font-bold hover:accent">{person.name}</h3>
            <p className="text-xs text-muted">{person.yearLabel} · {person.civilization}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed">{person.oneLiner}</p>
          </Link>
        </Card>
        <Card hover>
          <p className="label-title">今日值得学习的品质</p>
          <Link to={`/traits/${trait.slug}`} className="mt-2 block">
            <h3 className="text-lg font-bold hover:accent">{trait.name}</h3>
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{trait.definition}</p>
          </Link>
        </Card>
        <Card hover>
          <p className="label-title">今日需要警惕的弱点</p>
          <Link to={`/person/${person.slug}#weaknesses`} className="mt-2 block">
            <h3 className="text-lg font-bold hover:accent">{guardWeakness?.name ?? '—'}</h3>
            <p className="text-xs text-muted">来自：{person.name}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
              {guardWeakness?.manifestation}
            </p>
          </Link>
        </Card>
      </section>

      {/* 双刃剑 + 对比 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">优点如何变成缺点</h2>
            <Tag>交互</Tag>
          </div>
          <p className="mt-2 text-sm text-muted">
            同一种品质，强度与情境不同，可能是资产，也可能是灾难。
          </p>
          <div className="mt-4 space-y-2">
            {fullPeople
              .filter((p) => p.spectrums?.length)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`/person/${p.slug}#spectrum`}
                  className="flex items-center justify-between rounded-lg border border-app px-4 py-3 text-sm hover:border-[var(--accent)]"
                >
                  <span>
                    <strong>{p.spectrums![0].name.split('：')[0]}</strong>
                    <span className="ml-2 text-muted">· {p.name}</span>
                  </span>
                  <span className="text-muted">拖动滑块 →</span>
                </Link>
              ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">最值得研究的对比</h2>
            <Link to="/compare" className="text-sm accent hover:underline">
              全部 →
            </Link>
          </div>
          <div className="mt-4 space-y-2">
            {presets.map((p) => (
              <Link
                key={`${p.a}-${p.b}`}
                to={`/compare?a=${p.a}&b=${p.b}`}
                className="block rounded-lg border border-app px-4 py-3 hover:border-[var(--accent)]"
              >
                <p className="text-sm font-medium">{p.title}</p>
                <p className="mt-0.5 text-xs text-muted">{p.angle}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {/* 决策挑战 + 训练 + 进度 */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card hover className="lg:col-span-1">
          <p className="label-title">重大历史决策挑战</p>
          <h3 className="mt-2 text-lg font-bold">{scenario.title}</h3>
          <p className="mt-2 line-clamp-4 text-sm text-muted">{scenario.brief}</p>
          <p className="mt-3 text-xs text-muted">先独立决策，再看真实历史——防止事后偏差。</p>
          <Link to={`/simulator/${scenario.slug}`} className="btn btn-primary mt-4 w-full">
            我会怎么选？
          </Link>
        </Card>

        <Card hover>
          <p className="label-title">品质训练</p>
          <h3 className="mt-2 text-lg font-bold">{training.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{training.subtitle}</p>
          <p className="mt-3 text-xs text-muted">6 步工作表练习 · 进度保存在本地</p>
          <Link to={`/training/${training.slug}`} className="btn btn-ghost mt-4 w-full">
            进入训练
          </Link>
        </Card>

        <Card>
          <p className="label-title">我的学习进度</p>
          {total === 0 ? (
            <div className="mt-3">
              <p className="text-sm text-muted">还没有学习记录。</p>
              <p className="mt-1 text-xs text-muted">收藏、做笔记、完成一次模拟或训练后会显示在这里。</p>
              <Link to="/explore" className="btn btn-ghost mt-4 w-full">
                从人物探索开始
              </Link>
            </div>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span className="text-muted">收藏人物</span><strong>{progress.fav}</strong></li>
              <li className="flex justify-between"><span className="text-muted">人物笔记</span><strong>{progress.notes}</strong></li>
              <li className="flex justify-between"><span className="text-muted">决策模拟</span><strong>{progress.sims}</strong></li>
              <li className="flex justify-between"><span className="text-muted">训练课程</span><strong>{progress.training}</strong></li>
              <li className="flex justify-between"><span className="text-muted">保存对比</span><strong>{progress.comparisons}</strong></li>
            </ul>
          )}
          {total > 0 && (
            <Link to="/archive" className="btn btn-ghost mt-4 w-full">
              打开我的档案
            </Link>
          )}
        </Card>
      </section>

      {/* 人物速览 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold">深度研究档案</h2>
            <p className="mt-1 text-sm text-muted">首批 6 位人物，按普鲁塔克式问题做了完整结构化分析；其余人物为可核验骨架档案。</p>
          </div>
          <Link to="/explore" className="text-sm accent hover:underline whitespace-nowrap">
            全部人物 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fullPeople.map((p) => (
            <PersonCard key={p.slug} person={p} />
          ))}
        </div>
      </section>

      <Card className="bg-accent-soft">
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold">特别专题：伟人为什么失败？</h2>
            <p className="mt-1 text-sm text-muted">
              10 个反直觉问题 × 历史案例 × 相反证据：成功后的过度自信、权力的反馈失真、原则如何变成固执。
            </p>
          </div>
          <Link to="/topics/failure" className="btn btn-primary whitespace-nowrap">
            进入专题
          </Link>
        </div>
      </Card>
    </div>
  )
}
