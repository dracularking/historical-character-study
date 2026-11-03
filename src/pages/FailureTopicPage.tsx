import { Link } from 'react-router-dom'
import { Card, Tag, Disclaimer } from '../components/ui'

/**
 * 专题：伟人为什么失败？
 * 本页是"解释层"综合：每个案例都链接到带 A/B/C/D 证据分级的深度档案。
 * 原则：决策质量 ≠ 结果质量；人格不单独决定结局（还有制度、环境、运气）；
 * 每个失败模式都配"反证"，防止把复杂历史压成一句成功学口号。
 */

type CaseRef = { slug: string; name: string; anchor?: string; text: string }

type Question = {
  q: string
  tag: string
  cases: CaseRef[]
  counter: string
  lesson: string
}

const questions: Question[] = [
  {
    q: '一、成功本身，会不会就是失败之母？',
    tag: '功勋腐蚀',
    cases: [
      {
        slug: 'alexander',
        name: '亚历山大',
        anchor: '#weaknesses',
        text: '十年从无一败之后，自我神化与制度性傲慢生长：他以君王之礼处决旧臣（菲罗塔斯案），在醉怒中杀死救命恩人克雷塔斯。早期让他赢的极端自信，在约束消失后变成了让身边人恐惧的东西。',
      },
      {
        slug: 'caesar',
        name: '凯撒',
        anchor: '#spectrum',
        text: '档案中的双刃剑分析指出：他的野心在"被体制挤压的局外人"阶段最有建设性，在"无人能制衡的唯一胜者"阶段最有破坏性。关键变量不是野心大小，而是外部约束是否还在。',
      },
    ],
    counter:
      '同一段成功也给了他们学习与资源：亚历山大战役层面的作战审慎终生未失，凯撒屡次从兵变和败战中复位。腐蚀判断的不是"成功"，而是成功之后制衡、反馈与反对声音的消失。',
    lesson: '连胜之后主动保留"说不的人"和可执行的停止规则；把"我一直是对的"当作警报，而不是资产。',
  },
  {
    q: '二、为什么明知该停，却停不下来？',
    tag: '停止规则',
    cases: [
      {
        slug: 'alexander',
        name: '亚历山大',
        anchor: '#decisions',
        text: '海法西斯河畔，继续东进的决定不是被理性否决的，而是被军队哗变否决的——他自己的系统里没有停止键。征服欲在十一年里把军队带到了承诺与后勤的极限。',
      },
    ],
    counter:
      '同时代有人证明"能停"是一种可设计的能力：伯里克利的耐心是"在正确的时间结构里不动"，梭伦则在立法完成后主动退场、拒绝僭主之位。停不下来通常不是意志薄弱，而是事前没有写好退出条件。',
    lesson: '在开局最清醒时预先承诺停止条件（预算、期限、退路），而不是在情绪顶点临场决定。',
  },
  {
    q: '三、一次愤怒，值多少钱？',
    tag: '冲动成本',
    cases: [
      {
        slug: 'alexander',
        name: '亚历山大',
        anchor: '#weaknesses',
        text: '撒马尔罕的酒宴上，愤怒与酒精中的他亲手杀死克雷塔斯——一位救过他命、代表马其顿旧部信任的将领。事后的痛哭无法撤回那一下。冲动造成的不是一场败仗，而是信任资产的永久性折损。',
      },
    ],
    counter:
      '把他的一生展开看，绝大多数战役决策恰恰是计算过的（格拉尼库斯河的"立即强渡"也建立在侦察之上）；凯撒面对兵变时则用共苦与演说化解情绪。可见强者不是没有冲动，而是不让冲动进入不可逆的场景。',
    lesson: '识别自己的"酒精+羞辱+观众"组合触发器；对解雇、决裂、出手这类不可逆决定，强制设置冷静期。',
  },
  {
    q: '四、宽容为什么会失败？',
    tag: '善意的结构',
    cases: [
      {
        slug: 'caesar',
        name: '凯撒',
        anchor: '#weaknesses',
        text: '他以内战中的宽恕（clementia）闻名，大量政敌被赦免并复职——而公元前 44 年 3 月 15 日，刺杀者中多人正是被他宽恕的人。他又过度相信自己的运气与安保，解散了卫队。',
      },
    ],
    counter:
      '宽恕在战争早期真实有效：它分化了敌人、加速了投降，亚历山大善待大流士家属也赢得了帝国治理所需的合法性。宽容失效有具体条件——对方的行动能力未被解除、且博弈被理解为零和的尊严之争。',
    lesson: '善意需要结构保障。区分"和解"与"解除武装"：可以原谅，但不要把制度性的风险敞口留给被原谅者单方面关闭。',
  },
  {
    q: '五、原则无比坚定，为什么反而救不了局？',
    tag: '纯洁的代价',
    cases: [
      {
        slug: 'cato-minor',
        name: '小加图',
        anchor: '#weaknesses',
        text: '他关闭中间方案：公元前 49 年拒绝一切过渡安排，坚持逼凯撒单独解除武装，把对方推过卢比孔河。终其一生符号正确、方案缺席，最后在乌提卡以死明志——道德上赢了，政治上什么也没保住。',
      },
    ],
    counter:
      '同样的"不让步"正是他两千年不倒的理由：他证明了共和体制里有人无法被收买。梭伦则展示了第三种可能——"原则不动、方案可调"，同时顶住贫富两派的相反要求而不破裂。',
    lesson: '立场坚定与方案灵活必须配对。只有立场、没有可执行方案的纯洁，在系统层面等于弃权。',
  },
  {
    q: '六、最聪明、最能适应的人，为什么赢不了长期？',
    tag: '信任赤字',
    cases: [
      {
        slug: 'alcibiades',
        name: '阿尔喀比亚德',
        anchor: '#weaknesses',
        text: '他能"读出任何房间"、战略直觉一流，却把这种灵活性不断变现：被召回受审时叛逃斯巴达，后来又逃回雅典；诺提乌姆失利之后，这座最爱才的城市再也不愿把军队交给他。机会主义造成的信任赤字，是天才也还不清的债。',
      },
    ],
    counter:
      '他确实多次凭真本事东山再起——短期适应力是真实的生存优势。而且雅典民众对"太出众者"的恐惧（陶片放逐的心理土壤）也放大了他的风险：同样的做派在一个制度更厚的环境里未必致命。环境与人格各占一半。',
    lesson: '信任是长期复利账户。每次靠"灵活变现"省下的代价，都会从信用余额里扣；先问这次变现会不会让我失去下次被托付的资格。',
  },
  {
    q: '七、正确的战略，为什么还是输了？',
    tag: '执行与黑天鹅',
    cases: [
      {
        slug: 'pericles',
        name: '伯里克利',
        anchor: '#weaknesses',
        text: '弃陆保海的持久战在军事上成立，却低估了两件事：把全乡人口塞进城墙带来的人道承受力崩溃，以及一场无法预见的瘟疫；更深的问题是战略绑定在他个人身上——他一死，继任者既无威望也无纪律维持同一方案。',
      },
    ],
    counter:
      '战争头三年战略基本奏效，雅典没有被陆军击败；他被民众罢黜后又能被请回来，说明制度仍有纠错弹性。失败不是战略算错，而是没为"最坏情况"和"没有我"做设计。',
    lesson: '检验战略时补两问：最坏情况下人能否承受？我不在了谁能执行？过不了这两关的方案，逻辑再漂亮也不成立。',
  },
  {
    q: '八、理性论证，为什么输给了情绪与民意？',
    tag: '叙事缺位',
    cases: [
      {
        slug: 'alcibiades',
        name: '阿尔喀比亚德',
        anchor: '#decisions',
        text: '公元前 415 年的西西里辩论：尼西阿斯的理性反对没有挡住大会，修昔底德记述民众被对远方的欲望（eros）裹挟。正确的论证输给了被点燃的想象——而最会操纵这团火的阿尔喀比亚德，后来也被同一团情绪反噬。',
      },
      {
        slug: 'pericles',
        name: '伯里克利',
        anchor: '#strengths',
        text: '反例就在同一座城邦：伯里克利生前能用演说管理民主大会的情绪，在家园被烧、民众怒吼时维持持久战。情绪是可被治理的，前提是你愿意走进现场而不是只递上报告。',
      },
    ],
    counter:
      '理性并未真正失败——失败的是"只有理性"。伯里克利的葬礼演说证明：最好的理性主义者同时是最好的叙事者。没有情绪通道的真相，到不了决策者手里。',
    lesson: '提出正确方案时，同时设计它的情绪入口：听众害怕什么、渴望什么、由谁来说。不管理叙事，叙事就会管理你。',
  },
  {
    q: '九、好法律、好规则，为什么落不了地？',
    tag: '执行真空',
    cases: [
      {
        slug: 'solon',
        name: '梭伦',
        anchor: '#weaknesses',
        text: '他订立了影响深远的法律，却刻意不建执行机制、又在立法后离开雅典十年。结果规则在短期内几乎被架空，庇西特拉图的僭主政治接踵而至；晦涩的文风还把法律解释权留给了善于操纵的人。',
      },
    ],
    counter:
      '同一套法律在近百年后成为雅典民主的根基——长期制度成功与短期执行失败同时为真。他的自我退场也避免了自己成为僭主，保护了法律的非人格性。这不是"该不该走"的简单故事，而是落地需要过渡期安排。',
    lesson: '写下来不等于落地。规则发布时要同时交付：谁执行、争议谁解释、过渡期多久、违反会怎样。缺一项，规则就只是文本。',
  },
  {
    q: '十、结局里有多少是运气？伟人也死于黑天鹅吗？',
    tag: '运气与冗余',
    cases: [
      {
        slug: 'alexander',
        name: '亚历山大',
        anchor: '#weaknesses',
        text: '32 岁病逝于巴比伦，帝国立刻因继承真空走向继业者战争。死亡是运气，但"死亡即崩盘"是设计：他把整个国家建在个人身上，没有停止键，也没有继承安排。',
      },
      {
        slug: 'pericles',
        name: '伯里克利',
        anchor: '#weaknesses',
        text: '战争第三年的大瘟疫无法预见，他本人也染疫而亡。再理性的规划也无法把未知病原体列入敌方战斗序列。',
      },
      {
        slug: 'caesar',
        name: '凯撒',
        anchor: '#weaknesses',
        text: '他一生迷信自己的"幸运"（felicitas），这份信念在战场上是士气资产，在安保上却是致命盲点——运气不会因为你过去总赢就继续承保。',
      },
    ],
    counter:
      '凯撒多次在坏运气中复位，说明真正区分人的不是运气好坏，而是坏运气发生时的恢复力；亚历山大死后的崩溃主因是制度设计缺失，不能简单归因于"病死"。',
    lesson: '用"坏运气压力测试"区分能力与运气：这件事失败时我能否恢复？对不可逆的风险（健康、继承、安保、现金流）保留冗余，别用连胜记录给自己开免责条款。',
  },
]

