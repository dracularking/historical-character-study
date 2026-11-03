import type { PersonRelationship, ComparisonPreset } from '../types'

/**
 * 人物关系。direct=true 表示有同时代史料支持的直接关系；
 * direct=false 表示后世建立的思想关联或历史对照，不作为直接交往呈现。
 */
export const relationships: PersonRelationship[] = [
  // 希腊哲学—征服链
  {
    a: 'socrates', b: 'plato', type: 'teacher-student', direct: true, evidenceGrade: 'B',
    description: '柏拉图是苏格拉底的年轻追随者，老师之死是他全部写作的原点；但对话中的苏格拉底有多少是柏拉图本人，永远无法完全分离。',
  },
  {
    a: 'plato', b: 'aristotle', type: 'teacher-student', direct: true, evidenceGrade: 'B',
    description: '亚里士多德17岁入柏拉图学园，学习近二十年，直到老师去世；"吾爱吾师，吾更爱真理"的归属是后世传统。',
  },
  {
    a: 'aristotle', b: 'alexander', type: 'teacher-student', direct: true, evidenceGrade: 'B',
    description: '亚里士多德约前343年受聘为少年亚历山大的教师之一；其影响程度被古代传记夸大，但荷马史诗的赠书传统是可靠的。',
  },

  // 雅典政治
  {
    a: 'pericles', b: 'alcibiades', type: 'family', direct: true, evidenceGrade: 'B',
    description: '伯里克利是阿尔喀比亚德的监护人之一（其父克雷尼亚斯战死后），被监护人后来成为他战略的掘墓人之一。',
  },
  {
    a: 'socrates', b: 'alcibiades', type: 'teacher-student', direct: true, evidenceGrade: 'C',
    description: '柏拉图《会饮》中阿尔喀比亚德的醉后告白呈现了两人复杂的爱欲—教育关系；苏格拉底后来因"教坏青年"被审判，这段关系是背景之一。',
  },
  {
    a: 'solon', b: 'pericles', type: 'indirect-influence', direct: false, evidenceGrade: 'B',
    description: '梭伦立法是雅典民主制度谱系的起点，伯里克利时代的陪审津贴与公民权都在其延长线上。',
  },
  {
    a: 'solon', b: 'lycurgus', type: 'parallel', direct: false, evidenceGrade: 'C',
    description: '普鲁塔克将两位立法者对照：一个用法律解放城邦活力，一个用制度冻结社会。',
  },

  // 亚历山大圈
  {
    a: 'alexander', b: 'caesar', type: 'parallel', direct: false, evidenceGrade: 'B',
    description: '普鲁塔克《名人传》正是把亚历山大与凯撒配对立传；凯撒在西班牙读到亚历山大雕像时感叹"在我这个年纪他已征服世界"的轶事见苏维托尼乌斯。',
  },
  {
    a: 'alexander', b: 'themistocles', type: 'indirect-influence', direct: false, evidenceGrade: 'C',
    description: '地米斯托克利建立的雅典海军传统与希波战争经验，是马其顿军队面对波斯时的希腊军事遗产的一部分。',
  },

  // 罗马共和晚期
  {
    a: 'caesar', b: 'pompey', type: 'rival', direct: true, evidenceGrade: 'B',
    description: '前三头盟友→内战对手。法萨卢斯后庞培逃亡埃及被杀，凯撒追至时见到的是他的头颅与戒指。',
  },
  {
    a: 'caesar', b: 'cato-minor', type: 'rival', direct: true, evidenceGrade: 'B',
    description: '近二十年的制度性对抗：小加图在每一个程序节点阻击凯撒，凯撒以宽容和《反加图》两线应对，最终输给一具尸体的符号力量。',
  },
  {
    a: 'caesar', b: 'mark-antony', type: 'ally', direct: true, evidenceGrade: 'B',
    description: '安东尼是凯撒最信任的军事副手与执政官同僚；凯撒遇刺后他的葬礼演说是局势转折，也是后三头与奥古斯都崛起的起点。',
  },
  {
    a: 'caesar', b: 'augustus', type: 'family', direct: true, evidenceGrade: 'B',
    description: '屋大维是凯撒甥孙，被遗嘱收为养子与主要继承人；他继承了名字、军队债务与政治路线，但学会了养父没有的"收手"。',
  },
  {
    a: 'cato-minor', b: 'pompey', type: 'ally', direct: true, evidenceGrade: 'B',
    description: '小加图最终支持庞培，把他当作阻止凯撒的较小之恶；这桩功利婚姻是共和派道德纯洁的重要裂缝。',
  },
  {
    a: 'cicero', b: 'cato-minor', type: 'ally', direct: true, evidenceGrade: 'B',
    description: '哲学与政治上的同盟，但西塞罗书信中对加图的固执多有抱怨；他写《加图颂》，也在现实中不断寻找加图拒绝的中间路线。',
  },
  {
    a: 'cicero', b: 'caesar', type: 'rival', direct: true, evidenceGrade: 'B',
    description: '内战中被迫站队庞培、受凯撒赦免后回到写作；他选择活下去并原谅，加图选择不活——两条路线的对照。',
  },
  // 斯多葛跨时代
  {
    a: 'zeno-citium', b: 'seneca', type: 'intellectual-heir', direct: false, evidenceGrade: 'B',
    description: '塞涅卡用拉丁语散文把芝诺创立的斯多葛变成罗马统治阶层可实践的伦理学。',
  },
  {
    a: 'seneca', b: 'marcus-aurelius', type: 'intellectual-heir', direct: false, evidenceGrade: 'B',
    description: '《沉思录》多次引用或呼应塞涅卡；皇帝哲学家是斯多葛"德性可在任何位置实践"命题的终极测试。',
  },
  {
    a: 'epictetus', b: 'marcus-aurelius', type: 'intellectual-heir', direct: false, evidenceGrade: 'B',
    description: '奴隶与皇帝共享同一套哲学：《沉思录》明确承认爱比克泰德的教导。',
  },
  {
    a: 'cato-minor', b: 'seneca', type: 'indirect-influence', direct: false, evidenceGrade: 'C',
    description: '塞涅卡多次把小加图作为斯多葛圣贤的政治范型书写，帮助把一个失败的共和派变成帝国时代的道德资源。',
  },

  // 中国思想链
  {
    a: 'kongzi', b: 'mengzi', type: 'intellectual-heir', direct: false, evidenceGrade: 'B',
    description: '孟子受业于子思门人一系，自称"乃所愿则学孔子"，把孔子的仁发展为性善论与仁政说。',
  },
  {
    a: 'laozi', b: 'kongzi', type: 'parallel', direct: false, evidenceGrade: 'D',
    description: '《史记》载孔子问礼于老子，但两人生卒与该故事的历史性都不可考；作为儒道两种人生路径的对照，其象征意义大于史实意义。',
  },
  {
    a: 'mozi', b: 'kongzi', type: 'rival', direct: false, evidenceGrade: 'B',
    description: '墨学在战国初与儒学并为"显学"，《墨子·非儒》对儒家的礼乐与命观提出系统批评。',
  },
  {
    a: 'shangyang', b: 'qinshihuang', type: 'indirect-influence', direct: false, evidenceGrade: 'B',
    description: '商鞅死后约百年，其变法塑造的秦国机器由秦始皇使用；韩非—李斯—商鞅的法家线索是秦制的思想骨架。',
  },
  {
    a: 'xiangyu', b: 'liubang', type: 'rival', direct: true, evidenceGrade: 'B',
    description: '楚汉相争：项羽赢得几乎每一场会战，刘邦赢得联盟、后勤与人才分配，垓下一战定局。',
  },
  {
    a: 'hanxin', b: 'liubang', type: 'ally', direct: true, evidenceGrade: 'C',
    description: '韩信由萧何举荐登坛拜将，是刘邦军事胜利的第一执行者，汉朝建立后被以谋反罪诛——"狡兔死，走狗烹"的原型叙事。',
  },
  {
    a: 'caocao', b: 'zhugeliang', type: 'rival', direct: false, evidenceGrade: 'C',
    description: '两人在赤壁前后阵营对立但几乎未曾直接交手；《三国演义》中的大量对手戏是文学创作。',
  },

  // 跨文明/后世影响
  {
    a: 'augustus', b: 'napoleon', type: 'indirect-influence', direct: false, evidenceGrade: 'C',
    description: '拿破仑刻意以凯撒—奥古斯都谱系自我定位，同时从罗马皇帝的边界错误中学习（或未能学习）。',
  },
]

