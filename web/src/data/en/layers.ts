import type { Layer } from '../layers'

export const layersEn: Layer[] = [
  {
    id: 'L0',
    name: 'The model itself',
    subtitle: 'Text in, text out',
    solves: 'A function: text in, text out. No memory, no network, no actions.',
    insight:
      'Parametric knowledge is frozen at training time with a cutoff. When unsure it still answers fluently and confidently—that is how it works, not a bug to “fix”. Every higher layer patches this fact.',
    failures: ['Hallucinated clauses and numbers', 'Stale knowledge', 'Unreliable arithmetic'],
    concepts: ['LLM', 'Transformer', 'KV Cache', 'Quantization', 'Fine-tune / LoRA / DPO', 'vLLM / SGLang'],
    morphologies: [],
    color: '#6b7c93',
  },
  {
    id: 'L1',
    name: 'Conversation',
    subtitle: 'Remember this turn',
    solves: 'Wrap the stateless function so multi-turn chat feels continuous—the ChatGPT leap was interaction design.',
    insight:
      'Multi-turn memory is an illusion. The model does not remember; the app resends history each turn. Longer chats cost more; beyond the window you must truncate or compress.',
    failures: ['“Amnesia” after overflow', 'Middle-context dilution', 'Cost grows with history'],
    concepts: ['Context window', 'Token budget', 'Prompting', 'CoT / ToT', 'System prompt'],
    morphologies: ['Form C · Assisted drafting'],
    color: '#5a8f9e',
  },
  {
    id: 'L2',
    name: 'Context supply',
    subtitle: 'Know internal enterprise facts',
    solves:
      'The model knows nothing internal. At ask time, inject relevant material. Two very different technical paths.',
    insight:
      'RAG does not make the model smarter—it hands references. Answer quality is capped by retrieval. Industry now treats RAG as one technique under context engineering. L2-A (unstructured) and L2-B (structured) barely share a stack—do not merge projects.',
    failures: [
      'Missed retrieval / bad chunking',
      'Stale versions retrieved',
      'Inconsistent metrics that look plausible',
      'ACL bypass → unauthorized visibility',
    ],
    concepts: [
      'Embedding / vector DB',
      'Hybrid search / rerank',
      'NL2SQL / semantic layer',
      'CDC / lakehouse / OLAP',
      'Citation grounding',
    ],
    morphologies: ['Form A · Knowledge Q&A', 'Form B · Data Q&A'],
    color: '#3d9b8f',
  },
  {
    id: 'L3',
    name: 'Function calling',
    subtitle: 'Act',
    solves: 'Let the model express “call tool X with params Y”—from speech only to doing.',
    insight:
      'Most important line in the map: the model executes nothing. It emits structured suggestions; your host runs tools. The security boundary is always the host.',
    failures: ['Param hallucination', 'Wrong tool choice', 'Infinite same-tool loops'],
    concepts: ['Function Calling', 'Tool Use', 'JSON Schema', 'Structured output'],
    morphologies: ['Form D · Workflow automation (select nodes)'],
    color: '#c9a227',
  },
  {
    id: 'L4',
    name: 'Standard tool access',
    subtitle: 'MCP & reusable assets',
    solves: 'Without a standard, every app×system is a custom adapter. MCP exposes capabilities once for reuse.',
    insight:
      'Value is economics, not raw ability. Current spec is sessionless and scales as HTTP; enterprise rollout needs the auth extension so the agent inherits the initiator. Decide before the first Agent project.',
    failures: ['Vague tool descriptions → wrong pick', 'Version drift silent failure', 'ACL bypassed at protocol layer', 'SDK still on the sessionful spec'],
    concepts: ['MCP', 'Sessionless spec', 'Tools / Resources / Prompts', 'Tool registry', 'Enterprise auth'],
    morphologies: ['Base for forms D / E'],
    color: '#d4a054',
  },
  {
    id: 'L5',
    name: 'Agent (loop)',
    subtitle: 'One call is not enough',
    solves:
      'Real tasks need multi-step loops: act, observe, replan. Decision of “what next” moves from if-else to runtime model choice.',
    insight:
      'Engineering cost cliffs regardless of model strength: non-enumerable paths → state recovery, budgets, idempotency, audit, HITL, eval sets. A “platform” truly starts here.',
    failures: [
      'Non-converging loops',
      'Drift off task',
      'Inconsistent mid-business state',
      'Cost blowups',
      'Non-reproducible behavior',
    ],
    concepts: ['Runtime', 'ReAct', 'Plan-and-Execute', 'Memory', 'HITL', 'LangGraph / MAF'],
    morphologies: ['Form E · Bounded autonomous agent'],
    color: '#e07058',
  },
  {
    id: 'L6',
    name: 'Multi-agent',
    subtitle: 'One is not enough',
    solves: 'When one agent cannot hold context/tools, split roles and add coordination.',
    insight:
      'Problems become organizational: who supervises, conflict resolution, failure cleanup, explainable chains. MCP is tools; A2A is agent-to-agent handoff; both now share a foundation. Benefits are often overrated—many “multi-agent” needs are L3 or L5.',
    failures: ['Coordination > parallel gain', 'Error amplification', 'Multiplied cost', 'Near-impossible attribution'],
    concepts: ['A2A', 'Agent Card', 'Fan-out / pipeline', 'Manager–worker', 'Debate'],
    morphologies: ['Form F · Multi-agent (mostly dissuade)'],
    color: '#c44d6a',
  },
]

export const crossCutsEn = [
  {
    title: 'Observability',
    body: 'OpenTelemetry, GenAI conventions, Langfuse/Phoenix. Higher layers need full traces because behavior is non-reproducible.',
  },
  {
    title: 'Evaluation',
    body: 'Eval sets, Ragas/DeepEval, LLM-as-Judge. Above L2, no eval set means no production.',
  },
  {
    title: 'Security',
    body: 'Injection, guardrails, identity propagation. Surface grows: L2 consumes docs, L3 acts, L5 chooses what to act.',
  },
  {
    title: 'Cost & deploy',
    body: 'Caches, gateways, budget breakers. Route by task/classification/cost; design prefixes to hit prompt cache. L1 is one call; L5 may be hundreds per task.',
  },
]

export const lawsEn = [
  {
    title: 'Higher layers, less model share of success',
    body: 'Stronger models help L1/L2 a lot; L5 outcomes rarely hinge on model choice. Most Agent failures are not “too dumb”.',
  },
  {
    title: 'Layer boundaries keep moving down',
    body: 'Keep layers replaceable: flexible inside, standard outside. Swapping an orchestrator should touch only adapters.',
  },
]
