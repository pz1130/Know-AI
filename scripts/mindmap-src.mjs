// Source of truth for the project mind map (zh/en).
// Node: [zh, en, headingZh?, headingEn?, children?]  — headings are prefixes of real doc headings.
const N = (zh, en, hz, he, c) => ({ zh, en, hz, he, c })
export const docs = {
  selection: ['AI需求技术选型手册.md', 'en/ai-requirements-selection-handbook.md'],
  handbook: ['概念讲解手册_给IT团队.md', 'en/concept-handbook-for-it.md'],
  elevator: ['概念层级图谱_从LLM到Agent.md', 'en/concept-map-llm-to-agent.md'],
  definitions: ['Agent术语定义_修订提案.md', 'en/agent-definitions-revision.md'],
  'glossary-book': ['企业级Agent平台_概念术语提炼.md', 'en/enterprise-agent-platform-term-digest.md'],
}
export const tree = N('Know AI', 'Know AI', null, null, [
  { ...N('AI 需求技术选型手册', 'AI Requirements Selection Handbook', null, null, [
    N('先破一个误区', 'Kill one myth first', '一、先破一个误区', '1. Kill one myth'),
    N('分诊决策树 · 5 问', 'Triage tree · 5 questions', '二、分诊决策树', '2. Triage decision tree', [
      N('Q1 信息还是动作', 'Q1 Information or action', '问题 1', 'Q1'),
      N('Q2 答案来源', 'Q2 Source of answers', '问题 2', 'Q2'),
      N('Q3 封闭还是开放', 'Q3 Closed or open', '问题 3', 'Q3'),
      N('Q4 能否事先画流程', 'Q4 Flowchart in advance?', '问题 4', 'Q4'),
      N('Q5 动作可逆吗', 'Q5 Reversible?', '问题 5', 'Q5'),
    ]),
    N('六种形态', 'Six forms', '三、六种形态', '3. Six forms', [
      N('A 知识问答', 'A Knowledge Q&A', '形态 A', 'Form A'),
      N('B 数据问答 DataAgent', 'B Data Q&A / DataAgent', '形态 B', 'Form B'),
      N('C 辅助生成', 'C Assisted drafting', '形态 C', 'Form C'),
      N('D 流程自动化', 'D Workflow automation', '形态 D', 'Form D'),
      N('E 限域自主 Agent', 'E Bounded autonomous agent', '形态 E', 'Form E'),
      N('F 多 Agent 协同', 'F Multi-agent', '形态 F', 'Form F'),
    ]),
    N('跨形态通用底线', 'Cross-form baselines', '四、跨形态的通用底线', '4. Cross-form baselines', [
      N('一般底线', 'General', '4.1', '4.1'),
      N('本行特有硬约束', 'Institution hard constraints', '4.2', '4.2'),
    ]),
    N('属性打分表', 'Attribute scorecard', '五、属性打分表', '5. Attribute scorecard'),
    N('场景对照库', 'Scenario library', '六、场景对照库', '6. Scenario library'),
    N('从零开始的建设顺序', 'Build order from zero', '七、从零开始的建设顺序', '7. Build order'),
    N('危险信号清单', 'Red-flag list', '八、危险信号清单', '8. Red-flag list'),
    N('关于原书的提醒', 'Notes on the source book', '九、关于原书', '9. Notes on the source book'),
  ]), doc: 'selection' },
  { ...N('概念讲解手册（给 IT 团队）', 'Concept Handbook (for IT)', null, null, [
    N('词汇速查 · 13 节', 'Vocabulary · 13 sections', '第一部分', 'Part 1', [
      ['1.1 模型层', '1.1 Model layer'], ['1.2 模型内部的数字概念', '1.2 Numbers inside the model'],
      ['1.3 与模型交互', '1.3 Interacting with the model'], ['1.4 Agent 与工具', '1.4 Agents and tools'],
      ['1.5 Workflow 与 Agent', '1.5 Workflow vs agent'], ['1.6 知识与检索层', '1.6 Knowledge & retrieval'],
      ['1.7 数据层', '1.7 Data layer'], ['1.8 工程与运行层', '1.8 Engineering & runtime'],
      ['1.9 安全与权限层', '1.9 Security & permissions'], ['1.10 治理、评测与成本', '1.10 Governance, eval & cost'],
      ['1.11 产品形态词', '1.11 Product-form terms'], ['1.12 术语来源提醒', '1.12 Where terms come from'],
      ['1.13 完整速查表', '1.13 Full reference table'],
    ].map(([z, e]) => N(z, e, z.split(' ')[0] + ' ', e.split(' ')[0] + ' '))),
    N('必修十讲', 'Ten required lectures', '第二部分', 'Part 2', [
      ['语义层与指标口径', 'Semantic layer & metrics'], ['上下文工程', 'Context engineering'],
      ['引用溯源', 'Citation traceability'], ['幂等与补偿事务', 'Idempotency & compensation'],
      ['人工介入点设计', 'Human checkpoint design'], ['提示注入', 'Prompt injection'],
      ['模型不执行任何东西', 'The model executes nothing'], ['可观测与追踪', 'Observability & tracing'],
      ['评测集与 LLM-as-Judge', 'Eval sets & LLM-as-Judge'], ['Agent 身份与权限传递', 'Agent identity & credentials'],
    ].map(([z, e], i) => N(`${i + 1}. ${z}`, `${i + 1}. ${e}`, `第 ${i + 1} 讲 `, `Lecture ${i + 1} `))),
    N('选修', 'Optional', '第三部分', 'Part 3'),
    N('现阶段先不学', 'Not yet', '第四部分', 'Part 4'),
    N('必须补的六块', 'Six gaps we must fill', '第五部分', 'Part 5', [
      N('爆炸半径与沙箱', 'Blast radius & sandboxing', '爆炸半径', 'Blast radius'),
      N('长时运行与断点恢复', 'Long-running & resumption', '长时运行', 'Long-running'),
      N('验证瓶颈', 'Verification bottleneck', '验证瓶颈', 'The verification'),
      N('多 Agent 组织形态', 'Multi-agent org form', '多 Agent 的组织', 'Organisational form'),
      N('密级感知检索', 'Classification-aware retrieval', '密级感知', 'Classification-aware'),
      N('模型版本漂移', 'Model version drift', '模型版本漂移', 'Model version drift'),
    ]),
    N('讲解安排建议', 'Teaching plan', '第六部分', 'Part 6'),
  ]), doc: 'handbook' },
  { ...N('概念层级图谱：LLM → Agent', 'Concept map: LLM → Agent', null, null, [
    N('L0–L6 七层', 'Seven layers L0–L6', null, null, [
      N('L0 模型本身', 'L0 The model', 'L0', 'L0'), N('L1 对话', 'L1 Conversation', 'L1', 'L1'),
      N('L2 上下文供给', 'L2 Context supply', 'L2 ·', 'L2 ·', [
        N('L2-A 知识问答', 'L2-A Knowledge Q&A', 'L2-A', 'L2-A'), N('L2-B 数据问答', 'L2-B Data Q&A', 'L2-B', 'L2-B')]),
      N('L3 函数调用', 'L3 Function calling', 'L3', 'L3'), N('L4 标准化工具接入', 'L4 Standard tool access', 'L4', 'L4'),
      N('L5 Agent', 'L5 Agent', 'L5', 'L5'), N('L6 多 Agent 协同', 'L6 Multi-agent', 'L6', 'L6'),
    ]),
    N('横切四件事', 'Four cross-cutting concerns', '横切所有层', 'Four cross-cutting'),
    N('两条规律', 'Two laws', '两条重要的规律', 'Two laws', [
      N('越往上模型贡献越小', 'Higher layers, smaller model share', '一、越往上', '1. Higher layers'),
      N('层边界在往下移', 'Boundaries move down', '二、层与层', '2. Layer boundaries'),
    ]),
    N('怎么用这份图谱', 'How to use this map', '怎么用这份图谱', 'How to use this map'),
  ]), doc: 'elevator' },
  { ...N('Agent 术语定义修订提案', 'Agent definitions revision', null, null, [
    N('根定义：运行时决策权', 'Root: runtime decision rights', '一、根定义', '1. Root definition'),
    N('两条正交主轴', 'Two orthogonal axes', '二、两条正交主轴', '2. Two orthogonal axes', [
      N('A 轴 决策权归属', 'Axis A Decision rights', 'A 轴', 'Axis A'), N('B 轴 作用域', 'Axis B Scope', 'B 轴', 'Axis B')]),
    N('五个可调维度', 'Five knobs', '三、五个正交', '3. Five orthogonal knobs'),
    N('可检验判据', 'Testable criteria', '四、可检验判据', '4. Testable criteria'),
    N('四个词归位', 'Four words re-homed', '五、把四个词', '5. Put the four words'),
  ]), doc: 'definitions' },
  { ...N('企业级 Agent 平台术语提炼 · 10 领域', 'Enterprise agent platform term digest · 10 domains', null, null, [
    ['一、', '1.', '基础形态', 'Foundations'], ['二、', '2.', '模型与推理', 'Models & inference'],
    ['三、', '3.', '数据基础设施', 'Data infrastructure'], ['四、', '4.', '向量与 RAG', 'Vectors & RAG'],
    ['五、', '5.', 'Agent 与编排', 'Agent & orchestration'], ['六、', '6.', '评估与可观测', 'Eval & observability'],
    ['七、', '7.', '安全与合规', 'Security & compliance'], ['八、', '8.', 'K8s 部署运维', 'Deploy & ops on K8s'],
    ['九、', '9.', '前端与交互', 'Frontend & interaction'], ['十、', '10.', '数据智能', 'Data intelligence'],
    ['附', 'Appendix', '易混术语对照', 'Easy confusions'],
  ].map(([hz, he, z, e]) => N(z, e, hz, he))), doc: 'glossary-book' },
])
