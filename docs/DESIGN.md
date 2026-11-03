# 历史人物人格实验室 · 总体设计文档

> 版本：v0.1（第一阶段实现依据）
> 使命：研究历史人物的优势、弱点、重大决策和人生结果，将历史经验转化为现代人可以实践的智慧。

---

## 1. 设计原则（不可妥协的十条）

1. 学习优点，但不神化人物。
2. 识别缺点，但不做简单的道德审判。
3. 研究成功，也研究失败。
4. 关注行为机制，而不只是人物标签。
5. 每个关键结论区分：**事实 / 记载 / 解释 / 推测 / 争议**。
6. 在历史环境中评价人物，避免现代标准机械套用。
7. 历史智慧必须落到可实践的行动。
8. 允许并保留不同解释（同一事件并列多家说法）。
9. 个人品质之外，始终呈现制度、环境与运气。
10. 不以财富、权力、征服或知名度作为伟大的唯一尺度。

**因果链条（非决定论）：**

```
历史环境 → 人格特质 → 认知模式 → 动机与价值观 → 重大决策 → 行动
        → 实际结果（受运气/制度/资源/他人行为影响）→ 历史评价 → 现代启示
```

---

## 2. 信息架构（站点地图）

```
/                         首页：今日人物 / 品质 / 弱点 / 对比 / 决策挑战 / 学习进度
/explore                  人物探索：全文搜索 + 文明/时代/领域多维筛选
/person/:slug             人物深度档案（核心页面）
  ├─ 概览        模块A：身份、转折、争议、三问、200字总结、推荐史料
  ├─ 优点        模块B：每条优点按 10 要素结构化展开
  ├─ 弱点        模块C：每条弱点按 10 要素结构化展开 + "该缺点是否曾帮助他成功"
  ├─ 双刃剑      模块D：特质强度交互滑块（不足/合理/过度 × 多情境）
  ├─ 重大决策    统一 10 段式决策框架，决策质量与结果质量分离
  ├─ 关系        人物关系（师生/政敌/盟友…，区分直接证据与思想关联）
  └─ 史料        证据卡片 + A/B/C/D 可信度
/compare?a=&b=            对比实验室：并排表 + 雷达图（评分附依据与不确定性）
/traits                   品质知识库：从品质出发研究人物
/traits/:slug             品质详情：定义、正/反案例、边界、心理学、练习
/simulator                决策模拟器：场景列表（先盲选，后揭示）
/simulator/:slug          场景推演：信息条件 → 独立决策 → 真实历史 → 多家解释
/training                 品质训练中心
/training/:slug           训练课程：概念→案例→误区→分步练习→复盘（进度本地保存）
/archive                  我的学习档案：收藏/笔记/对比/训练目标，Markdown 导出
/sources                  史料与证据中心：来源目录、证据分级说明
/topics/failure           专题：伟人为什么失败（10 问 × 案例 × 反证）
/about                    方法论与产品说明：原则、证据协议、医学诊断边界声明、路线图
```

导航栏（桌面多栏 / 移动折叠）：
`人物探索 ｜ 品质图谱 ｜ 人物对比 ｜ 决策模拟 ｜ 训练中心 ｜ 我的档案`
右侧：搜索入口、主题切换（深色默认/浅色）。

> AI 历史研究助手（第三阶段）在 IA 中预留 `/assistant`，第一阶段不实现，不放置空按钮。
> 人物关系**图谱可视化**（React Flow）为第二阶段；第一阶段在人物页提供结构化关系列表。

### 页面原型（线框）

**首页**
```
┌──────────────────────────────────────────────────────────┐
│ 历史人物人格实验室    探索 品质 对比 模拟 训练 档案  🌓 ⌕  │
├──────────────────────────────────────────────────────────┤
│            以历史为镜，认识人性，修炼自己。                  │
│   研究伟人的卓越与局限，从决策、成功与失败中提炼可实践智慧。   │
│        [探索历史人物]  [比较两位人物]  [开始品质训练]        │
├───────────────┬───────────────┬──────────────────────────┤
│ 今日历史人物    │ 今日品质       │ 今日需要警惕的弱点          │
│ （亚历山大）    │ （理性勇气）   │ （成功后的过度自信）         │
├───────────────┴───────────────┴──────────────────────────┤
│ 优点如何变成缺点（双刃剑滑块卡片）│ 最值得研究的人物对比（3组） │
├───────────────────────────────┬──────────────────────────┤
│ 重大历史决策挑战（模拟器入口）   │ 我的学习进度（本地档案）     │
├───────────────────────────────┴──────────────────────────┤
│ 推荐专题：伟人为什么失败                                    │
└──────────────────────────────────────────────────────────┘
```

