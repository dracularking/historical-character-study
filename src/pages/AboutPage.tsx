import { Link } from 'react-router-dom'
import { Card, Tag } from '../components/ui'

const principles = [
  '学习优点，但不神化人物。',
  '识别缺点，但不做简单的道德审判。',
  '研究成功，也研究失败。',
  '关注行为机制，而不只是人物标签。',
  '区分事实、记载、解释、推测与争议。',
  '在历史环境中评价，避免现代标准机械套用。',
  '历史智慧必须落到可实践的行动。',
  '允许并保留不同解释，不搞唯一答案。',
  '个人品质之外，始终呈现制度、环境与运气。',
  '不以财富、权力、征服或知名度作为伟大的唯一尺度。',
]

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">方法论与产品说明</h1>
        <p className="mt-1 text-sm text-muted">
          灵感来自普鲁塔克《希腊罗马名人传》，但范围覆盖世界各文明；目的不是造神，而是建立可以比较、质疑、验证和学习的人格研究系统。
        </p>
      </header>

      <Card>
        <h2 className="mb-3 font-bold">分析链条（非决定论）</h2>
        <div className="overflow-x-auto">
          <div className="flex min-w-[720px] items-center gap-1 text-sm">
            {['历史环境', '人格特质', '认知模式', '动机与价值观', '重大决策', '行动', '实际结果', '历史评价', '现代启示'].map(
              (x, i, arr) => (
                <span key={x} className="flex items-center gap-1">
                  <Tag>{x}</Tag>
                  {i < arr.length - 1 && <span className="text-muted">→</span>}
                </span>
              ),
            )}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">
          结果还受到运气、制度、资源、技术、战争、疾病与其他人行为的影响。本产品在每个重大决策中都单独评价"决策质量"与"结果质量"。
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 font-bold">十条产品原则</h2>
        <ol className="grid gap-2 text-sm md:grid-cols-2">
          {principles.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="accent font-bold">{i + 1}.</span>
              {p}
            </li>
          ))}
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-bold">为什么不做"AI 心理诊断"？</h2>
          <p className="text-sm text-muted">
            古人无法接受现代临床访谈，史料带着作者立场，诊断会制造虚假的确定性。我们只描述行为模式与"可能的心理机制类比"，
            并强制为每个弱点提供"相反解释"。
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">为什么人物有"深度/骨架"之分？</h2>
          <p className="text-sm text-muted">
            与其让 AI 为 50 个人批量生成似是而非的传记，不如先为少量人物建立经过对勘的完整档案。骨架人物只保留可核验信息，
            深度档案持续扩充。
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">数据与隐私</h2>
          <p className="text-sm text-muted">
            第一阶段为纯前端应用：收藏、笔记、模拟与训练记录只存在你的浏览器（localStorage），可随时导出 Markdown（兼容 Obsidian）或清空。
            没有账号，没有服务器收集。
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 font-bold">路线图</h2>
          <ul className="space-y-1 text-sm text-muted">
            <li>· 第二阶段：关系图谱可视化、历史时间轴、认知偏差库、证据/解释多栏对照。</li>
            <li>· 第三阶段：AI 研究助手（回答强制标注事实/解释/推测）、数据库迁移、多语言。</li>
          </ul>
          <Link to="/sources" className="mt-3 inline-block text-sm accent hover:underline">
            查看史料与证据中心 →
          </Link>
        </Card>
      </div>
    </div>
  )
}
