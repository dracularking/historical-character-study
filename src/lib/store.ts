import { useSyncExternalStore } from 'react'
import { personRepo, traitRepo, trainingRepo, scenarioRepo } from './repository'

// ============================================================
// 本地学习档案：收藏 / 警惕清单 / 笔记 / 对比 / 模拟记录 / 训练进度
// 全部存于 localStorage，可导出 Obsidian 兼容 Markdown。
// 刻意不做人格标签化打分。
// ============================================================

const STORAGE_KEY = 'hcl-archive-v1'

export interface SavedComparison {
  id: string
  a: string
  b: string
  note: string
  savedAt: string
}

export interface PersonNote {
  markdown: string
  updatedAt: string
}

export interface SimulationRecord {
  scenarioSlug: string
  optionId: string
  reflection?: string
  doneAt: string
}

export interface TrainingProgress {
  startedAt: string
  updatedAt: string
  completedSteps: string[]
  entries: Record<string, string>
  reflection: string
  completed: boolean
}

export interface ArchiveState {
  favoritePeople: string[]
  learningTraits: string[]
  watchWeaknesses: string[]
  notes: Record<string, PersonNote>
  comparisons: SavedComparison[]
  simulations: SimulationRecord[]
  training: Record<string, TrainingProgress>
}

const defaultState: ArchiveState = {
  favoritePeople: [],
  learningTraits: [],
  watchWeaknesses: [],
  notes: {},
  comparisons: [],
  simulations: [],
  training: {},
}

let state: ArchiveState = load()
const listeners = new Set<() => void>()

function load(): ArchiveState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultState)
    const parsed = JSON.parse(raw)
    return { ...structuredClone(defaultState), ...parsed }
  } catch {
    return structuredClone(defaultState)
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 隐私模式或配额不足时静默失败
  }
  listeners.forEach((l) => l())
}

function setState(patch: Partial<ArchiveState>) {
  state = { ...state, ...patch }
  persist()
}

export const archiveStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getState() {
    return state
  },

  togglePerson(slug: string) {
    const set = new Set(state.favoritePeople)
    set.has(slug) ? set.delete(slug) : set.add(slug)
    setState({ favoritePeople: [...set] })
  },
  toggleTrait(slug: string) {
    const set = new Set(state.learningTraits)
    set.has(slug) ? set.delete(slug) : set.add(slug)
    setState({ learningTraits: [...set] })
  },
  toggleWeakness(id: string) {
    const set = new Set(state.watchWeaknesses)
    set.has(id) ? set.delete(id) : set.add(id)
    setState({ watchWeaknesses: [...set] })
  },

  saveNote(slug: string, markdown: string) {
    setState({
      notes: {
        ...state.notes,
        [slug]: { markdown, updatedAt: new Date().toISOString() },
      },
    })
  },
  deleteNote(slug: string) {
    const notes = { ...state.notes }
    delete notes[slug]
    setState({ notes })
  },

  saveComparison(a: string, b: string, note: string) {
    setState({
      comparisons: [
        { id: `${a}__${b}__${Date.now()}`, a, b, note, savedAt: new Date().toISOString() },
        ...state.comparisons,
      ],
    })
  },
  deleteComparison(id: string) {
    setState({ comparisons: state.comparisons.filter((c) => c.id !== id) })
  },

  recordSimulation(scenarioSlug: string, optionId: string, reflection?: string) {
    setState({
      simulations: [
        ...state.simulations.filter((s) => s.scenarioSlug !== scenarioSlug),
        { scenarioSlug, optionId, reflection, doneAt: new Date().toISOString() },
      ],
    })
  },
  resetSimulation(scenarioSlug: string) {
    setState({ simulations: state.simulations.filter((s) => s.scenarioSlug !== scenarioSlug) })
  },

  startTraining(slug: string) {
    if (state.training[slug]) return
    const now = new Date().toISOString()
    setState({
      training: {
        ...state.training,
        [slug]: { startedAt: now, updatedAt: now, completedSteps: [], entries: {}, reflection: '', completed: false },
      },
    })
  },
  saveTrainingEntry(slug: string, stepId: string, text: string) {
    const cur = state.training[slug]
    if (!cur) return
    setState({
      training: {
        ...state.training,
        [slug]: { ...cur, entries: { ...cur.entries, [stepId]: text }, updatedAt: new Date().toISOString() },
      },
    })
  },
  toggleTrainingStep(slug: string, stepId: string) {
    const cur = state.training[slug]
    if (!cur) return
    const steps = new Set(cur.completedSteps)
    steps.has(stepId) ? steps.delete(stepId) : steps.add(stepId)
    setState({
      training: {
        ...state.training,
        [slug]: { ...cur, completedSteps: [...steps], updatedAt: new Date().toISOString() },
      },
    })
  },
  saveTrainingReflection(slug: string, reflection: string) {
    const cur = state.training[slug]
    if (!cur) return
    setState({
      training: {
        ...state.training,
        [slug]: { ...cur, reflection, updatedAt: new Date().toISOString() },
      },
    })
  },
  completeTraining(slug: string) {
    const cur = state.training[slug]
    if (!cur) return
    setState({
      training: {
        ...state.training,
        [slug]: { ...cur, completed: true, updatedAt: new Date().toISOString() },
      },
    })
  },
  resetTraining(slug: string) {
    const training = { ...state.training }
    delete training[slug]
    setState({ training })
  },

  clearAll() {
    state = structuredClone(defaultState)
    persist()
  },
}

