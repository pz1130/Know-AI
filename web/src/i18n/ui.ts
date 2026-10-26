import type { Locale } from './context'

const ui = {
  brand: { zh: 'AI 分诊台', en: 'AI Triage Desk' },
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
    library: { zh: '原文库', en: 'Library' },
  },

  home: {
    kicker: {
      zh: 'AI 分诊台 · 选型与内训',
      en: 'AI Triage Desk · Selection & Training',
    },
    title1: { zh: '接到 AI 需求时，', en: 'When an AI request lands,' },
    title2: {
      zh: '先定位层与风险，再选形态',
      en: 'locate layer & risk first, then pick the form',
    },
    lead: {
      zh: '本站把行内五份手册做成可交互工作台：概念电梯、A×B 定义网格、选型分诊、属性打分、场景对照与术语训练。面向',
      en: 'An interactive workbench from five field manuals: concept elevator, A×B definition grid, triage wizard, scorecard, scenarios, and lexicon drills. Built for',
    },
    audienceIt: { zh: 'IT 内训', en: 'IT training' },
    audienceArch: { zh: '方案架构师选型', en: 'solution architects' },
    ctaTriage: { zh: '开始选型分诊 →', en: 'Start triage →' },
    ctaElevator: { zh: '从概念电梯入门', en: 'Start with the elevator' },
    twoPaths: { zh: '两条主路径', en: 'Two main paths' },
    pathTrain: {
      zh: '新同事 / 内训 → 电梯 → 术语馆 → 验收四问',
      en: 'New hires / training → Elevator → Lexicon → 4 Checks',
    },
    pathArch: {
      zh: '架构师接需求 → 分诊 / 打分 → 场景库 → 原文',
      en: 'Architects → Triage / Score → Scenarios → Library',
    },
    pathReview: {
      zh: '评审对齐语言 → 定义网格 → 系统画像',
      en: 'Reviews → Def Grid → system portrait',
    },
    stance: { zh: '核心立场', en: 'Core stance' },
    stanceBody: {
      zh: 'RAG / Copilot / Workflow / Agent 不在同一层面，不能拿来选型。改问两件事：输出是信息还是动作？路径事先能画出来吗？',
      en: 'RAG / Copilot / Workflow / Agent are not the same axis—do not use them for selection. Ask two things: is the output information or action? Can the path be drawn in advance?',
    },
    hard: { zh: '本行硬约束（摘要）', en: 'Hard constraints (summary)' },
    hardBody: {
      zh: '密级先于功能；问责可追溯；制裁/廉政/申诉不得由 AI 下结论；对外发布隔断；权限在检索层过滤。',
      en: 'Classification before features; accountable trails; no AI conclusions on sanctions/integrity/grievances; external publish firewalled; filter ACL at retrieval.',
    },
    modules: {
      elevator: {
        title: { zh: '概念电梯', en: 'Concept Elevator' },
        desc: {
          zh: 'L0→L6 逐层叠加。点一层看关键认知、故障模式与对应形态。',
          en: 'L0→L6 stacked layers. Open a floor for insights, failure modes, morphologies.',
        },
        path: { zh: '内训主路径', en: 'Training path' },
      },
      grid: {
        title: { zh: '定义网格', en: 'Definition Grid' },
        desc: {
          zh: 'A×B 定位 + 五个设计旋钮，生成系统画像与风险提示。',
          en: 'A×B placement + five knobs → system portrait and risk flags.',
        },
        path: { zh: '语言对齐', en: 'Shared language' },
      },
      triage: {
        title: { zh: '选型分诊', en: 'Selection Triage' },
        desc: {
          zh: '五个问题定形态 A–F，输出组件方向与硬约束提醒。',
          en: 'Five questions → forms A–F, components, and hard constraints.',
        },
        path: { zh: '架构师主路径', en: 'Architect path' },
      },
      score: {
        title: { zh: '属性打分', en: 'Attribute Scorecard' },
        desc: {
          zh: '七维 0–3 分 + 密级/问责标志，读出硬性规则。',
          en: 'Seven 0–3 dimensions + classification/accountability flags.',
        },
        path: { zh: '立项评审', en: 'Gate reviews' },
      },
      scenarios: {
        title: { zh: '场景库', en: 'Scenario Library' },
        desc: {
          zh: '按业务原话检索：采购指南、提款审核、国别简报…',
          en: 'Search business quotes: procurement FAQ, withdrawal checks, country briefs…',
        },
        path: { zh: '需求含糊时', en: 'When fuzzy' },
      },
      glossary: {
        title: { zh: '术语馆', en: 'Lexicon' },
        desc: {
          zh: '速查、易混对照、十讲误区、闪卡记忆。',
          en: 'Lookup, confusions, ten myth talks, flashcards.',
        },
        path: { zh: 'IT 内训', en: 'IT training' },
      },
      quiz: {
        title: { zh: '验收四问', en: 'Four Acceptance Checks' },
        desc: {
          zh: '可检验判据：关掉 LLM？未列举路径？中间态？可重放？',
          en: 'Testable criteria: kill the LLM? unlisted paths? mid-states? replayable?',
        },
        path: { zh: '定义验收', en: 'Definition QA' },
      },
      library: {
        title: { zh: '原文库', en: 'Source Library' },
        desc: {
          zh: '五份 Markdown 全文阅读，决策依据可回原文。',
          en: 'Full Markdown sources for grounding decisions.',
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
    title: { zh: '概念电梯：从 LLM 到 Agent', en: 'Concept Elevator: LLM → Agent' },
    desc: {
      zh: '这些层不是互相取代，是叠加。今天一个生产 Agent 里，从 L0 到 L5 往往同时在跑。理解每层解决了什么、又留下了什么问题，比记住术语重要。',
      en: 'Layers stack, they do not replace each other. A production Agent often runs L0–L5 at once. What each layer fixes—and leaves broken—matters more than jargon.',
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
      zh: '按顺序回答，中途得出结论就停。需求清楚时走这条路径；含糊时先去场景库。',
      en: 'Answer in order; stop when you have a conclusion. Use scenarios when the ask is fuzzy.',
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
    toScore: { zh: '用属性打分表复核 →', en: 'Recheck with scorecard →' },
    toScenarios: { zh: '对照场景库 →', en: 'Open scenarios →' },
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
      en: 'These are yes/no hard gates, not scored. Checking either tightens compliance/accountability rules—it is not “a few more points”.',
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
      zh: '落在这些领域时，机构必须说清“谁做决定、依据是什么”。AI 上限是检索、汇总、初步标注；不得产出结论性判定或风险评级，结论须由授权人员做出。设计上要避免“模型先下结论、再让人复核”——理由容易变成围着结论圆场。',
      en: 'In these domains the institution must answer who decides and on what basis. AI may only retrieve, summarize, and lightly label—no conclusive judgments or risk ratings; authorized staff decide. Avoid “model concludes first, human reviews later”—reasons then become post-hoc rationalization.',
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
      en: 'No matches—try other keywords.',
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
      zh: '推荐项目顺序：形态 C 小项目建第 0 层 → 形态 A（公开级文档）→ 同时启动口径治理 → 最后碰 D/E。',
      en: 'Suggested sequence: Form C to stand up Layer 0 → Form A (public docs) → start metrics governance → only then D/E.',
    },
  },

  glossary: {
    kicker: { zh: 'Lexicon', en: 'Lexicon' },
    title: { zh: '术语馆', en: 'Lexicon' },
    desc: {
      zh: '词汇速查、易混对照、十讲误区与闪卡。讲解重点不在定义，在「最容易误解的地方」。',
      en: 'Lookup, confusions, ten myth talks, flashcards. Focus is misconceptions, not dictionary glosses.',
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
      zh: '依据选型手册 4.1 与第三章该形态的必需组件。逐项勾选，复制到评审材料。',
      en: 'From handbook §4.1 and the form’s required components in §3. Tick each item and copy into review material.',
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
      zh: '题目取自五份手册。每题作答后显示解析与出处，全部答完给出得分。',
      en: 'Questions drawn from the five handbooks. Each answer reveals an explanation and source; finish all for a score.',
    },
    source: { zh: '出处', en: 'Source' },
    correct: { zh: '回答正确', en: 'Correct' },
    wrong: { zh: '回答错误', en: 'Incorrect' },
    score: { zh: '得分', en: 'Score' },
    retry: { zh: '重新作答', en: 'Retry' },
    pass: { zh: '已掌握核心概念', en: 'Core concepts mastered' },
    review: { zh: '建议回看标注出处的章节', en: 'Review the cited sections' },
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
} as const

type Leaf = { zh: string; en: string }

export function t(leaf: Leaf, locale: Locale): string {
  return leaf[locale]
}

export { ui }
