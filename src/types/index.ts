// ============================================================
// 历史人物人格实验室 · 核心数据模型
// 所有页面组件只通过 lib/repository.ts 访问数据，不直接 import 数据集。
// ============================================================

/** 证据可信度等级（产品内部透明评估框架，非学界统一标准） */
export type EvidenceGrade = 'A' | 'B' | 'C' | 'D'

/** 证据：关键结论必须挂靠的出处 */
export interface Evidence {
  /** 对应 Source.id */
  sourceId: string
  /** 卷/章/节等通用定位，绝不写虚构页码 */
  locator?: string
  /** 极短摘录（确有通行译文时使用，否则留空） */
  excerpt?: string
  grade: EvidenceGrade
  /** 出处局限、异文、争议说明 */
  note?: string
}

/** 史料/研究来源 */
export interface Source {
  id: string
  title: string
  author: string
  /** 写作年代，如 "公元2世纪" / "1973" */
  dateWritten: string
  type: 'ancient-primary' | 'ancient-literary' | 'inscription' | 'modern' | 'reference'
  /** 可靠性概述 */
  reliability: string
  /** 来源局限 */
  limitations?: string
  url?: string
}

/** 品质（跨人物知识库） */
export interface Trait {
  slug: string
  name: string
  aliases?: string[]
  /** 精确概念定义 */
  definition: string
  /** 相近品质 slug */
  related: string[]
  /** 相反/互补品质 slug */
  opposite: string[]
  /** 合理表现 */
  healthy: string
  /** 过度表现 */
  excess: string
  /** 不足表现 */
  deficient: string
  /** 心理学机制与研究提示（非诊断） */
  psychology: string
  /** 培养路径概要 */
  cultivation: string
}

export type Trainability = 'high' | 'medium' | 'limited'

/** 模块 B：优点深度解读（10 要素） */
export interface PersonStrength {
  traitSlug: string
  name: string
  /** 1. 精确定义（针对该人物的具体内涵，而非标签） */
  preciseDefinition: string
  /** 2. 历史行为证据 */
  behaviorEvidence: { event: string; detail: string }[]
  /** 3. 形成背景 */
  formation: string
  /** 4. 可能的心理机制（启发式类比，非诊断） */
  mechanism: string
  /** 5. 在什么情况下发挥作用 */
  conditionsWorks: string
  /** 6. 对成功的具体贡献 */
  contribution: string
  /** 7. 适用边界（何时失效甚至有害） */
  boundary: string
  /** 8. 是否能通过训练培养 */
  trainable: Trainability
  trainableNote: string
  /** 9/10. 现代实践方法 */
  modernPractice: string[]
  evidence: Evidence[]
}

/** 模块 C：弱点深度解读（10 要素） */
export interface PersonWeakness {
  id: string
  name: string
  /** 1. 行为表现 */
  manifestation: string
  /** 2. 相关历史事件 */
  relatedEvents: string[]
  /** 3. 可能的认知偏差 */
  biases: string[]
  /** 4. 可能的情绪与动机 */
  emotionsMotives: string
  /** 5. 环境诱因 */
  triggers: string
  /** 6. 短期收益 */
  shortTermGain: string
  /** 7. 长期代价 */
  longTermCost: string
  /** 8. 相反解释（拒绝单一叙事） */
  alternativeReading: string
  /** 9. 这个缺点是否曾帮助人物成功 */
  helpedSuccess: string
  /** 10. 现代人如何识别和避免 */
  modernGuardrails: string[]
  evidence: Evidence[]
}

/** 模块 D：双刃剑情境 */
export interface TraitSituation {
  situation: string
  deficient: string
  balanced: string
  excessive: string
}

export interface TraitSpectrum {
  traitSlug: string
  name: string
  /** 核心命题 */
  thesis: string
  /** 滑块情境：0-33 不足 / 34-66 合理 / 67-100 过度 */
  situations: TraitSituation[]
  evidence: Evidence[]
}

/** 模块 E：重大决策（10 段框架） */
export interface DecisionAlternative {
  id: string
  label: string
  feasibility: string
  pros: string
  cons: string
}

