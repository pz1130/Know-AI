export type MorphologyResult = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'split' | 'closed' | 'gate'

export interface TriageStep {
  id: string
  question: string
  hint: string
  options: {
    id: string
    label: string
    detail?: string
    next?: string
    result?: MorphologyResult
    resultNote?: string
  }[]
}

export const triageSteps: Record<string, TriageStep> = {
  q1: {
    id: 'q1',
    question: '这个需求最终产出的是「信息」还是「动作」？',
    hint: '信息＝给人看的答案/报表/草稿；动作＝系统真的改了什么（批准提款、发公告、写贷款系统…）',
    options: [
      { id: 'info', label: '输出信息', detail: '人看完自己决定', next: 'q2' },
      { id: 'action', label: '输出动作', detail: '系统改状态或对外发出', next: 'q4' },
      {
        id: 'unclear',
        label: '说不清',
        detail: '通常是两件事打包了',
        result: 'split',
        resultNote: '拆开做，先做信息那半。这是最常见的救项目手段。',
      },
    ],
  },
  q2: {
    id: 'q2',
    question: '答案的来源是什么？',
    hint: '两种来源都要 → 不要当一个项目做。A 和 B 技术栈几乎没有重叠。',
    options: [
      {
        id: 'unstructured',
        label: '非结构化材料',
        detail: '政策、手册、评估报告、董事会文件…',
        next: 'q3a',
      },
      {
        id: 'structured',
        label: '结构化数据',
        detail: '贷款/采购/财务/成果监测系统…',
        next: 'q3b',
      },
      {
        id: 'generate',
        label: '需要产出新内容',
        detail: '起草概念说明、督导报告、国别简报…',
        result: 'C',
        resultNote: '形态 C：辅助生成。人在终点确认。建议作为第一个 AI 项目。',
      },
      {
        id: 'both',
        label: '两种来源都要',
        result: 'split',
        resultNote: 'A 与 B 分项目做；先做一个，再考虑上层路由。',
      },
    ],
  },
  q3a: {
    id: 'q3a',
    question: '问题的范围是封闭的还是开放的？（知识问答）',
    hint: '若能列完且不超过约 50 种问题类型 → 封闭需求，不要上检索。',
    options: [
      {
        id: 'closed',
        label: '封闭（可列完）',
        result: 'closed',
        resultNote: '分类路由 + 参数化模板。成本低一个数量级，准确率更高。',
      },
      {
        id: 'open',
        label: '开放（列不完）',
        result: 'A',
        resultNote: '形态 A：知识问答。必需引用溯源与检索层权限过滤。',
      },
    ],
  },
  q3b: {
    id: 'q3b',
    question: '问题的范围是封闭的还是开放的？（数据问答）',
    hint: '固定几张组合报表 → 参数化模板，别上 NL2SQL。',
    options: [
      {
        id: 'closed',
        label: '封闭（固定报表/问题）',
        result: 'closed',
        resultNote: '参数化模板 + 预计算。管理层也不会等 30 秒。',
      },
      {
        id: 'open',
        label: '开放（自然语言随意问）',
        result: 'B',
        resultNote: '形态 B：数据问答。先确认有没有权威口径——没有就转口径治理项目。',
      },
    ],
  },
  q4: {
    id: 'q4',
    question: '这个动作的路径，事先能画出流程图吗？',
    hint: '业务局说"每个项目都不一样"时，先花一周让业务把流程画出来再判断。',
    options: [
      {
        id: 'drawable',
        label: '能画出来，分支可穷举',
        next: 'q5',
        detail: '→ 倾向形态 D',
      },
      {
        id: 'narrow',
        label: '画不出来，但业务域很窄',
        detail: '系统/接口约 10–15 个内，不跨业务局',
        next: 'q5e',
      },
      {
        id: 'multi',
        label: '画不出来，还要跨多业务域或多路并行',
        next: 'q5f',
      },
    ],
  },
  q5: {
    id: 'q5',
    question: '动作可逆吗？（形态 D）',
    hint: '资金支付、对外公告、董事会文件、制裁廉政判定 → 强制人工确认门。',
    options: [
      {
        id: 'rev',
        label: '完全可逆',
        result: 'D',
        resultNote: '形态 D：流程自动化。可自动执行，留回滚。LLM 只在个别节点。',
      },
      {
        id: 'comp',
        label: '有补偿手段',
        result: 'D',
        resultNote: '形态 D + 补偿事务 + 全量审计。',
      },
      {
        id: 'irrev',
        label: '不可逆或对外',
        result: 'gate',
        resultNote: '形态 D + 强制人工确认门 + 完整审计链路。核准动作留给授权人员。',
      },
    ],
  },
  q5e: {
    id: 'q5e',
    question: '动作可逆吗？（形态 E）',
    hint: '四前提：工具≤15、单域、失败可回滚、有完成判据。缺一退回 D。',
    options: [
      {
        id: 'ok',
        label: '可逆或可回滚，且四前提可满足',
        result: 'E',
        resultNote: '形态 E：限域自主 Agent。必须有评测集、状态恢复、继承发起人权限。',
      },
      {
        id: 'irrev',
        label: '不可逆 / 对外 / 四前提不满足',
        result: 'gate',
        resultNote: '退回形态 D 拆需求，或把写操作拆成人工确认门。',
      },
    ],
  },
  q5f: {
    id: 'q5f',
    question: '是否真正需要多 Agent？',
    hint: '绝大多数号称多 Agent 的需求其实是 D 或 E。',
    options: [
      {
        id: 'really',
        label: '子任务真独立可并行，或专业上下文完全不同',
        result: 'F',
        resultNote: '形态 F：建议先用 E 做出单体版本跑通业务，再考虑拆分。工期 16 周起。',
      },
      {
        id: 'not',
        label: '其实可以拆成固定流程或限域单体',
        result: 'E',
        resultNote: '退回 E 或 D。多 Agent 的协调、冲突、归因成本通常远超收益。',
      },
    ],
  },
}

export const hardConstraints = [
  '密级与访问控制先于功能；权限过滤发生在检索阶段而非展示阶段',
  '数据出境与部署形态在项目启动前明确',
  '问责链路可追溯：谁、何时、何输入、何建议、谁确认',
  'AI 不得产出结论性判定（制裁、廉政、申诉、保障认定）——只能检索汇总',
  '对外发布必须隔断，默认标注内部参考',
  '多语言正式对外文本须经审校',
]