**人物详情页**
```
┌ 亚历山大（Ἀλέξανδρος） 前356–前323 · 马其顿/古希腊化世界   ☆收藏 │
│ [标签：军事 政治 文化融合]  200字总结 …… 证据等级总览            │
│ 三问卡片：为什么值得研究 / 学什么品质 / 警惕什么弱点             │
├──────────────────────────────────────────────────────────┤
│ 概览 │ 优点 5 │ 弱点 3 │ 双刃剑 │ 重大决策 3 │ 关系 │ 史料 n   │
├──────────────────────────────────────────────────────────┤
│ （优点示例）勇气                                          │
│ ① 精确定义：在信息不充分时……  ② 行为证据：格里内库斯河/印度攻城 │
│ ③ 形成背景 ④ 心理机制 ⑤ 生效条件 ⑥ 成功贡献 ⑦ 适用边界       │
│ ⑧ 可否训练 ⑨ 现代实践（3条）  🔖 证据 [A 阿里安4.8-9]         │
├──────────────────────────────────────────────────────────┤
│ 双刃剑滑块：勇气  ◼────────────●────────  62                  │
│ 情境[战场指挥] 不足：怯战 ｜ 合理：身先士卒 ｜ 过度：单兵突阵     │
└──────────────────────────────────────────────────────────┘
```

**对比页**：左右人物选择器 → 预设组合 chips → 10 维并排表（分数条+依据）→ SVG 雷达图（标注"启发式模型，非心理测量"）→ 自动分析：共同优势/关键差异/共同弱点/不同命运的可能原因 → [保存到我的档案]。

**决策模拟器**：场景卡 → 运行页严格分两幕：第一幕只给"当时可知的信息"与选项；提交选择后第二幕才揭示真实选择、结果、史家分歧、思维方式提示。localStorage 记录防止剧透状态可重置。

---

## 3. 数据模型

数据访问全部经由 `src/lib/repository.ts`，组件不直接 import 数据文件；repository 目前读本地 TS 数据，未来可替换为 HTTP/Prisma 而不改组件。

### 3.1 实体关系

```
Person 1──* PersonStrength（结构化优点，10要素）
Person 1──* PersonWeakness（结构化弱点，10要素）
Person 1──* TraitSpectrum（双刃剑：特质 × 情境 × 不足/合理/过度）
Person 1──* Decision（重大决策，10段式框架）
Person *──* Trait        （人物体现/背离的品质）
Person *──* Person       （PersonRelationship：师生/政敌/盟友…）
Decision 1──* Evidence
任何关键断言 *──* Source  （通过 Evidence）
Trait 1──* TrainingExercise
Scenario 1──* ScenarioOption（模拟器）
UserNote / Favorite / SavedComparison / TrainingProgress  （localStorage）
```

### 3.2 核心实体字段（TypeScript 见 `src/types/index.ts`）

| 实体 | 关键字段 |
|---|---|
| **Person** | slug, name, originalName, born/died（公元前用负数）, civilization, eraLabel, fields[], tags[], depth(`full`/`basic`), oneLiner, traitSlugs[], overview, strengths[], weaknesses[], spectrums[], decisions[], comparisonProfile[], reflections[], evidence[] |
| **PersonOverview** | identities, achievements, turningPoints{year,event}, ideas, controversies, biographyPicks, summary(≤200字), threeQuestions{whyStudy,bestTrait,worstWeakness} |
| **PersonStrength** | traitSlug, preciseDefinition, behaviorEvidence[]{event,detail}, formation, mechanism, conditionsWorks, contribution, boundary, trainable, modernPractice[] —— 对应需求10要素 |
| **PersonWeakness** | name, manifestation, relatedEvents, biases[], emotionsMotives, triggers, shortTermGain, longTermCost, alternativeReading, modernGuardrails[], helpedSuccess —— 对应需求10要素 |
| **TraitSpectrum** | traitSlug + situations[]{situation,deficient,balanced,excessive}；滑块 0–100 映射三段 |
| **Decision** | background, infoConditions{known,unknown,hindsight}, goals{stated,inferred}, alternatives[]{pros,cons}, actualChoice, rationale, outcome{shortTerm,longTerm}, counterfactuals[]{speculative}, modernLessons[], qualityVsLuck{decisionQuality,outcomeQuality,noise}, evidence[], debate[] |
| **Trait** | slug, name, definition, related[], opposite[], healthy/excess/deficient, psychology, exerciseRefs |
| **Source** | id, title, author, dateWritten, type(ancient-primary/literary/inscription/modern/reference), reliability, limitations |
| **Evidence** | sourceId, locator（卷/章/节，绝不编造页码）, excerpt?, grade(A/B/C/D), note |
| **PersonRelationship** | a, b, type, directed, description, evidenceGrade, direct（有直接史料 vs 后世思想关联） |
| **Scenario** | slug, personSlug, title, year, brief, knownInfo[], options[]{label,hint}, reveal{actualOption,risksPerOption,reactions,actualResult,historians[],reflection}, evidence[] |
| **TrainingModule** | slug, traitSlug, concept, positiveCases, negativeCases, psychology, misconceptions[], steps[]{title,instruction,prompt}, applications[], reviewQuestions[] |