export function useArchive(): ArchiveState {
  return useSyncExternalStore(archiveStore.subscribe, archiveStore.getState)
}

// ---------------- Markdown 导出（Obsidian 兼容） ----------------

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN', { hour12: false })
}

export function exportMarkdown(): string {
  const s = state
  const lines: string[] = []
  lines.push('---')
  lines.push('title: 历史人物人格实验室 · 学习档案')
  lines.push(`exported: ${new Date().toISOString()}`)
  lines.push('tags: [历史人物人格实验室, 学习档案]')
  lines.push('---')
  lines.push('')
  lines.push('# 历史人物人格实验室 · 学习档案')
  lines.push('')

  if (s.favoritePeople.length) {
    lines.push('## ⭐ 收藏的人物')
    s.favoritePeople.forEach((slug) => {
      const p = personRepo.bySlug(slug)
      if (p) lines.push(`- [[${p.name}]]（${p.yearLabel}，${p.civilization}）— ${p.oneLiner}`)
    })
    lines.push('')
  }

  if (s.learningTraits.length) {
    lines.push('## 🌱 正在修炼的品质')
    s.learningTraits.forEach((slug) => {
      const t = traitRepo.bySlug(slug)
      if (t) lines.push(`- **${t.name}**：${t.healthy}`)
    })
    lines.push('')
  }

  if (s.watchWeaknesses.length) {
    lines.push('## ⚠️ 警惕的弱点')
    s.watchWeaknesses.forEach((id) => {
      for (const p of personRepo.full()) {
        const w = p.weaknesses?.find((x) => x.id === id)
        if (w) {
          lines.push(`- **${w.name}**（${p.name}）— ${w.manifestation}`)
          break
        }
      }
    })
    lines.push('')
  }

  const noted = Object.entries(s.notes)
  if (noted.length) {
    lines.push('## 📝 人物笔记')
    noted.forEach(([slug, note]) => {
      const p = personRepo.bySlug(slug)
      lines.push(`### ${p?.name ?? slug}`)
      lines.push(`> 更新于 ${fmtDate(note.updatedAt)}`)
      lines.push('')
      lines.push(note.markdown || '（空笔记）')
      lines.push('')
    })
  }

  if (s.comparisons.length) {
    lines.push('## ⚖️ 保存的人物对比')
    s.comparisons.forEach((c) => {
      const a = personRepo.bySlug(c.a)?.name ?? c.a
      const b = personRepo.bySlug(c.b)?.name ?? c.b
      lines.push(`- **${a} vs ${b}**（${fmtDate(c.savedAt)}）${c.note ? `：${c.note}` : ''}`)
    })
    lines.push('')
  }

  if (s.simulations.length) {
    lines.push('## 🎲 决策模拟记录')
    s.simulations.forEach((r) => {
      const sc = scenarioRepo.bySlug(r.scenarioSlug)
      const opt = sc?.options.find((o) => o.id === r.optionId)
      lines.push(`- ${sc?.title ?? r.scenarioSlug}：选择「${opt?.label ?? r.optionId}」（${fmtDate(r.doneAt)}）`)
      if (r.reflection?.trim()) lines.push(`  - 反思：${r.reflection.trim().replace(/\n/g, ' ')}`)
    })
    lines.push('')
  }

  const trainings = Object.entries(s.training)
  if (trainings.length) {
    lines.push('## 🏋️ 品质训练')
    trainings.forEach(([slug, t]) => {
      const mod = trainingRepo.bySlug(slug)
      if (!mod) return
      lines.push(`### ${mod.name}${t.completed ? ' ✅' : '（进行中）'}`)
      lines.push(`开始：${fmtDate(t.startedAt)}｜最近更新：${fmtDate(t.updatedAt)}｜完成步骤：${t.completedSteps.length}/${mod.steps.length}`)
      lines.push('')
      mod.steps.forEach((step) => {
        const val = t.entries[step.id]
        lines.push(`**${step.title}**`)
        lines.push('')
        lines.push(val?.trim() ? val.trim() : '（未填写）')
        lines.push('')
      })
      if (t.reflection?.trim()) {
        lines.push('**阶段反思**')
        lines.push('')
        lines.push(t.reflection.trim())
        lines.push('')
      }
    })
  }

  if (
    !s.favoritePeople.length &&
    !s.learningTraits.length &&
    !s.watchWeaknesses.length &&
    !noted.length &&
    !s.comparisons.length &&
    !s.simulations.length &&
    !trainings.length
  ) {
    lines.push('> 档案还是空的。从收藏一位人物、做一次决策模拟或开始一项品质训练开始吧。')
  }

  return lines.join('\n')
}

export function downloadMarkdown() {
  const md = exportMarkdown()
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `历史人物人格实验室-档案-${new Date().toISOString().slice(0, 10)}.md`
  a.click()
  URL.revokeObjectURL(url)
}
