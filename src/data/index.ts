import type { Person } from '../types'
import { alexander } from './people/alexander'
import { caesar } from './people/caesar'
import { solon } from './people/solon'
import { pericles } from './people/pericles'
import { alcibiades } from './people/alcibiades'
import { cato } from './people/cato'
import { basicPeople } from './people-basic'
import { sources } from './sources'
import { traits } from './traits'
import { relationships, comparisonPresets } from './relationships'
import { scenarios } from './scenarios'
import { trainingModules } from './training'

export const people: Person[] = [
  alexander,
  caesar,
  solon,
  pericles,
  alcibiades,
  cato,
  ...basicPeople,
]

export {
  sources,
  traits,
  relationships,
  comparisonPresets,
  scenarios,
  trainingModules,
}

/** 对比维度固定 14 项，评分定义存在每位 full 人物的 comparisonProfile 中 */
export const comparisonDims: string[] = [
  '核心价值观',
  '认知方式',
  '决策风格',
  '情绪管理',
  '自律程度',
  '勇气与风险态度',
  '战略能力',
  '人际关系',
  '学习能力',
  '自我反省',
  '对权力的态度',
  '失败后的反应',
  '历史环境',
  '长期影响',
]

export const civilizationGroups: string[] = Array.from(
  new Set(people.map((p) => p.civilization)),
).sort((a, b) => a.localeCompare(b, 'zh'))

export const fieldOptions: string[] = Array.from(
  new Set(people.flatMap((p) => p.fields)),
).sort((a, b) => a.localeCompare(b, 'zh'))

export const evidenceGradeLabels: Record<string, { label: string; desc: string }> = {
  A: { label: '多源互证', desc: '有多项相对独立的可靠史料支持。' },
  B: { label: '有据有争', desc: '有明确史料，但解释存在争议。' },
  C: { label: '单一/晚出', desc: '主要来自单一、较晚或可靠性有限的来源。' },
  D: { label: '推测类比', desc: '现代推测、反事实或启发性类比，不是史实。' },
}
