export interface DocMeta {
  id: string
  title: string
  file: string
  blurb: string
  audience: string
}

/** Chinese originals (filenames under public/docs/) */
export const docs: DocMeta[] = [
  {
    id: 'elevator',
    title: '概念层级图谱：从 LLM 到 Agent',
    file: '概念层级图谱_从LLM到Agent.md',
    blurb: 'L0→L6 能力叠加顺序；判断需求落在哪一层、供应商在卖哪一层。',
    audience: '全员入门 · 架构对齐',
  },
  {
    id: 'protocols',
    title: '协议对照表：MCP · A2A · AG-UI · Agent Skills',
    file: '协议对照表_MCP_A2A_AGUI_Skills.md',
    blurb: '各管哪段连接、谁和谁说话、现行版本与治理方，对应图谱 L4–L6。',
    audience: '架构师 · 供应商评估',
  },
  {
    id: 'definitions',
    title: 'Agent / Copilot / Workflow / RAG 定义修订',
    file: 'Agent术语定义_修订提案.md',
    blurb: '根定义 + A/B 正交主轴 + 五个旋钮；可检验判据。',
    audience: '架构师 · 平台治理',
  },
  {
    id: 'selection',
    title: 'AI 需求技术选型手册',
    file: 'AI需求技术选型手册.md',
    blurb: '分诊决策树、六形态组件、打分表、场景库、建设顺序。',
    audience: '方案架构师',
  },
  {
    id: 'cost',
    title: '成本与容量估算（形态 A–F）',
    file: '成本与容量估算.md',
    blurb: 'token / 延迟 / 成本 / 并发的粗算公式与示例算例；成本闸门取值。',
    audience: '方案架构师 · 预算评审',
  },
  {
    id: 'finops',
    title: 'Agent 平台落地与 AI 成本治理（会议要点）',
    file: 'Agent平台落地与AI成本治理_会议要点.md',
    blurb: '平台六层与解耦、自主性与护栏、模型分层/路由/缓存/批处理、FinOps 与预算拆解、自研还是外购。',
    audience: '架构师 · 预算评审 · 管理层',
  },
  {
    id: 'handbook',
    title: '概念讲解手册（给 IT 团队）',
    file: '概念讲解手册_给IT团队.md',
    blurb: '词汇速查 + 十讲易混点 + 该学/先不学清单。',
    audience: 'IT 内训',
  },
  {
    id: 'glossary-book',
    title: '企业级 Agent 平台 · 概念术语提炼',
    file: '企业级Agent平台_概念术语提炼.md',
    blurb: '按十个主题域梳理原书术语（模型、数据、RAG、编排、安全…）。',
    audience: '对照原书深读',
  },
  {
    id: 'ops',
    title: '上线与运维清单',
    file: '上线与运维清单.md',
    blurb: '上线门槛、灰度发布、回滚、模型版本漂移监控、事故分级与复盘模板。',
    audience: '架构 · 运维 · 值班',
  },
]
