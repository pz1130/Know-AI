export interface Morphology {
  id: string
  letter: string
  name: string
  short: string
  typical: string[]
  must: string[]
  optional: string[]
  products: string[]
  duration: string
  dissuade: string[]
  notes: string[]
  layer: string
}

export const morphologies: Morphology[] = [
  {
    id: 'A',
    letter: 'A',
    name: '知识问答',
    short: '只读 · 非结构化',
    typical: [
      '采购指南 / 业务手册可问',
      '历年评估与评价发现检索',
      '保障政策条款咨询',
      '董事会决议与先例（密级硬约束）',
    ],
    must: ['文档解析/OCR', '切分', '向量库', 'Embedding', '检索+重排', '大模型', '引用溯源', '权限过滤（检索层）'],
    optional: ['查询改写', '多语言', '知识图谱（关系推理时）'],
    products: ['Milvus / Qdrant / pgvector', 'BGE / Conan', 'MinerU / PaddleOCR', 'Dify / RAGFlow'],
    duration: '2–6 周（不含文档整理与密级梳理）',
    dissuade: ['文档不到百篇且少更新，全文塞进上下文即可', '多版本政策无人说清哪版有效，先做文件治理'],
    notes: ['时间黑洞在文档清洗和密级标注，不在技术', 'RAGFlow 取其解析与溯源；不要按旧 GraphRAG 按钮规划'],
    layer: 'L2-A',
  },
  {
    id: 'B',
    letter: 'B',
    name: '数据问答',
    short: '只读 · 结构化',
    typical: ['说话方式查组合数据', '项目支付进度', '成果指标汇总', '联合融资统计'],
    must: ['数据源接入', '语义层（口径）', 'NL2SQL', 'SQL 沙箱', '可视化', '口径溯源'],
    optional: ['自动探索', '归因分析', '异动检测'],
    products: ['Doris / StarRocks / ClickHouse / DuckDB', 'Cube / MetricFlow', 'Vanna / DB-GPT / WrenAI'],
    duration: '语义层就绪 4–8 周；否则先 3–6 个月口径治理',
    dissuade: ['固定几张报表，参数化模板一周搞定', '字段无注释或迁移遗留，先补元数据'],
    notes: [
      '六种形态失败率最高：几乎总是口径问题',
      '金额/币种汇率/时间/归属/状态五层口径分歧',
      '对外材料必须隔断并标注内部参考',
    ],
    layer: 'L2-B',
  },
  {
    id: 'C',
    letter: 'C',
    name: '辅助生成',
    short: '人在终点确认',
    typical: ['概念说明草稿', '督导任务报告初稿', '国别简报', '董事会文件摘要'],
    must: ['大模型', '提示词模板与版本', '上下文注入', '可编辑人工界面'],
    optional: ['检索同类历史项目', '机构文风模板库', '多版本对比'],
    products: ['模型 API + 网关', 'Dify 等快速搭界面'],
    duration: '1–3 周',
    dissuade: [],
    notes: ['建议作为第一个 AI 项目', '输入材料密级可能很高，部署与出境第一项目就定'],
    layer: 'L1（+L2）',
  },
  {
    id: 'D',
    letter: 'D',
    name: '流程自动化',
    short: '路径固定 · 会写业务数据',
    typical: ['提款单据完整性核对与录入', '采购公告分类归档', '合同要素抽取入库'],
    must: ['触发器', '流程编排', '接口封装', '幂等键', '重试/告警', '审计日志'],
    optional: ['大模型，仅个别节点'],
    products: ['Temporal / Camunda / n8n / Airflow', '抽取节点调模型 API'],
    duration: '3–8 周（主要在对接老系统）',
    dissuade: ['借款国材料格式不可控，先拿真实样本测试', '没有 API 只能爬界面，先评估维护与审计成本'],
    notes: ['LLM 通常只出现在 1–2 个节点', '不要一上来就用 Agent 框架'],
    layer: 'L3–L4',
  },
  {
    id: 'E',
    letter: 'E',
    name: '限域自主 Agent',
    short: '路径不定 · 域窄',
    typical: ['支付停滞原因排查', '采购投诉先例检索+分类', '保障政策自查清单'],
    must: [
      'Agent Runtime（状态持久化）',
      '工具注册与 Schema',
      '权限与凭据（继承发起人）',
      '超时与 token 预算',
      '全链路追踪',
      'HITL',
      '审计',
      '评测集',
    ],
    optional: [],
    products: ['LangGraph / Microsoft Agent Framework', 'MCP（无会话规范）', 'Langfuse', 'LiteLLM'],
    duration: '8–16 周（含评测体系）',
    dissuade: [
      '说"什么情况都能处理"时，必须先压缩范围',
      '说不清什么算做对，先把验收标准写出来',
      '制裁、廉政、申诉只能汇总，结论必须由人做出',
    ],
    notes: [
      '四前提缺一不可：工具≤15、单业务域、失败可回滚、有完成判据',
      '工具接入要按五个动作估工作量',
      'AutoGen 已维护模式，不接新项目；沙箱含白名单代理与评测夹具',
    ],
    layer: 'L5',
  },
  {
    id: 'F',
    letter: 'F',
    name: '多 Agent 协同',
    short: '跨域 / 并行 · 劝退为主',
    typical: ['国别诊断资料汇总', '跨部门复杂尽调材料准备'],
    must: ['E 的全部', '协调与冲突处理', '跨 Agent 审计归因'],
    optional: ['扇出 / 流水线 / 主管—工人 / 辩论'],
    products: ['同上 + A2A / Agent Card'],
    duration: '16 周起；建议先 E 跑通再拆',
    dissuade: ['绝大多数号称多 Agent 的其实是 D 或 E', '审计与独立评价很难解释决策链路'],
    notes: ['仅当子任务真独立可并行，或专业上下文完全不同才考虑'],
    layer: 'L6',
  },
]
