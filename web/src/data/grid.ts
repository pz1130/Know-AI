export type ALevel = 0 | 1 | 2 | 3
export type BLevel = 0 | 1 | 2 | 3

export const aAxis = [
  { level: 0 as ALevel, label: 'A0', desc: '人决定，系统只提供信息' },
  { level: 1 as ALevel, label: 'A1', desc: '人决定，系统提供草稿或候选' },
  { level: 2 as ALevel, label: 'A2', desc: '系统决定，但只在预定义路径内选分支' },
  { level: 3 as ALevel, label: 'A3', desc: '系统在运行时生成开发者未列举过的路径' },
]

export const bAxis = [
  { level: 0 as BLevel, label: 'B0', desc: '只读，不出系统边界' },
  { level: 1 as BLevel, label: 'B1', desc: '只读，跨系统查询/检索' },
  { level: 2 as BLevel, label: 'B2', desc: '写入自身状态（草稿、记忆、会话）' },
  { level: 3 as BLevel, label: 'B3', desc: '写入外部业务状态（下单、改配置、发消息…）' },
]

/** Map coarse groups used in the classic 2×3 table */
export function cellLabel(a: ALevel, b: BLevel): { title: string; risk: 'low' | 'mid' | 'high' | 'critical'; note: string } {
  const aGroup = a <= 1 ? 'human' : a === 2 ? 'path' : 'runtime'
  const bGroup = b <= 1 ? 'read' : b === 2 ? 'self' : 'biz'

  if (aGroup === 'human' && bGroup === 'read')
    return { title: 'RAG / 只读辅助', risk: 'low', note: '信息供给；人做决策。' }
  if (aGroup === 'human' && bGroup === 'self')
    return { title: 'Copilot 草稿区', risk: 'low', note: '写草稿/记忆，人确认后才外发。' }
  if (aGroup === 'human' && bGroup === 'biz')
    return { title: '带审批的自动化', risk: 'mid', note: '写业务但决策权在人；审批界面必须可理解。' }
  if (aGroup === 'path' && bGroup === 'read')
    return { title: '检索管线', risk: 'low', note: '预定路径的检索与路由。' }
  if (aGroup === 'path' && bGroup === 'self')
    return { title: '有状态流程', risk: 'mid', note: '写死流程 + 内部状态。' }
  if (aGroup === 'path' && bGroup === 'biz')
    return { title: 'Workflow', risk: 'mid', note: '经典工作流；路径可测可审。' }
  if (aGroup === 'runtime' && bGroup === 'read')
    return { title: '研究型 Agent', risk: 'mid', note: '运行时规划路径，但只读。' }
  if (aGroup === 'runtime' && bGroup === 'self')
    return { title: '助理型 Agent', risk: 'high', note: '市面上大量"Agent"落在这里。' }
  return {
    title: 'Agent · 高风险区',
    risk: 'critical',
    note: 'A3×B3：运行时生成路径且写业务状态。真正需要重装治理的只有这一格。',
  }
}

export interface Knob {
  id: string
  name: string
  options: { value: number; label: string }[]
}

export const knobs: Knob[] = [
  {
    id: 'hitl',
    name: '人工介入（HITL）',
    options: [
      { value: 0, label: '无' },
      { value: 1, label: '软提示' },
      { value: 2, label: '终态复核' },
      { value: 3, label: '每动作硬门禁' },
    ],
  },
  {
    id: 'reversibility',
    name: '可逆性',
    options: [
      { value: 0, label: '完全可逆' },
      { value: 1, label: '有补偿' },
      { value: 2, label: '恢复困难' },
      { value: 3, label: '不可逆/对外/资金' },
    ],
  },
  {
    id: 'state',
    name: '状态持有期',
    options: [
      { value: 0, label: '无状态单轮' },
      { value: 1, label: '会话内' },
      { value: 2, label: '跨会话长期' },
    ],
  },
  {
    id: 'auth',
    name: '授权主体',
    options: [
      { value: 0, label: '以用户身份（继承权限）' },
      { value: 1, label: '持委派凭据' },
      { value: 2, label: '以系统/服务账号' },
    ],
  },
  {
    id: 'orchestration',
    name: '编排来源',
    options: [
      { value: 0, label: '开发者写死路径' },
      { value: 1, label: '骨架固定 + 局部生成' },
      { value: 2, label: '模型运行时生成' },
    ],
  },
]

export function portrait(
  a: ALevel,
  b: BLevel,
  knobVals: Record<string, number>,
): string {
  const cell = cellLabel(a, b)
  const hitl = knobs[0].options[knobVals.hitl ?? 0]?.label
  const rev = knobs[1].options[knobVals.reversibility ?? 0]?.label
  const auth = knobs[3].options[knobVals.auth ?? 0]?.label
  const orch = knobs[4].options[knobVals.orchestration ?? 0]?.label

  const warnings: string[] = []
  if (a === 3 && b === 3) warnings.push('处于 A3×B3 高风险区，必须全链路审计 + 补偿/saga')
  if ((knobVals.reversibility ?? 0) >= 2 && a >= 2)
    warnings.push('低可逆性 + 系统决策：强制人工确认门')
  if ((knobVals.auth ?? 0) === 2 && b >= 1)
    warnings.push('服务账号跨系统访问 = 权限并集，本行通常过不了信息安全审查')
  if ((knobVals.hitl ?? 0) === 0 && b === 3)
    warnings.push('写业务却无 HITL，风险不可接受')

  return [
    `【${cell.title}】决策权 ${aAxis[a].label} · 作用域 ${bAxis[b].label}。`,
    cell.note,
    `旋钮：HITL=${hitl}；可逆性=${rev}；授权=${auth}；编排=${orch}。`,
    warnings.length ? `⚠ ${warnings.join('；')}` : '当前旋钮组合未触发硬性否决规则。',
  ].join(' ')
}

export const acceptanceQuestions = [
  {
    q: '关掉 LLM，这个系统还能完成任务吗？',
    yes: '本质是 Workflow，LLM 只是接口糖',
    no: '才进入 A2 以上（模型参与决策路径）',
  },
  {
    q: '能否在不改代码的情况下产生一条开发者从未列举过的动作序列？',
    yes: 'A3：运行时生成路径',
    no: 'A2 或以下：行为空间有限，可逐条测试',
  },
  {
    q: '系统在任意一步失败，业务状态是否可能停在中间态？',
    yes: '达到 B3，必须配套补偿事务或 saga',
    no: '作用域较低，或已设计为原子/可回滚',
  },
  {
    q: '动作日志能否重放，并把每个动作归因到具体的决策依据？',
    yes: '具备上生产的审计前提',
    no: '无论 A/B 多低，都不具备上生产条件',
  },
]
