import {
  people,
  traits,
  sources,
  relationships,
  comparisonPresets,
  scenarios,
  trainingModules,
} from '../data'
import type {
  Person,
  Trait,
  Source,
  PersonRelationship,
  ComparisonPreset,
  Scenario,
  TrainingModule,
  Evidence,
} from '../types'

/**
 * 数据访问层（repository 模式）。
 * 当前实现读取本地静态数据；未来替换为 HTTP API / 数据库时，
 * 只需把这些函数改为 async 调用，组件层签名可平滑迁移。
 */

export const personRepo = {
  all(): Person[] {
    return people
  },
  bySlug(slug: string | undefined): Person | undefined {
    return people.find((p) => p.slug === slug)
  },
  full(): Person[] {
    return people.filter((p) => p.depth === 'full')
  },
  search(query: {
    text?: string
    civilizations?: string[]
    fields?: string[]
    depth?: 'all' | 'full'
  }): Person[] {
    const text = query.text?.trim().toLowerCase()
    return people.filter((p) => {
      if (query.depth === 'full' && p.depth !== 'full') return false
      if (query.civilizations?.length && !query.civilizations.includes(p.civilization)) return false
      if (query.fields?.length && !p.fields.some((f) => query.fields!.includes(f))) return false
      if (!text) return true
      const hay = [
        p.name,
        p.originalName ?? '',
        p.oneLiner,
        p.civilization,
        p.eraLabel,
        p.region,
        ...p.fields,
        ...p.tags,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(text)
    })
  },
  related(personSlug: string): { rel: PersonRelationship; other: Person }[] {
    return relationships
      .filter((r) => r.a === personSlug || r.b === personSlug)
      .map((rel) => {
        const otherSlug = rel.a === personSlug ? rel.b : rel.a
        const other = people.find((p) => p.slug === otherSlug)
        return other ? { rel, other } : null
      })
      .filter((x): x is { rel: PersonRelationship; other: Person } => x !== null)
  },
  /** 同一品质的正/反案例：从 full 人物中按 traitSlug 聚合 */
  byTrait(traitSlug: string): Person[] {
    return people.filter((p) => p.traitSlugs.includes(traitSlug))
  },
}

export const traitRepo = {
  all(): Trait[] {
    return traits
  },
  bySlug(slug: string | undefined): Trait | undefined {
    return traits.find((t) => t.slug === slug)
  },
  linkedSlugs(slug: string): { related: Trait[]; opposite: Trait[] } {
    const t = traits.find((x) => x.slug === slug)
    return {
      related: (t?.related ?? []).map((s) => traits.find((x) => x.slug === s)).filter(Boolean) as Trait[],
      opposite: (t?.opposite ?? []).map((s) => traits.find((x) => x.slug === s)).filter(Boolean) as Trait[],
    }
  },
}

export const sourceRepo = {
  all(): Source[] {
    return sources
  },
  byId(id: string): Source | undefined {
    return sources.find((s) => s.id === id)
  },
}

export const relationshipRepo = {
  all(): PersonRelationship[] {
    return relationships
  },
}

export const comparisonRepo = {
  presets(): ComparisonPreset[] {
    return comparisonPresets
  },
}

export const scenarioRepo = {
  all(): Scenario[] {
    return scenarios
  },
  bySlug(slug: string | undefined): Scenario | undefined {
    return scenarios.find((s) => s.slug === slug)
  },
}

export const trainingRepo = {
  all(): TrainingModule[] {
    return trainingModules
  },
  bySlug(slug: string | undefined): TrainingModule | undefined {
    return trainingModules.find((t) => t.slug === slug)
  },
}

/** 汇总一个人物页面出现过的全部证据，去重后供"史料"标签使用 */
export function collectPersonEvidence(person: Person): Evidence[] {
  const ev: Evidence[] = []
  person.evidence?.forEach((e) => ev.push(e))
  person.strengths?.forEach((s) => s.evidence.forEach((e) => ev.push(e)))
  person.weaknesses?.forEach((w) => w.evidence.forEach((e) => ev.push(e)))
  person.spectrums?.forEach((s) => s.evidence.forEach((e) => ev.push(e)))
  person.decisions?.forEach((d) => d.evidence.forEach((e) => ev.push(e)))
  const seen = new Set<string>()
  return ev.filter((e) => {
    const key = `${e.sourceId}|${e.locator ?? ''}|${e.grade}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
