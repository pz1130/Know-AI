import type { Locale } from './context'

const ui = {
  brand: { zh: 'KYA', en: 'KYA' },
  footer1: {
    zh: '面向 IT 内训与架构师选型 · 公开参考资料，非正式政策',
    en: 'For IT training & solution architects · Public reference, not formal policy',
  },
  footer2: {
    zh: '',
    en: '',
  },
  themeDark: { zh: '深色', en: 'Dark' },
  themeLight: { zh: '浅色', en: 'Light' },
  themeToggle: { zh: '切换配色', en: 'Toggle theme' },
  langZh: { zh: '中文', en: '中文' },
  langEn: { zh: 'EN', en: 'EN' },
  langToggle: { zh: '切换语言', en: 'Toggle language' },

  nav: {
    home: { zh: '首页', en: 'Home' },
    elevator: { zh: '概念电梯', en: 'Elevator' },
    grid: { zh: '定义网格', en: 'Def Grid' },
    triage: { zh: '选型分诊', en: 'Triage' },
    score: { zh: '属性打分', en: 'Scorecard' },
    scenarios: { zh: '场景库', en: 'Scenarios' },
    glossary: { zh: '术语馆', en: 'Lexicon' },
    quiz: { zh: '验收四问', en: '4 Checks' },
    selftest: { zh: '自测题', en: 'Self-test' },
    mindmap: { zh: '思维导图', en: 'Mind Map' },
    library: { zh: '原文库', en: 'Library' },
  },

  home: {
    kicker: {
      zh: 'Know-Your-AI · 选型与内训',
      en: 'Know-Your-AI · Selection & Training',
    },
    title1: { zh: '接到 AI 需求时，', en: 'When an AI request lands,' },
    title2: {
      zh: '先把层和风险说清楚，再定形态',
      en: 'name the layer and the risk, then pick the form',
    },
    lead: {
      zh: '把行内五份手册做成可点的工作台：概念电梯、定义网格、选型分诊、属性打分、场景对照和术语训练。给',
      en: 'Five field manuals turned into a clickable workbench: concept elevator, definition grid, triage, scorecard, scenarios, and lexicon drills. For',
    },
    audienceIt: { zh: 'IT 内训', en: 'IT training' },
    audienceArch: { zh: '方案架构师选型', en: 'solution architects' },
    ctaTriage: { zh: '开始选型分诊', en: 'Start triage' },
    ctaElevator: { zh: '从概念电梯入门', en: 'Start with the elevator' },
    twoPaths: { zh: '两条主路径', en: 'Two main paths' },
    pathTrain: {
      zh: '新同事或内训：先坐电梯，再刷术语馆，最后用验收四问对一下。',
      en: 'New hires / training: ride the elevator, drill the lexicon, then run the four checks.',
    },
    pathArch: {
      zh: '架构师接需求：走分诊或打分，对照场景库，必要时回原文。',
      en: 'Architects: run triage or the scorecard, check scenarios, open the library when needed.',
    },
    pathReview: {
      zh: '评审要对齐语言：打开定义网格，把系统画像说清楚。',
      en: 'Reviews: open the definition grid and pin down the system portrait.',
    },
    stance: { zh: '怎么选型', en: 'How we select' },
    stanceBody: {
      zh: 'RAG、Copilot、Workflow、Agent 不在同一层面，拿来选型会对不上。更稳的两问是：最终产出的是信息还是动作？这条路径事先能不能画出来？',
      en: 'RAG, Copilot, Workflow and Agent are not one axis, so they make poor selection labels. Two steadier questions: is the output information or an action? Can you draw the path before runtime?',
    },
    hard: { zh: '本行硬约束（摘要）', en: 'Hard constraints (summary)' },
    hardBody: {
      zh: '密级方案要先于功能定稿。问责链路要能复现。制裁、廉政、申诉这类结论不能交给模型。对外发布默认隔断。权限过滤发生在检索阶段，不能先搜全库再遮挡。',
      en: 'Freeze classification before features. Keep an accountable trail you can replay. Do not let the model conclude on sanctions, integrity or grievances. Firewall external publishing by default. Filter permissions at retrieval, not by hiding results after a full-corpus search.',
    },
    modules: {
      elevator: {
        title: { zh: '概念电梯', en: 'Concept Elevator' },
        desc: {
          zh: '从 L0 到 L6 一层层叠上去。点开某一层，看它解决什么、还会留下什么坑、对应哪种形态。',
          en: 'Layers L0 through L6 stacked. Open a floor to see what it fixes, what it still breaks, and which forms sit there.',
        },
        path: { zh: '内训主路径', en: 'Training path' },
      },
      grid: {
        title: { zh: '定义网格', en: 'Definition Grid' },
        desc: {
          zh: '用 A×B 两轴把系统摆到格子里，再拧五个设计旋钮，导出系统画像和风险提示。',
          en: 'Place the system on the A×B axes, tune five design knobs, and export a portrait with risk flags.',
        },
        path: { zh: '语言对齐', en: 'Shared language' },
      },
      triage: {
        title: { zh: '选型分诊', en: 'Selection Triage' },
        desc: {
          zh: '五个问题走完分诊流程，落到形态 A–F，并给出组件方向和硬约束提醒。',
          en: 'Five questions through the triage flow land on forms A–F, with component direction and hard-constraint reminders.',
        },
        path: { zh: '架构师主路径', en: 'Architect path' },
      },
      score: {
        title: { zh: '属性打分', en: 'Attribute Scorecard' },
        desc: {
          zh: '七个维度各打 0–3 分，再加密级与问责两个硬开关，直接读出规则。',
          en: 'Score seven dimensions 0–3, then flip the classification and accountability gates to read the rules.',
        },
        path: { zh: '立项评审', en: 'Gate reviews' },
      },
      scenarios: {
        title: { zh: '场景库', en: 'Scenario Library' },
        desc: {
          zh: '按业务局常说的原话来查：采购指南、提款审核、国别简报这类。',
          en: 'Search by how business units phrase it: procurement FAQ, withdrawal checks, country briefs, and the like.',
        },
        path: { zh: '需求含糊时', en: 'When fuzzy' },
      },
      glossary: {
        title: { zh: '术语馆', en: 'Lexicon' },
        desc: {
          zh: '词汇速查、易混对照、十讲常见误区和闪卡。重点在误解，不在背定义。',
          en: 'Term lookup, lookalike pairs, ten common-myth talks, and flashcards. Focus on misconceptions, not glossary drills.',
        },
        path: { zh: 'IT 内训', en: 'IT training' },
      },
      quiz: {
        title: { zh: '验收四问', en: 'Four Acceptance Checks' },
        desc: {
          zh: '四条可检验判据：关掉大模型还能不能跑、有没有未列举路径、中间态怎么恢复、链路能不能重放。',
          en: 'Four testable checks: does it still run without the LLM, are there unlisted paths, how mid-states recover, and can the trail be replayed.',
        },
        path: { zh: '定义验收', en: 'Definition QA' },
      },
      library: {
        title: { zh: '原文库', en: 'Source Library' },
        desc: {
          zh: '五份手册全文。选型依据说不清时，回到对应章节核对。',
          en: 'Full text of the five manuals. When a selection call is fuzzy, open the matching section.',
        },
        path: { zh: '深读', en: 'Deep read' },
      },
    },
  },

  common: {
    copy: { zh: '复制', en: 'Copy' },
    copied: { zh: '已复制', en: 'Copied' },
    reset: { zh: '重来', en: 'Reset' },
    back: { zh: '上一步', en: 'Back' },
    next: { zh: '下一步', en: 'Next' },
    clear: { zh: '清空', en: 'Clear' },
    loading: { zh: '加载中…', en: 'Loading…' },
    loadFail: { zh: '加载失败', en: 'Load failed' },
    downloadMd: { zh: '下载 .md', en: 'Download .md' },
    all: { zh: '全部', en: 'All' },
    search: { zh: '搜索…', en: 'Search…' },
    yes: { zh: '是', en: 'Yes' },
    no: { zh: '否', en: 'No' },
    prev: { zh: '上一张', en: 'Prev' },
    nextCard: { zh: '下一张', en: 'Next' },
    count: { zh: '条', en: 'items' },
  },

  elevator: {
    kicker: { zh: 'Concept Elevator', en: 'Concept Elevator' },
    title: { zh: '概念电梯：从 LLM 到 Agent', en: 'Concept Elevator: from LLM to Agent' },
    desc: {
      zh: '这些层不是互相取代，而是叠在一起。今天一个生产环境里的 Agent，从 L0 到 L5 往往同时在跑。搞清每一层解决了什么、又留下什么问题，比背术语有用。',
      en: 'These layers do not replace each other; they stack. A production agent often runs L0 through L5 at once. Knowing what each floor fixes, and what it still leaves broken, beats memorising jargon.',
    },
    stackOn: { zh: '叠加视图 · 开', en: 'Stack view · On' },
    stackOff: { zh: '叠加视图 · 关', en: 'Stack view · Off' },
    stackHint: {
      zh: '开启时高亮当前层及以下（能力地基）',
      en: 'When on, highlights this floor and below (capability base)',
    },
    down: { zh: '↓ 下层', en: '↓ Lower' },
    up: { zh: '↑ 上层', en: '↑ Upper' },
    solves: { zh: '这一层解决什么', en: 'What this layer solves' },
    insight: { zh: '关键认知', en: 'Key insight' },
    failures: { zh: '故障模式', en: 'Failure modes' },
    concepts: { zh: '书里对应概念', en: 'Related concepts' },
    morphs: { zh: '对应选型形态', en: 'Matching forms' },
    cross: { zh: '横切所有层', en: 'Cross-cutting concerns' },
    laws: { zh: '两条规律', en: 'Two laws' },
  },

  grid: {
    kicker: { zh: 'Definition Grid', en: 'Definition Grid' },
    title: { zh: 'A × B 定义网格', en: 'A × B Definition Grid' },
    desc: {
      zh: '把混合分类拆成两条正交主轴：决策权归属（A）与作用域（B）。市面上绝大多数自称 Agent 的产品落在 A3×B2 或 A2×B3；真正需要重装治理的 A3×B3 只有右下角一格。',
      en: 'Split mixed taxonomies into two orthogonal axes: decision rights (A) and scope (B). Most “Agents” sit at A3×B2 or A2×B3; full governance is for the A3×B3 corner.',
    },
    axisA: { zh: 'A 轴 · 决策权', en: 'Axis A · Decision rights' },
    axisB: { zh: 'B 轴 · 作用域', en: 'Axis B · Scope' },
    knobs: { zh: '五个正交旋钮', en: 'Five orthogonal knobs' },
    knobsHint: {
      zh: '不构成类别；任何 A×B 都可独立调节。',
      en: 'Not categories; any A×B cell can tune these independently.',
    },
    copyPortrait: { zh: '复制系统画像', en: 'Copy portrait' },
    highRisk: { zh: 'HIGH RISK', en: 'HIGH RISK' },
  },

  triage: {
    kicker: { zh: 'Triage Wizard', en: 'Triage Wizard' },
    title: { zh: '选型分诊向导', en: 'Selection Triage Wizard' },
    desc: {
      zh: '按顺序回答五个问题，中途能下结论就停。需求清楚时走这条分诊流程；听着含糊，先去场景库找相似项。',
      en: 'Answer five questions in order and stop once you have a conclusion. Use this triage flow when the ask is clear; when it is fuzzy, start in the scenario library.',
    },
    step: { zh: '步骤', en: 'Step' },
    conclusion: { zh: '分诊结论', en: 'Triage result' },
    form: { zh: '形态', en: 'Form' },
    must: { zh: '必需组件', en: 'Required components' },
    duration: { zh: '工期参考', en: 'Duration guide' },
    layer: { zh: '对应层级', en: 'Layer' },
    dissuade: { zh: '劝退 / 注意', en: 'Dissuaders / notes' },
    products: { zh: '产品候选（起点非结论）', en: 'Product candidates (starting points)' },
    hard: {
      zh: '跨形态硬约束（任何结论都适用）',
      en: 'Cross-form hard constraints (always apply)',
    },
    overview: { zh: '六种形态速览', en: 'Six forms at a glance' },
    toScore: { zh: '用属性打分表复核', en: 'Recheck with scorecard' },
    toScenarios: { zh: '对照场景库', en: 'Open scenarios' },
    redo: { zh: '重新分诊', en: 'Restart triage' },
    editBack: { zh: '返回修改', en: 'Edit answers' },
  },

  score: {
    kicker: { zh: 'Attribute Scorecard', en: 'Attribute Scorecard' },
    title: { zh: '属性打分表', en: 'Attribute Scorecard' },
    desc: {
      zh: '用于需求评审、立项答辩，或决策树给不出明确答案时。七个维度各打 0–3 分；另两项本行专用只判有无。',
      en: 'For requirement reviews and gates when the tree is ambiguous. Seven 0–3 dims; two MDB flags are yes/no only.',
    },
    bankFlags: { zh: '本行专用判定（不打分）', en: 'Bank-specific flags (no score)' },
    bankFlagsIntro: {
      zh: '这两项不计入七维总分，是“有没有”的硬开关：勾上后直接收紧合规与问责底线，而不是多扣几分。',
      en: 'These are yes/no hard gates, not scored. Checking either tightens compliance/accountability rules; it is not “a few more points”.',
    },
    classified: { zh: '密级触及', en: 'Classification touch' },
    classifiedHint: {
      zh: '是否会接触到限制级以上材料',
      en: 'Touches restricted-or-higher materials',
    },
    classifiedHelp: {
      zh: '限制级及以上常见包括：未公开国别分析、人事相关材料、董事会讨论稿/保密文件等。勾选表示权限与密级方案必须先于功能设计定稿，且过滤发生在检索层（不能先搜全库再在展示层遮挡）。只做公开级文档问答时通常不勾。',
      en: 'Restricted-or-higher often includes unpublished country analysis, HR materials, board drafts/confidential files. If checked, ACL/classification design must freeze before features, and filtering happens at retrieval (not hide-after-search). Public-doc Q&A usually leaves this unchecked.',
    },
    accountability: { zh: '问责敏感', en: 'Accountability-sensitive' },
    accountabilityHint: {
      zh: '制裁、廉政、申诉、保障政策认定等领域',
      en: 'Sanctions, integrity, grievances, safeguard determinations',
    },
    accountabilityHelp: {
      zh: '落在这些领域时，机构必须说清“谁做决定、依据是什么”。AI 上限是检索、汇总、初步标注；不得产出结论性判定或风险评级，结论须由授权人员做出。设计上要避免“模型先下结论、再让人复核”，理由容易变成围着结论圆场。',
      en: 'In these domains the institution must answer who decides and on what basis. AI may only retrieve, summarize, and lightly label. It must not make conclusive judgments or risk ratings; authorized staff decide. Avoid “model concludes first, human reviews later”, because the reasons then become post-hoc rationalization.',
    },
    total: { zh: '总分', en: 'Total' },
    rules: { zh: '规则读出', en: 'Rule readout' },
    copySummary: { zh: '复制评审摘要', en: 'Copy review summary' },
  },

  scenarios: {
    kicker: { zh: 'Scenario Library', en: 'Scenario Library' },
    title: { zh: '场景对照库', en: 'Scenario Library' },
    desc: {
      zh: '按业务局常说的原话来查。需求含糊或听着像见过时，先从这里找相似项。',
      en: 'Search by how business units phrase requests. Start here when the ask is vague or familiar.',
    },
    searchPh: {
      zh: '搜索原话、形态、关键词…',
      en: 'Search quotes, forms, keywords…',
    },
    empty: {
      zh: '没有匹配场景，试试别的关键词。',
      en: 'No matches; try other keywords.',
    },
    danger: { zh: '危险信号清单', en: 'Red-flag list' },
    dangerHint: {
      zh: '评审时听到这些话，停下来重新对齐。',
      en: 'If you hear these in review, stop and realign.',
    },
    build: { zh: '从零建设顺序', en: 'Build order from zero' },
    buildHint: {
      zh: '按底座建，而不是按需求来的顺序建。',
      en: 'Build foundations first, not arrival order of requests.',
    },
    buildRec: {
      zh: '建议顺序：先用形态 C 的小项目把第 0 层搭起来，再做公开级文档的形态 A，同时启动口径治理，最后才碰 D 或 E。',
      en: 'Suggested order: stand up Layer 0 with a small Form C project, then Form A on public documents, start metrics governance in parallel, and only then touch D or E.',
    },
  },

  glossary: {
    kicker: { zh: 'Lexicon', en: 'Lexicon' },
    title: { zh: '术语馆', en: 'Lexicon' },
    desc: {
      zh: '词汇速查、易混对照、十讲常见误区与闪卡。重点不在背定义，在说清最容易踩的坑，最好能举到放款、采购、制裁这类行内例子。',
      en: 'Lookup, lookalike pairs, ten common-myth talks, and flashcards. The point is the pitfalls, not dictionary glosses — ideally with bank examples like disbursement, procurement, or sanctions.',
    },
    tabTerms: { zh: '词汇速查', en: 'Terms' },
    tabConf: { zh: '易混对照', en: 'Confusions' },
    tabLectures: { zh: '十讲误区', en: 'Ten talks' },
    tabFlash: { zh: '闪卡', en: 'Cards' },
    searchTerm: { zh: '搜索术语…', en: 'Search terms…' },
    talk: { zh: '第', en: 'Talk' },
    talkUnit: { zh: '讲', en: '' },
    what: { zh: '是什么', en: 'What' },
    why: { zh: '为什么重要', en: 'Why it matters' },
    myth: { zh: '最易误解', en: 'Common myth' },
    front: { zh: '正面 · 点击翻转', en: 'Front · click to flip' },
    back: { zh: '背面', en: 'Back' },
  },

  quiz: {
    kicker: { zh: 'Acceptance Tests', en: 'Acceptance Tests' },
    title: { zh: '可检验判据 · 验收四问', en: 'Testable criteria · four checks' },
    desc: {
      zh: '定义要能落到评审表上才算完成。对你手上的系统逐项回答，生成验收画像。',
      en: 'A definition only counts if it fits a review form. Answer for your system to build an acceptance portrait.',
    },
    generate: { zh: '生成验收画像', en: 'Build portrait' },
    portrait: { zh: '验收画像', en: 'Acceptance portrait' },
    copyPortrait: { zh: '复制画像', en: 'Copy portrait' },
  },

  baseline: {
    title: { zh: '上线底线清单', en: 'Launch baseline checklist' },
    desc: {
      zh: '对照选型手册 4.1 和第三章该形态的必需组件。逐项勾完，复制进评审材料。',
      en: 'Against handbook §4.1 and the form’s required components in §3. Tick each item, then copy into the review pack.',
    },
    specific: { zh: '本形态专属', en: 'Specific to this form' },
    general: { zh: '所有形态通用', en: 'All forms' },
    copy: { zh: '复制清单', en: 'Copy checklist' },
    copied: { zh: '已复制', en: 'Copied' },
  },

  selftest: {
    kicker: { zh: 'IT Training', en: 'IT Training' },
    title: { zh: 'IT 内训自测题', en: 'IT training self-test' },
    desc: {
      zh: '题目都来自五份手册。每题答完立刻给解析和出处；全部做完看得分，不过关就按出处回看。',
      en: 'Every question comes from the five handbooks. Each answer shows an explanation and a source; finish all for a score, then revisit the cited sections if you miss.',
    },
    source: { zh: '出处', en: 'Source' },
    correct: { zh: '回答正确', en: 'Correct' },
    wrong: { zh: '回答错误', en: 'Incorrect' },
    score: { zh: '得分', en: 'Score' },
    retry: { zh: '重新作答', en: 'Retry' },
    pass: { zh: '核心概念过关', en: 'Core concepts cleared' },
    review: { zh: '按出处回看对应章节', en: 'Go back to the cited sections' },
  },

  library: {
    kicker: { zh: 'Source Library', en: 'Source Library' },
    title: { zh: '原文库', en: 'Source Library' },
    desc: {
      zh: '五份手册全文。界面语言切换时同步切换中英文稿。',
      en: 'Full text of the five manuals. Content follows UI language (Chinese / English).',
    },
    noteEn: {
      zh: '',
      en: '',
    },
  },
  mindmap: {
    kicker: { zh: 'Mind Map', en: 'Mind Map' },
    title: { zh: '项目全景思维导图', en: 'Project Mind Map' },
    desc: {
      zh: '五份手册的章节骨架摊在一张图上。点节点旁的圆点展开或收起，点节点名跳到原文库对应章节。',
      en: 'The chapter skeleton of all five manuals on one map. Click the dot beside a node to expand or collapse; click the node name to open that section in the library.',
    },
    layout: { zh: '布局', en: 'Layout' },
    layoutBalanced: { zh: '左右展开', en: 'Balanced' },
    layoutRadial: { zh: '放射', en: 'Radial' },
    layoutTree: { zh: '目录树', en: 'Outline tree' },
    expand: { zh: '展开', en: 'Expand' },
    collapse: { zh: '收起', en: 'Collapse' },
    zoomIn: { zh: '放大', en: 'Zoom in' },
    zoomOut: { zh: '缩小', en: 'Zoom out' },
    fit: { zh: '适应屏幕', en: 'Fit to screen' },
    hint: { zh: '滚轮缩放 · 拖动平移 · 悬停高亮路径', en: 'Scroll to zoom · drag to pan · hover to trace a path' },
    expandAll: { zh: '全部展开', en: 'Expand all' },
    collapseAll: { zh: '全部收起', en: 'Collapse all' },
    openDoc: { zh: '打开原文', en: 'Open doc' },
  },
} as const

type Leaf = { zh: string; en: string }

export function t(leaf: Leaf, locale: Locale): string {
  return leaf[locale]
}

export { ui }
