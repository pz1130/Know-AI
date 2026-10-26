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
    hint: '信息是给人看的答案、报表或草稿；动作是系统真的改了状态，比如批准提款、发公告、回写贷款系统。',
    options: [
      { id: 'info', label: '输出信息', detail: '人看完自己决定', next: 'q2' },
      { id: 'action', label: '输出动作', detail: '系统改状态或对外发出', next: 'q4' },
      {
        id: 'unclear',
        label: '说不清',
        detail: '通常是两件事打包了',
        result: 'split',
        resultNote: '拆开做，先做信息那半。比如既要答采购条款又要代发授标通知，就先做问答。这是最常见的救项目手段。',
      },
    ],
  },
  q2: {
    id: 'q2',
    question: '答案的来源是什么？',
    hint: '两种来源都要时，不要当一个项目做。知识问答和数据问答的技术栈几乎没有重叠。',
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
        resultNote: '形态 C：辅助生成。人在终点确认。国别简报或督导报告初稿很适合当第一个 AI 项目。',
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
    hint: '若能列完且不超过大约 50 种问题类型，就是封闭需求，不要上检索。',
    options: [
      {
        id: 'closed',
        label: '封闭（可列完）',
        result: 'closed',
        resultNote: '用分类路由加参数化模板即可。成本往往低一个数量级，准确率也更高。',
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
    hint: '若只是固定几张组合报表，用参数化模板，别上 NL2SQL。',
    options: [
      {
        id: 'closed',
        label: '封闭（固定报表/问题）',
        result: 'closed',
        resultNote: '参数化模板加预计算即可。管理层也不会干等三十秒出一张数。',
      },
      {
        id: 'open',
        label: '开放（自然语言随意问）',
        result: 'B',
        resultNote: '形态 B：数据问答。先确认金额、币种、时间这类权威口径在不在；没有就先做口径治理，不要直接开 NL2SQL。',
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
        detail: '倾向形态 D',
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
    hint: '资金支付、对外公告、董事会文件、制裁或廉政判定，一律强制人工确认门。',
    options: [
      {
        id: 'rev',
        label: '完全可逆',
        result: 'D',
        resultNote: '形态 D：流程自动化。可自动执行并留回滚；大模型通常只出现在一两个节点，其余写死。',
      },
      {
        id: 'comp',
        label: '有补偿手段',
        result: 'D',
        resultNote: '形态 D，加上补偿事务和全量审计链路。',
      },
      {
        id: 'irrev',
        label: '不可逆或对外',
        result: 'gate',
        resultNote: '形态 D，加上强制人工确认门和完整审计链路。核准动作留给授权人员。',
      },
    ],
  },
  q5e: {
    id: 'q5e',
    question: '动作可逆吗？（形态 E）',
    hint: '四个前提：工具不超过 15 个、单一业务域、失败可回滚、有完成判据。缺一条就退回形态 D。',
    options: [
      {
        id: 'ok',
        label: '可逆或可回滚，且四前提可满足',
        result: 'E',
        resultNote: '形态 E：限域自主 Agent。必须有评测集、状态恢复，并以发起人身份访问业务系统。',
      },
      {
        id: 'irrev',
        label: '不可逆 / 对外 / 四前提不满足',
        result: 'gate',
        resultNote: '退回形态 D 拆需求，或把写操作单独拆成人工确认门。',
      },
    ],
  },
  q5f: {
    id: 'q5f',
    question: '是否真正需要多 Agent？',
    hint: '绝大多数号称多 Agent 的需求，拆开看其实是形态 D 或 E。',
    options: [
      {
        id: 'really',
        label: '子任务真独立可并行，或专业上下文完全不同',
        result: 'F',
        resultNote: '形态 F：建议先用形态 E 做出单体版本跑通业务，再考虑拆分。工期通常从十六周起。',
      },
      {
        id: 'not',
        label: '其实可以拆成固定流程或限域单体',
        result: 'E',
        resultNote: '退回形态 E 或 D。多 Agent 的协调、冲突和归因成本，通常远超收益。',
      },
    ],
  },
}

export const hardConstraints = [
  '密级与访问控制先于功能定稿；权限过滤发生在检索阶段，不能先搜全库再遮挡',
  '数据是否出境、模型怎么部署，要在项目启动前说清楚',
  '问责链路可追溯：谁在什么时候、基于什么输入、得到什么建议、由谁确认',
  '制裁、廉政、申诉、保障认定不得由 AI 下结论，模型只做检索和汇总',
  '对外发布必须隔断，默认标注内部参考',
  '多语言正式对外文本须经审校',
]