### 3.3 内容诚实度约束

- `depth: 'basic'` 的人物只有可核验的骨架信息（年代、文明、领域、一句话、标签），页面明确标注"深度档案建设中"，**不生成虚构传记**。
- 首批 6 位 `full` 人物：**亚历山大、凯撒、梭伦、伯里克利、阿尔喀比亚德、小加图**，每人 5 优点 / 3 弱点 / 3 决策 / 1 双刃剑 / 3 反思问题 / 史料证据。
- 证据 locator 使用通行的卷章节（如"《亚历山大远征记》4.8–4.9"），不杜撰引文与页码；无确证内容给 C/D 级并注明争议。
- 不对任何古人下现代精神疾病诊断；心理学内容只作为"可能的机制类比"。

### 3.4 证据分级（产品内部框架，非学界统一标准）

- **A** 多项相对独立的可靠史料支持。
- **B** 有明确史料，但解释存在争议。
- **C** 主要来自单一、较晚或可靠性有限的来源。
- **D** 现代推测、反事实或启发性类比（明确不是史实）。

---

## 4. 技术架构

- **构建**：Vite 5 + React 18 + TypeScript（strict）；路由 `react-router-dom` HashRouter（静态部署/刷新不 404）。
- **样式**：Tailwind CSS 3，深色默认（`class` 策略），CSS 变量：深海蓝 `#0e2236`、石墨黑 `#0c0f14`、古铜金 `#c2a36b`、象牙白 `#ece6da`；移动端单栏，桌面端多栏。
- **图表**：雷达图/分数条手写 SVG（零依赖、可控、可标注免责声明）；关系图谱（二阶段）再引入 React Flow。
- **持久化**：`src/lib/store.ts` 封装 localStorage：收藏人物/品质、警惕清单、人物笔记（Markdown）、保存的对比、模拟记录、训练进度；档案页一键导出 Obsidian 兼容 Markdown。
- **组件**：自研轻量 UI 原语（Button/Card/Badge/Tabs/Slider/Modal），结构参照 shadcn 习惯，后续可平滑替换。
- **a11y**：语义化标签、键盘可达、aria-label、滑块可聚焦、色彩对比 ≥ AA。

## 5. 阶段计划

| 阶段 | 内容 | 本次状态 |
|---|---|---|
| 一 | 首页、搜索筛选、人物详情（A–D模块+决策框架）、双人对比、史料引用、本地笔记收藏、训练/模拟器最小闭环 | ✅ 实现（6 full 人物 + 46 basic 骨架 + 2 场景 + 2 训练课程） |
| 二 | 关系图谱可视化、时间轴、认知偏差库、品质专题深化、证据/解释多栏对照、更多 full 人物 | ⏳ 数据模型已预留 |
| 三 | AI 研究助手（六类回答标注）、Obsidian 双向同步、数据库迁移、多语言 | ⏜ IA 预留 |

第一阶段验收闭环（全部真实可用）：
**选择亚历山大 → 概览 → 优点/弱点 → 双刃剑滑块 → 查看证据 → 与凯撒对比 → 完成凯撒渡河决策模拟 → 理性勇气训练 → 保存反思（在档案中查看并导出 Markdown）**。