export interface Decision {
  id: string
  title: string
  year: string
  /** 1. 历史背景 */
  background: string
  /** 2. 信息条件 */
  infoConditions: { known: string[]; unknown: string[]; hindsight: string[] }
  /** 3. 决策目标（公开宣称 / 史家推测） */
  goals: { stated: string; inferred: string }
  /** 4. 可选方案 */
  alternatives: DecisionAlternative[]
  /** 5. 实际选择 */
  actualChoice: string
  /** 6. 决策逻辑 */
  rationale: string
  /** 7. 实际结果 */
  outcome: { shortTerm: string; longTerm: string }
  /** 8. 反事实（全部标注推测性质） */
  counterfactuals: { alternativeId: string; text: string }[]
  /** 9. 现代启示 */
  modernLessons: string[]
  /** 10. 决策质量与结果质量分离 */
  qualityVsLuck: { decisionQuality: string; outcomeQuality: string; noise: string }
  /** 史家分歧 */
  debate: string[]
  evidence: Evidence[]
}

/** 模块 A：人物概览 */
export interface PersonOverview {
  identities: string[]
  achievements: string[]
  turningPoints: { year: string; event: string }[]
  ideas: string[]
  controversies: string[]
  biographyPicks: string[]
  /** ≤200 字总结 */
  summary: string
  threeQuestions: { whyStudy: string; bestTrait: string; worstWeakness: string }
}

/** 对比维度评分（1-5，必须附依据与不确定性） */
export interface ComparisonDatum {
  dim: string
  score: number
  basis: string
  uncertainty: string
}

export interface Person {
  slug: string
  name: string
  originalName?: string
  /** 公元前负数，公元后正数；不确定用 null */
  born: number | null
  died: number | null
  yearLabel: string
  civilization: string
  eraLabel: string
  region: string
  fields: string[]
  tags: string[]
  traitSlugs: string[]
  oneLiner: string
  /** full = 完整深度档案；basic = 可核验骨架，不生成深度内容 */
  depth: 'full' | 'basic'
  /** 整体史料可靠程度说明 */
  recordNote: string
  overview?: PersonOverview
  strengths?: PersonStrength[]
  weaknesses?: PersonWeakness[]
  spectrums?: TraitSpectrum[]
  decisions?: Decision[]
  comparisonProfile?: ComparisonDatum[]
  reflections?: string[]
  evidence?: Evidence[]
}

export type RelationshipType =
  | 'teacher-student'
  | 'friend'
  | 'rival'
  | 'ally'
  | 'family'
  | 'intellectual-heir'
  | 'direct-influence'
  | 'indirect-influence'
  | 'parallel'

export interface PersonRelationship {
  a: string
  b: string
  type: RelationshipType
  /** a → b 的说明（directed 时有方向） */
  description: string
  /** true=有直接史料的关系；false=后世建立的思想关联/对照 */
  direct: boolean
  evidenceGrade: EvidenceGrade
  evidence?: Evidence[]
}

export interface ComparisonPreset {
  a: string
  b: string
  title: string
  angle: string
  ready: boolean
}

// ---------- 决策模拟器 ----------

export interface ScenarioOption {
  id: string
  label: string
  /** 选项中允许呈现的、当时可知的利弊提示（克制，不剧透结果） */
  hint: string
  /** 揭示阶段：该选项的风险与各方可能反应（反事实标注为推测） */
  reveal: {
    risks: string
    stakeholderReactions: string
    counterfactualNote: string
  }
}

export interface Scenario {
  slug: string
  personSlug: string
  title: string
  year: string
  brief: string
  /** 第一幕：当时可知的信息 */
  knownInfo: string[]
  /** 第一幕：当时不知道/无法知道的信息（折叠，提交选择后才显示） */
  unknownAtTime: string[]
  options: ScenarioOption[]
  /** 真实历史中的选择，对应 options[].id */
  actualOptionId: string
  actualResult: string
  historians: { view: string; note?: string }[]
  /** 用户决策可能体现的思维方式提示 */
  thinkingPrompts: Record<string, string>
  reflection: string[]
  evidence: Evidence[]
}

// ---------- 品质训练 ----------

export interface TrainingStep {
  id: string
  title: string
  instruction: string
  /** 工作表提示问题，用户文本会保存在本地 */
  prompt: string
}

export interface TrainingModule {
  slug: string
  traitSlug: string
  name: string
  subtitle: string
  concept: string
  positiveCases: { personSlug: string; point: string }[]
  negativeCases: { personSlug: string; point: string }[]
  psychology: string
  misconceptions: string[]
  steps: TrainingStep[]
  applications: string[]
  reviewQuestions: string[]
  readings: string[]
  /** 安全边界：不鼓励的行为 */
  safetyNote: string
}