/** 经典对比预设；ready=false 表示至少一方尚无深度档案，对比页会提示以骨架信息进行。 */
export const comparisonPresets: ComparisonPreset[] = [
  { a: 'alexander', b: 'caesar', title: '亚历山大 vs 凯撒', angle: '雄心与权力：征服的天才与内战的边界', ready: true },
  { a: 'solon', b: 'lycurgus', title: '梭伦 vs 莱库古', angle: '制度与治理：解放活力还是冻结社会', ready: false },
  { a: 'pericles', b: 'caesar', title: '伯里克利 vs 凯撒', angle: '制度内的第一公民与跨过制度的人', ready: true },
  { a: 'socrates', b: 'kongzi', title: '苏格拉底 vs 孔子', angle: '道德教育：诘问与修身', ready: false },
  { a: 'plato', b: 'aristotle', title: '柏拉图 vs 亚里士多德', angle: '知识方法：理念与观察', ready: false },
  { a: 'liubang', b: 'xiangyu', title: '刘邦 vs 项羽', angle: '领导与用人：制度对勇武', ready: false },
  { a: 'caocao', b: 'zhugeliang', title: '曹操 vs 诸葛亮', angle: '战略与组织：现实主义对理想主义（注意小说叙事干扰）', ready: false },
  { a: 'marcus-aurelius', b: 'seneca', title: '马可·奥勒留 vs 塞涅卡', angle: '斯多葛实践：皇位与权术', ready: false },
  { a: 'newton', b: 'einstein', title: '牛顿 vs 爱因斯坦', angle: '科学创造力：综合与重构', ready: false },
  { a: 'alcibiades', b: 'cato-minor', title: '阿尔喀比亚德 vs 小加图', angle: '没有锚的才华与只有锚的立场', ready: true },
  { a: 'alexander', b: 'alcibiades', title: '亚历山大 vs 阿尔喀比亚德', angle: '被接受的越界者与被驱逐的越界者', ready: true },
]
