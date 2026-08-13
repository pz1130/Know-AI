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
]