const mechanisms = [
  { mechanism: '制衡消失后的自信膨胀', persons: ['亚历山大', '凯撒'], see: '/person/caesar#spectrum' },
  { mechanism: '没有预设停止规则', persons: ['亚历山大'], see: '/person/alexander#decisions' },
  { mechanism: '情绪进入不可逆决定', persons: ['亚历山大'], see: '/person/alexander#weaknesses' },
  { mechanism: '善意缺少结构保障', persons: ['凯撒'], see: '/person/caesar#weaknesses' },
  { mechanism: '立场与方案脱节', persons: ['小加图', '梭伦'], see: '/person/cato-minor#weaknesses' },
  { mechanism: '灵活性透支信任', persons: ['阿尔喀比亚德'], see: '/person/alcibiades#spectrum' },
  { mechanism: '战略依赖个人在场', persons: ['伯里克利'], see: '/person/pericles#weaknesses' },
  { mechanism: '只讲道理、不管理情绪', persons: ['阿尔喀比亚德', '尼西阿斯'], see: '/simulator/alcibiades-415' },
  { mechanism: '规则发布后的执行真空', persons: ['梭伦'], see: '/person/solon#weaknesses' },
  { mechanism: '对运气的过度信仰', persons: ['凯撒', '亚历山大'], see: '/person/caesar#weaknesses' },
]

