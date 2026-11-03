import { Link } from 'react-router-dom'
import { Card, Tag, EmptyState } from '../components/ui'
import { useArchive, archiveStore, downloadMarkdown, exportMarkdown } from '../lib/store'
import { personRepo, traitRepo, scenarioRepo, trainingRepo } from '../lib/repository'

function fmt(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', { hour12: false })
}

export default function ArchivePage() {
  const a = useArchive()
  const total =
    a.favoritePeople.length +
    a.learningTraits.length +
    a.watchWeaknesses.length +
    Object.keys(a.notes).length +
    a.comparisons.length +
    a.simulations.length +
    Object.keys(a.training).length

  const copyMd = async () => {
    const md = exportMarkdown()
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(md)
      } else {
        // 非安全上下文（如 file://）或旧浏览器的回退方案
        const ta = document.createElement('textarea')
        ta.value = md
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      alert('Markdown 已复制到剪贴板，可直接粘贴到 Obsidian。')
    } catch {
      alert('复制失败：浏览器拒绝了剪贴板访问，请改用"导出 Obsidian (.md)"下载文件。')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">我的学习档案</h1>
          <p className="mt-1 text-sm text-muted">
            数据只保存在你的浏览器本地；我们不会根据点击或问卷给你贴人格标签。可编辑、删除、导出。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-ghost" onClick={copyMd}>
            复制 Markdown
          </button>
          <button className="btn btn-primary" onClick={downloadMarkdown}>
            ⬇ 导出 Obsidian (.md)
          </button>
        </div>
      </header>

      {total === 0 ? (
        <EmptyState
          icon="📓"
          title="档案还是空的"
          desc="从收藏一位人物、保存一次对比、完成一次决策模拟或开始一项品质训练开始。"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/explore" className="btn btn-primary">探索人物</Link>
              <Link to="/simulator" className="btn btn-ghost">决策模拟</Link>
              <Link to="/training" className="btn btn-ghost">品质训练</Link>
            </div>
          }
        />
      ) : (
        <>
          {/* 人格成长地图 */}
          <Card>
            <h2 className="mb-3 text-lg font-bold">我的人格成长地图</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="label-title">正在修炼</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.learningTraits.length ? (
                    a.learningTraits.map((s) => {
                      const t = traitRepo.bySlug(s)
                      return (
                        <Link key={s} to={`/traits/${s}`}>
                          <Tag>{t?.name ?? s}</Tag>
                        </Link>
                      )
                    })
                  ) : (
                    <span className="text-sm text-muted">尚未选择品质</span>
                  )}
                </div>
              </div>
              <div>
                <p className="label-title">已完成的练习</p>
                <p className="mt-2 text-sm text-muted">
                  {Object.values(a.training).reduce((n, t) => n + t.completedSteps.length, 0)} 个训练步骤已完成
                </p>
              </div>
              <div>
                <p className="label-title">完成的课程</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(a.training)
                    .filter(([, t]) => t.completed)
                    .map(([slug]) => {
                      const m = trainingRepo.bySlug(slug)
                      return m ? (
                        <Link key={slug} to={`/training/${slug}`}>
                          <Tag>✓ {m.name}</Tag>
                        </Link>
                      ) : null
                    })}
                  {!Object.values(a.training).some((t) => t.completed) && (
                    <span className="text-sm text-muted">还没有结业的课程</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 收藏人物 */}
            <Card>
              <h2 className="mb-3 font-bold">⭐ 收藏的人物（{a.favoritePeople.length}）</h2>
              <ul className="space-y-2">
                {a.favoritePeople.map((slug) => {
                  const p = personRepo.bySlug(slug)
                  if (!p) return null
                  return (
                    <li key={slug} className="flex items-center justify-between gap-2 text-sm">
                      <Link to={`/person/${slug}`} className="hover:accent">
                        {p.name} <span className="text-muted">· {p.civilization}</span>
                      </Link>
                      <button
                        className="text-xs text-muted hover:text-rose-500"
                        onClick={() => archiveStore.togglePerson(slug)}
                      >
                        移除
                      </button>
                    </li>
                  )
                })}
                {!a.favoritePeople.length && <li className="text-sm text-muted">暂无</li>}
              </ul>
            </Card>

            {/* 警惕清单 */}
            <Card>
              <h2 className="mb-3 font-bold">⚠️ 警惕的弱点（{a.watchWeaknesses.length}）</h2>
              <ul className="space-y-2">
                {a.watchWeaknesses.map((id) => {
                  const found = personRepo
                    .full()
                    .map((p) => ({ p, w: p.weaknesses?.find((x) => x.id === id) }))
                    .find((x) => x.w)
                  if (!found?.w) return null
                  return (
                    <li key={id} className="flex items-center justify-between gap-2 text-sm">
                      <Link to={`/person/${found.p.slug}#weaknesses`} className="hover:accent">
                        {found.w.name} <span className="text-muted">· {found.p.name}</span>
                      </Link>
                      <button
                        className="text-xs text-muted hover:text-rose-500"
                        onClick={() => archiveStore.toggleWeakness(id)}
                      >
                        移除
                      </button>
                    </li>
                  )
                })}
                {!a.watchWeaknesses.length && <li className="text-sm text-muted">暂无</li>}
              </ul>
            </Card>
          </div>

          {/* 笔记 */}
          <Card>
            <h2 className="mb-3 font-bold">📝 阅读笔记（{Object.keys(a.notes).length}）</h2>
            <ul className="space-y-2">
              {Object.entries(a.notes).map(([slug, note]) => {
                const p = personRepo.bySlug(slug)
                return (
                  <li key={slug} className="flex items-center justify-between gap-2 text-sm">
                    <Link to={`/person/${slug}?tab=notes`} className="hover:accent">
                      {p?.name ?? slug}
                      <span className="ml-2 text-xs text-muted">{fmt(note.updatedAt)}</span>
                    </Link>
                    <button
                      className="text-xs text-muted hover:text-rose-500"
                      onClick={() => {
                        if (confirm('删除这条笔记？')) archiveStore.deleteNote(slug)
                      }}
                    >
                      删除
                    </button>
                  </li>
                )
              })}
              {!Object.keys(a.notes).length && <li className="text-sm text-muted">暂无</li>}
            </ul>
          </Card>

          {/* 保存的对比 */}
          <Card>
            <h2 className="mb-3 font-bold">⚖️ 保存的对比（{a.comparisons.length}）</h2>
            <ul className="space-y-2">
              {a.comparisons.map((c) => (
                <li key={c.id} className="rounded-lg border border-app p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/compare?a=${c.a}&b=${c.b}`} className="font-medium hover:accent">
                      {personRepo.bySlug(c.a)?.name} vs {personRepo.bySlug(c.b)?.name}
                    </Link>
                    <button
                      className="text-xs text-muted hover:text-rose-500"
                      onClick={() => archiveStore.deleteComparison(c.id)}
                    >
                      删除
                    </button>
                  </div>
                  {c.note && <p className="mt-1 text-muted">{c.note}</p>}
                  <p className="mt-1 text-xs text-muted">{fmt(c.savedAt)}</p>
                </li>
              ))}
              {!a.comparisons.length && <li className="text-sm text-muted">暂无</li>}
            </ul>
          </Card>

          {/* 模拟记录 */}
          <Card>
            <h2 className="mb-3 font-bold">🎲 决策模拟记录（{a.simulations.length}）</h2>
            <ul className="space-y-2">
              {a.simulations.map((r) => {
                const sc = scenarioRepo.bySlug(r.scenarioSlug)
                const opt = sc?.options.find((o) => o.id === r.optionId)
                const isActual = r.optionId === sc?.actualOptionId
                return (
                  <li key={r.scenarioSlug} className="rounded-lg border border-app p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <Link to={`/simulator/${r.scenarioSlug}`} className="font-medium hover:accent">
                        {sc?.title ?? r.scenarioSlug}
                      </Link>
                      {isActual ? <Tag>与历史相同</Tag> : <Tag neutral>不同于历史</Tag>}
                    </div>
                    <p className="mt-1 text-muted">选择：{opt?.label ?? r.optionId} · {fmt(r.doneAt)}</p>
                    {r.reflection && <p className="mt-1 text-xs text-muted">反思：{r.reflection}</p>}
                  </li>
                )
              })}
              {!a.simulations.length && <li className="text-sm text-muted">暂无</li>}
            </ul>
          </Card>

          {/* 训练进度 */}
          <Card>
            <h2 className="mb-3 font-bold">🏋️ 训练进度（{Object.keys(a.training).length}）</h2>
            <ul className="space-y-3">
              {Object.entries(a.training).map(([slug, t]) => {
                const m = trainingRepo.bySlug(slug)
                if (!m) return null
                const pct = Math.round((t.completedSteps.length / m.steps.length) * 100)
                return (
                  <li key={slug}>
                    <div className="flex items-center justify-between text-sm">
                      <Link to={`/training/${slug}`} className="font-medium hover:accent">
                        {m.name} {t.completed ? '✓' : ''}
                      </Link>
                      <span className="text-xs text-muted">
                        {t.completedSteps.length}/{m.steps.length} · {pct}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--border)]">
                      <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                )
              })}
              {!Object.keys(a.training).length && <li className="text-sm text-muted">暂无</li>}
            </ul>
          </Card>

          <Card className="border-rose-500/30">
            <h2 className="mb-2 font-bold">数据管理</h2>
            <p className="text-sm text-muted">所有数据仅存于本浏览器的 localStorage。清除后无法恢复（请先导出）。</p>
            <button
              className="btn btn-ghost mt-3 text-rose-500"
              onClick={() => {
                if (confirm('确定清空全部本地学习档案？建议先导出 Markdown。')) {
                  if (confirm('再次确认：真的清空？此操作不可撤销。')) archiveStore.clearAll()
                }
              }}
            >
              清空全部本地数据
            </button>
          </Card>
        </>
      )}
    </div>
  )
}
