export interface ScoreDim {
  id: string
  name: string
  labels: [string, string, string, string]
}

export const scoreDims: ScoreDim[] = [
  {
    id: 'decision',
    name: '1. 决策权',
    labels: ['人决定，系统只提供信息', '系统给草稿，人确认', '系统在写死分支里选', '系统运行时自己生成路径'],
  },
  {
    id: 'scope',
    name: '2. 作用域',
    labels: ['只读，只返回文本', '只读，跨系统查询', '写自己的状态/草稿', '写业务系统或对外发出'],
  },
  {
    id: 'reversibility',
    name: '3. 可逆性',
    labels: ['完全可逆', '有补偿手段', '恢复困难', '不可逆、对外、或涉及资金'],
  },
  {
    id: 'domain',
    name: '4. 域宽度',
    labels: ['单表单接口', '单系统内', '单业务域', '跨业务局'],
  },
  {
    id: 'duration',
    name: '5. 运行时长',
    labels: ['秒级', '分钟级', '小时级', '跨天或异步等待'],
  },
  {
    id: 'data',
    name: '6. 数据就绪度',
    labels: ['已有权威口径定义', '有数仓无统一口径', '有库无数仓', '数据散在各业务系统'],
  },
  {
    id: 'verify',
    name: '7. 可验证性',
    labels: ['有标准答案可自动比对', '可抽检', '只能靠人主观判断', '产出量超过人力审核能力'],
  },
]

export interface ScoreVerdict {
  severity: 'ok' | 'warn' | 'block'
  text: string
}

export function evaluateScores(
  scores: Record<string, number>,
  flags: { classified: boolean; accountability: boolean },
): ScoreVerdict[] {
  const d = (id: string) => scores[id] ?? 0
  const total = scoreDims.reduce((s, dim) => s + d(dim.id), 0)
  const out: ScoreVerdict[] = []

  if (d('scope') >= 2 && d('reversibility') >= 2) {
    out.push({
      severity: 'block',
      text: '维度 2 和 3 同时 ≥2 → 必须有人工确认门和完整审计（硬性）。',
    })
  }
  if (d('reversibility') === 3 && d('decision') >= 2) {
    out.push({
      severity: 'block',
      text: '维度 3=3 且维度 1≥2 → 涉及资金/对外且系统自行决定。本行不予通过，必须降到维度 1≤1。',
    })
  }
  if (d('data') >= 2) {
    out.push({
      severity: 'warn',
      text: '维度 6≥2：若需求属形态 B，应先转为口径治理项目，立项材料写明。',
    })
  }
  if (d('verify') === 3) {
    out.push({
      severity: 'block',
      text: '维度 7=3 → 需求不成立。产出量超过人能审核，意味着没人能发现它错了。',
    })
  }
  if (d('decision') === 3 && d('domain') === 3) {
    out.push({
      severity: 'warn',
      text: '维度 1=3 且 4=3 → 这是研究项目，不是交付项目。不要承诺上线时间。',
    })
  }
  if (total < 6) {
    out.push({
      severity: 'ok',
      text: `七项总分 ${total} < 6 → 别上 Agent，传统方案（规则、模板、流程引擎）更划算也更可靠。`,
    })
  } else {
    out.push({ severity: 'ok', text: `七项总分 ${total}。结合分诊向导与形态卡片细化组件清单。` })
  }
  if (d('duration') >= 2) {
    out.push({
      severity: 'warn',
      text: '维度 5≥2 → 需要断点续跑的编排引擎和状态持久化，排除大部分轻量框架。',
    })
  }
  if (flags.classified) {
    out.push({
      severity: 'block',
      text: '密级触及：权限过滤方案必须先于功能设计定稿。',
    })
  }
  if (flags.accountability) {
    out.push({
      severity: 'block',
      text: '问责敏感（制裁/廉政/申诉/保障认定）：AI 角色上限是资料汇总，不得产出结论。',
    })
  }
  if (out.length === 1 && out[0].text.startsWith('七项总分')) {
    // already have total line
  }
  return out
}