export default function FailureTopicPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted">专题研究</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">伟人为什么失败？</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          十个问题，全部取自本库六位有深度档案的人物。每个失败模式都配一条
          <strong className="text-[var(--text)]">反证</strong>
          ——因为历史不是成功学寓言：同一品质在不同约束下既能致胜也能致命，结局还永远掺着制度与运气。
        </p>
      </header>

      <Card className="border-l-4 border-l-[var(--accent)]">
        <h2 className="font-bold">读这篇之前，三条阅读规则</h2>
        <ol className="mt-2 space-y-1.5 text-sm text-muted">
          <li>
            1.&nbsp;<strong className="text-[var(--text)]">决策质量 ≠ 结果质量。</strong>
            坏决策可能侥幸成功，好决策可能被瘟疫毁掉。档案里的每个重大决策都分开评价二者。
          </li>
          <li>
            2.&nbsp;<strong className="text-[var(--text)]">人格不单独决定结局。</strong>
            个人特质之外，始终并列制度、环境、技术、他人行为与随机事件。
          </li>
          <li>
            3.&nbsp;<strong className="text-[var(--text)]">本页是解释，不是事实本身。</strong>
            案例都可点入档案，逐条查看 A/B/C/D 证据分级、出处 locator 与相反解释。
          </li>
        </ol>
      </Card>

      <div className="space-y-4">
        {questions.map((item) => (
          <Card key={item.q}>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{item.q}</h2>
              <Tag neutral>{item.tag}</Tag>
            </div>

            <div className="mt-3 space-y-3">
              {item.cases.map((c) => (
                <div key={c.slug + c.text.slice(0, 8)} className="rounded-lg border border-app p-3">
                  <p className="text-xs font-medium text-muted">案例 ·{' '}
                    <Link
                      to={`/person/${c.slug}${c.anchor ? `${c.anchor}` : ''}`}
                      className="accent hover:underline"
                    >
                      {c.name}
                    </Link>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-sky-600/30 bg-sky-600/5 p-3">
                  <p className="text-xs font-bold text-sky-700 dark:text-sky-400">反证（别急着下结论）</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.counter}</p>
                </div>
                <div className="rounded-lg border border-amber-600/30 bg-amber-600/5 p-3">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400">现实启示</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.lesson}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-bold">十种失败机制速查</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-app text-left text-xs text-muted">
                <th className="py-2 pr-3 font-medium">机制</th>
                <th className="py-2 pr-3 font-medium">相关人物</th>
                <th className="py-2 font-medium">深入</th>
              </tr>
            </thead>
            <tbody>
              {mechanisms.map((m) => (
                <tr key={m.mechanism} className="border-b border-app/60 last:border-0">
                  <td className="py-2 pr-3">{m.mechanism}</td>
                  <td className="py-2 pr-3 text-muted">{m.persons.join('、')}</td>
                  <td className="py-2">
                    <Link to={m.see} className="accent hover:underline">
                      查看 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-accent-soft">
        <h2 className="font-bold">不要只读：把自己放进同一条河</h2>
        <p className="mt-1 text-sm text-muted">
          本专题的结论都可以在决策模拟和品质训练中亲自检验——先在不知道历史结局的情况下做选择，再看机制复盘。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/simulator/rubicon-49" className="btn btn-primary">
            模拟：卢比孔河（约束消失时的选择）
          </Link>
          <Link to="/simulator/alcibiades-415" className="btn btn-ghost">
            模拟：西西里远征（理性与民气）
          </Link>
          <Link to="/training/rational-courage" className="btn btn-ghost">
            训练：理性勇气
          </Link>
          <Link to="/training/self-control" className="btn btn-ghost">
            训练：自控与冲动拦截
          </Link>
          <Link to="/compare?a=alexander&b=caesar" className="btn btn-ghost">
            对比：亚历山大 × 凯撒
          </Link>
        </div>
        <Disclaimer className="mt-4">
          本页为解释层综合，史料依据（阿里安、普鲁塔克、修昔底德、撒路斯提乌斯、苏维托尼乌斯等）及其可靠程度，
          请点入各人物档案的"史料"标签核对。反事实推演均以【推测】标注，不作为既定史实。
        </Disclaimer>
      </Card>
    </div>
  )
}
