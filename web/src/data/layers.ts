export type LayerId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6'

export interface Layer {
  id: LayerId
  name: string
  subtitle: string
  solves: string
  insight: string
  failures: string[]
  concepts: string[]
  morphologies: string[]
  color: string
}

export const layers: Layer[] = [
  {
    id: 'L0',
    name: '模型本身',
    subtitle: '给一段文本，出一段文本',
    solves: '一个"给一段文本、出一段文本"的函数。没有记忆、不联网、不会动手。',
    insight:
      '模型参数里的知识是训练时冻结的，有明确截止日期；不确定时会给出流畅且自信的错误答案，这是工作方式，不是可修缺陷。后面所有层都在给这个事实打补丁。',
    failures: ['编造（一本正经给出不存在的条款和数字）', '知识过期', '算术不可靠'],
    concepts: ['LLM', 'Transformer', 'KV Cache', '量化', '微调 / LoRA / DPO', 'vLLM / SGLang'],
    morphologies: [],
    color: '#6b7c93',
  },
  {
    id: 'L1',
    name: '对话',
    subtitle: '记住这一轮',
    solves: '把无状态函数包装成看起来能连续交流的东西，ChatGPT 引爆的那一步，是交互形态的发明。',
    insight:
      '多轮对话是幻觉。模型本身不记得上一句，是应用层每轮把历史重新发一遍。对话越长越贵；超过窗口就必须截断或压缩。',
    failures: ['上下文溢出导致的"失忆"', '长对话中的信息稀释', '成本随对话长度增长'],
    concepts: ['上下文窗口', 'Token 预算', '提示工程', 'CoT / ToT', '系统提示'],
    morphologies: ['形态 C · 辅助生成'],
    color: '#5a8f9e',
  },
  {
    id: 'L2',
    name: '上下文供给',
    subtitle: '知道企业内部的事',
    solves:
      '模型不知道机构内部的任何事。提问时把相关资料一起塞给它。分两条完全不同的技术路线。',
    insight:
      'RAG 不是让模型变聪明，是递参考资料，答案上限由检索质量决定。业界已把 RAG 降级为"上下文工程"里的一项技术。L2-A（非结构化知识问答）与 L2-B（结构化数据问答）技术栈几乎没有重叠，不要合成一个项目。',
    failures: [
      '检索不到 / 切分不当',
      '检索到过期版本',
      '口径不一致导致数字看似合理但错',
      '权限过滤失效导致越权可见',
    ],
    concepts: [
      'Embedding / 向量库',
      '混合检索 / 重排',
      'NL2SQL / 语义层',
      'CDC / 湖仓 / OLAP',
      '引用溯源',
    ],
    morphologies: ['形态 A · 知识问答', '形态 B · 数据问答'],
    color: '#3d9b8f',
  },
  {
    id: 'L3',
    name: '函数调用',
    subtitle: '动手',
    solves: '让模型能表达"我想调用某个工具、参数是这些"，从只能说到能做。',
    insight:
      '整份图谱最重要的一条：模型不执行任何东西。它只输出结构化建议；真正调用的是宿主程序。安全边界永远在宿主，不在模型。',
    failures: ['参数幻觉', '工具选择错误', '无限重复调用同一工具'],
    concepts: ['Function Calling', 'Tool Use', 'JSON Schema', '结构化输出'],
    morphologies: ['形态 D · 流程自动化（个别节点）'],
    color: '#c9a227',
  },
  {
    id: 'L4',
    name: '标准化工具接入',
    subtitle: 'MCP 与可复用资产',
    solves: '每个应用对接每个系统要单独写适配。MCP 把系统能力暴露一次，所有应用复用。',
    insight:
      '价值是经济性不是能力。现行规范无协议级会话，按普通 HTTP 扩展；企业落地看授权扩展（Agent 继承发起人权限）。接贷款、采购、财务多个老系统的机构，应在第一个 Agent 项目前定下来。',
    failures: ['工具描述含糊导致选错', '版本变更导致静默失败', '权限在协议层被绕过', 'SDK 停在有会话的旧规范'],
    concepts: ['MCP', '无协议级会话', 'Tools / Resources / Prompts', '工具注册中心', '企业授权'],
    morphologies: ['形态 D / E 的底座'],
    color: '#d4a054',
  },
  {
    id: 'L5',
    name: 'Agent（循环）',
    subtitle: '一次调用不够用了',
    solves:
      '真实任务需要多步：查、决定下一步、失败换方式、直到完成。把"下一步由谁决定"从 if-else 交给模型运行时。',
    insight:
      '工程负担是断崖式的、与模型能力无关：路径不可枚举 → 必须有状态恢复、超时预算、幂等、审计、HITL、评测集。原书说"平台"从这一层才真正成立，判断是对的。',
    failures: [
      '绕圈子不收敛',
      '跑偏',
      '状态不一致（半完成业务态）',
      '成本失控',
      '行为不可复现',
    ],
    concepts: ['Runtime', 'ReAct', 'Plan-and-Execute', 'Memory', 'HITL', 'LangGraph / MAF'],
    morphologies: ['形态 E · 限域自主 Agent'],
    color: '#e07058',
  },
  {
    id: 'L6',
    name: '多 Agent 协同',
    subtitle: '一个不够用了',
    solves: '一个 Agent 的上下文和工具集装不下时，拆成多个再加协调层。',
    insight:
      '问题不再是技术问题，是组织设计：谁监督谁、冲突听谁、失败怎么收尾、决策链路怎么解释。MCP 管工具，A2A 管 Agent 之间交任务，现同属一个基金会。收益常被高估，多数号称需要多 Agent 的需求，其实是 L3 或 L5。',
    failures: ['协调开销超过并行收益', '错误在 Agent 间放大', '成本成倍', '故障归因几乎不可能'],
    concepts: ['A2A', 'Agent Card', '扇出 / 流水线', '主管—工人', '辩论'],
    morphologies: ['形态 F · 多 Agent（劝退为主）'],
    color: '#c44d6a',
  },
]

export const crossCuts = [
  {
    title: '可观测',
    body: 'OpenTelemetry、GenAI 语义约定、Langfuse/Phoenix。层数越高越关键，行为不可复现时，没有完整链路就无法排查。',
  },
  {
    title: '评测',
    body: '评测集、Ragas/DeepEval、LLM-as-Judge。L2 以上没有评测集就不该上线。',
  },
  {
    title: '安全',
    body: '提示注入、护栏、权限与身份传递。暴露面随层数增加：L2 消费外部文档，L3 能执行动作，L5 自己决定执行什么。',
  },
  {
    title: '成本与部署',
    body: '缓存、模型网关、预算闸门。网关按任务/密级/成本路由；固定前缀应能命中 Prompt Cache。L1 一次调用，L5 一个任务可能几百次。',
  },
]

export const laws = [
  {
    title: '越往上，模型的贡献越小',
    body: '换更强模型对 L1/L2 提升明显，对 L5 项目成败影响有限。Agent 失败九成不是因为模型不够聪明。',
  },
  {
    title: '层与层的边界正在往下移',
    body: '架构上让每一层可替换：内部灵活、对外标准。换编排框架时，只应改适配层，业务逻辑不动。',
  },
]
