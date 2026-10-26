# AI Requirements Selection Handbook (MDB edition)

**Who it is for**: solution architects. After a business unit brings a request, use this doc to decide form, components, and products.

**How to use** (three entry points):

- Clear requirement → Chapter 2 **triage tree** (five questions), then Chapter 3 for components/products of that form.
- Fuzzy or “we’ve seen this before” → Chapter 6 **scenario library**, match the business quote.
- Unsure, or writing a proposal/review pack → Chapter 5 **attribute scorecard** (seven dimensions), then read the rule combinations.

**Two premises**: (1) tech foundations are roughly greenfield, so Chapter 7 gives build order; (2) this institution’s compliance, classification, and accountability bars are higher than typical enterprises—Chapter 4.2 hard constraints apply to every form.

---

# 1. Kill one myth first

Industry often splits AI systems into RAG, Copilot, Workflow, Agent. Using that for selection fails: the four words are not on one layer—RAG is a technique, Copilot a product shape, Workflow a control structure, Agent a degree of autonomy. Real systems are often all four at once. So “which class is this requirement?” is the wrong question.

This handbook asks two things instead: **Does the requirement output information or action? If action, can we draw the path in advance?** From those, land on six deliverable forms.

---

# 2. Triage decision tree

Answer in order; stop when you have a conclusion.

### Q1: Is the final output “information” or “action”?

Information = answers, reports, drafts for humans who then decide.  
Action = the system really changes something (approve a withdrawal, publish a procurement notice, update risk ratings, submit to donors, write the loan system).

- Information → Q2  
- Action → jump to Q4  
- Unclear → usually two asks packed as one. **Split; do the information half first.** Most common project rescue.

### Q2: Where do answers come from?

- Unstructured materials (policies, handbooks, evaluations, board papers) → **Form A: knowledge Q&A**  
- Structured systems (loan, procurement, finance, results) → **Form B: data Q&A**  
- New content (concept notes, supervision drafts, country briefs) → **Form C: assisted drafting**  
- Both sources → not one project. A and B barely share a stack. Do one first, route later if needed.

### Q3 (A and B only): Closed or open question space?

List question types. If you can finish and stay under ~50, **it is closed—do not build retrieval or NL2SQL**. Classifier + parameterized templates are an order of magnitude cheaper and more accurate.

Full A/B stacks only when types truly cannot be listed.

Often ignored: many “smart Q&A” projects find 80% of traffic on a dozen questions (procurement thresholds, contract routes…).

### Q4: Can you draw the action path as a flowchart in advance?

- Yes, branches enumerable → **Form D: workflow automation**  
- No, but domain is narrow (≈10–15 systems/APIs, single business unit) → **Form E: bounded autonomous agent**  
- No, multi-domain or multi-path parallel → **Form F: multi-agent** (read Chapter 3 F dissuasion first)

Do not overstate uncertainty. Business saying “every project is different” often means nobody mapped the process. Spend a week drawing; if it draws, take D—you save money *and* two years of maintenance/audit pain.

### Q5 (D/E/F): Is the action reversible?

- Fully reversible (drafts, temp tables, todos) → auto-run with rollback  
- Compensatable (internal ledgers that can reverse) → auto + compensation + full audit  
- Irreversible or external → **forced human confirmation gate** + full audit trail  

This institution has many third-class actions: any funds payment/withdrawal approval, external procurement notices and awards, board submissions, external stats, sanctions/integrity determinations, formal letters to governments or borrowers. Non-negotiable.

---

# 3. Six forms: components and products

Each form: what it is, required components, product candidates, duration, dissuaders. Product lists are starting points—verify versions, community, and procurement/security compliance.

## Form A: Knowledge Q&A (read-only · unstructured)

**Typical**: askable procurement guides/handbooks; evaluation findings; safeguard clauses; board resolutions (classification hard constraint).

**Must**: doc parse/OCR, chunking, vector DB, embedding, retrieve+rerank, LLM, **citations**, **ACL at retrieval**.

Both last two are mandatory here. Citations must land on specific clauses. ACL must filter at the vector/index layer by clearance—**not hide at display** (that already put secrets into model context).

**Optional**: query rewrite, multilingual, knowledge graph (only for multi-hop relation asks).

**Products**: Milvus/Qdrant/Weaviate/pgvector; BGE/Conan; bge-reranker/Cohere; MinerU/Unstructured/PaddleOCR; Dify/RAGFlow or custom. Pick RAGFlow for parse quality and citation grounding; from 0.27 the UI dropped GraphRAG/RAPTOR and aims at knowledge compilation for agents—do not plan around the old buttons.

**Duration**: 2–6 weeks excluding doc cleanup and classification labeling—the real time sink.

**Dissuade**: &lt;100 rarely updated docs → stuff full context; multi-version policies with no effective version → fix records first.

## Form B: Data Q&A / DataAgent (read-only · structured)

**Typical**: natural-language portfolio queries; disbursement progress; results indicators; co-financing stats.

**Must**: source ingest, **semantic layer (metrics)**, NL2SQL, SQL sandbox (timeouts, scan limits, ACL), viz, metric lineage.

**Optional**: auto-EDA, attribution, anomaly detection.

**Products**: Doris/StarRocks/ClickHouse/DuckDB; Cube/MetricFlow or in-house metrics tables; Vanna/DB-GPT/WrenAI.

**Duration**: 4–8 weeks if semantic layer ready; else **3–6 months metrics governance first**.

**Highest failure rate** among the six—almost always metrics, not models. Typical metric conflicts: amount definitions, FX rates and dates, fiscal vs calendar year, ownership allocation, “completion” status.

If no authoritative definitions, this is a data-governance project, not AI. State that in the proposal.

**Extra**: outputs that may go external (annual reports, open data) must default to “internal reference, not confirmed by finance/statistics” and stay firewalled from publish channels.

**Dissuade**: fixed reports → parameterized templates in a week; undocumented fields/migration mess → fix metadata first.

## Form C: Assisted drafting (human confirms at the end)

**Typical**: concept notes; supervision report drafts; board summaries; country briefs; completion report drafts.

**Must**: LLM, prompt templates + versions, context injection, **editable human UI**.

**Optional**: retrieve similar past projects (often the highest value), house style templates, version compare.

**Products**: model API + gateway; Dify-style UI or custom.

**Duration**: 1–3 weeks.

**Advice**: first AI project should often be C—fast, low risk, builds gateway/prompt/observability/classification basics.

**Note**: inputs may be highly classified; settle deploy form and data egress on project one.

## Form D: Workflow automation (fixed path · writes business data)

**Typical**: withdrawal package completeness/entry; procurement notice classify/archive; consultant CV ingest; contract field extract.

**Must**: triggers, orchestration engine, API adapters, **idempotency keys**, retry/backoff, alerts, audit log.

**Optional**: LLM—only on a few nodes.

**Critical judgment**: LLM should usually appear on one or two nodes only; the rest is classic integration. Handing the whole path to an autonomous Agent is over-design—expensive, unstable, hard to replay for audit.

**Products**: Temporal, Camunda, n8n, Airflow; extract via model API. **Do not start with LangGraph-class Agent frameworks** for fixed paths.

**Duration**: 3–8 weeks, mostly legacy integration—pessimistic estimates.

**Dissuade**: borrower-submitted messy formats → sample first; no API / UI scrape → maintenance and audit risk.

## Form E: Bounded autonomous agent (open path · narrow domain)

**Typical**: why disbursement stalled; complaint precedent search; safeguard self-check lists.

**Four preconditions (all required)**: ≤15 tools; single business domain; failure tolerable/rollback; clear “done” criteria. Else fall back to D.

**Must**: Agent runtime (persist/resume), tool registry & schemas, identity (inherit initiator—not service-account union), timeouts & token budgets, full tracing, HITL, audit, **eval set**.

**Two under-estimated costs**: (1) tool onboarding = five actions each (register, validate, isolate, normalize results, error return); (2) stop criteria as a *set* (done, max iter, timeout, cost, confidence).

**Products**: LangGraph (default when the path is open and you need resume/approval gates); Microsoft Agent Framework (Microsoft stack, native MCP/A2A). CrewAI is fine for role prototypes—review its code-execution sandbox before production. AutoGen is in maintenance mode; do not start new work on it. Four further SDKs can be shortlisted as alternatives (pick by cloud and model stack; see the table below): OpenAI Agents SDK, Google ADK, Claude Agent SDK, AWS Strands Agents. MCP (the 2026-07-28 spec removed protocol-level sessions; enterprise auth is the Enterprise-Managed Authorization extension); Langfuse/Phoenix; LiteLLM/Higress; container sandbox—and treat allowlisted proxies, shared registries, and eval fixtures as part of the blast radius.

**Framework hard questions**: auto context compression strategy; serializable/resumable state granularity; suspend for external events (approval/callback).

**New candidates against the three hard criteria** (versions checked 2026-10-26 on PyPI / npm; capabilities per the official docs listed below the table):

| Framework | Current version | 1. Context compression | 2. State serialise / resume | 3. Suspend for external events | Notes |
|---|---|---|---|---|---|
| OpenAI Agents SDK | Python 0.24.0 / JS 0.21.0 (still 0.x) | Yes: `OpenAIResponsesCompactionSession` wraps a session and calls the Responses API `responses.compact` when a trigger fires (default: 10 accumulated non-user items; can be token-based or custom); compaction can also be forced at a phase boundary. OpenAI Responses models only | Yes: `RunState` serialises to JSON and resumes later | Yes: tools set `needs_approval`; the run pauses with pending approvals and resumes after approve/reject; the paused state can be serialised and resumed in another process | Docs warn deserialisation is not authenticated; keep snapshots in trusted storage |
| Google ADK | Python 2.13.0 / JS 2.3.0 | Yes: `EventsCompactionConfig` with two strategies—sliding-window summaries by invocation count (`compaction_interval` + `overlap_size`), or a token threshold that keeps the last N raw events (`token_threshold` + `event_retention_size`); the summariser model is configurable | Yes (experimental): `ResumabilityConfig(is_resumable=True)` checkpoints per event; on resume it reinstates completed events and successful tool results and re-runs the unfinished step. Docs call it best-effort and at-least-once: unfinished tools may re-run and must be idempotent; in-memory state is lost on resume | Yes: Tool Confirmation; `require_confirmation` can be always-on or decided from arguments (e.g. an amount threshold), and can collect structured input; with Resumability the run can pause and resume. Since Python 2.13.0 Tool Confirmation is stable rather than experimental; `EventsCompactionConfig` and `ResumabilityConfig` remain experimental | Tightly tied to Gemini / Vertex; assess separately off Google Cloud |
| Claude Agent SDK | Python 0.2.174 (Alpha) / TS 0.3.310 | Yes: near the context limit it automatically summarises older history and emits a `compact_boundary` system message; a `PreCompact` hook can archive the full transcript first | Yes: `resume` by session ID restores full context; `fork_session` copies the history into a new branch and leaves the original unchanged; a `session_store` adapter mirrors transcripts to your own backend so another host can resume. Granularity is the session (conversation); forks branch the conversation, not file changes | Partial: `canUseTool` is an in-process callback, so a human can confirm while the process waits; the docs describe no way to pause, let the process exit, and continue the same tool call after approval. Across a restart, deny and end the turn, then `resume` the session after approval. Since TS 0.3.301, sdk-type MCP server configs accept a per-tool `permission_policy` (`always_ask` or `always_deny`); as of Python 0.2.174 its changelog still has no matching entry (待核实) | Still 0.x Alpha; pin versions before production |
| AWS Strands Agents | Python 1.62.0 (Production/Stable) / TS 1.22.0 | Yes: three conversation managers—`SlidingWindowConversationManager` (default, keeps the last 40 messages, can truncate oversized tool results), `SummarizingConversationManager` (summarises roughly the oldest 30% of messages, keeps at least the last 10), `NullConversationManager` (no management); proactive compression at 70% context use can be enabled | Yes: session manager persists state, including interrupts | Yes: interrupts raised from hooks or tools; resume by answering the interrupt id; interrupt state persists via the session manager and can be answered in a new session | 1.x stable; AWS-friendly. Since TS 1.22.0 the `limits` passed to `invoke` (turns, output tokens, total tokens) apply to the whole agent tree—sub-agents called as tools and Graph / Swarm nodes all count—so they can serve directly as the iteration and cost caps in the stop criteria; no matching change seen in the Python SDK (待核实) |

Verdict: all four have official support for criteria 1 and 2, with different details—ADK resume is experimental and at-least-once, so tools must be idempotent; Claude Agent SDK resumes at session level. On criterion 3, OpenAI Agents SDK, ADK and Strands can persist a paused-for-approval state and continue later; Claude Agent SDK only offers an in-process approval callback, so long human-approval waits need your own design. Defaults are unchanged—LangGraph stays the default, and Microsoft Agent Framework stays first choice on the Microsoft stack.

Sources: OpenAI https://openai.github.io/openai-agents-python/human_in_the_loop/ , https://openai.github.io/openai-agents-python/sessions/ ; ADK https://adk.dev/tools-custom/confirmation/ , https://adk.dev/context/compaction/ , https://adk.dev/runtime/resume/ , https://adk.dev/api-reference/java/com/google/adk/apps/ResumabilityConfig.html , https://github.com/google/adk-python/releases/tag/v2.13.0 ; Claude https://code.claude.com/docs/en/agent-sdk/sessions , https://code.claude.com/docs/en/agent-sdk/agent-loop , https://code.claude.com/docs/en/agent-sdk/permissions , https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md ; Strands https://strandsagents.com/docs/user-guide/sdk/agents/conversation-management/ , https://strandsagents.com/docs/user-guide/concepts/interrupts/ , https://github.com/strands-agents/sdk-python/releases/tag/python%2Fv1.62.0 , https://github.com/strands-agents/sdk-python/releases/tag/typescript%2Fv1.22.0 , https://github.com/strands-agents/sdk-python/pull/4667 .

**Duration**: 8–16 weeks including eval system.

**Dissuade**: “handles anything”; no definition of correct; sanctions/integrity/grievances → summarize only, humans conclude.

## Form F: Multi-agent

**Typical**: country diagnostic packs; cross-dept diligence assembly.

**Patterns**: fan-out, pipeline, manager–worker, debate.

**Dissuade first**: most “multi-agent” needs are D or E. Coordination, conflict, debug, cost, and audit explainability usually dominate. Only when subtasks are truly independent/parallel or professional contexts must stay separate.

**Products**: meet every Form E requirement first. Use A2A between agents; the frameworks above all ship multi-agent orchestration (e.g. OpenAI Agents SDK handoffs, ADK agent hierarchies, Strands multi-agent patterns), but inter-agent messages must be authenticated and validated (OWASP ASI07).

**Duration**: 16+ weeks; ship E monolith first.

---

# 4. Cross-form baselines

## 4.1 General

**Cost breakers** per request/session/day.  
**Full tracing** (OpenTelemetry + Langfuse-class)—replay is the production/audit gate. Emit OpenTelemetry GenAI semantic conventions so traces stay portable across tools; for the concept-to-span mapping and content-capture privacy rules, see the concept handbook, Lecture 8.  
**Outputs are untrusted**—never raw into SQL/DOM/shell.  
**Injection posture**—assume hostile external content (borrower files, bids, scraped pages, inbound mail); least privilege + action gates, not a system-prompt line.  
**Version & rollback** for prompts, models, tool schemas. For staged release, rollback, drift monitoring and a postmortem template, see *Release and operations checklist* (`release-and-operations-checklist.md`).

## 4.2 Institution-specific hard constraints

**Classification before features**—filter at retrieval, not display.  
**Data egress & deploy form**—decide before kickoff; it constrains models/frameworks.  
**Accountable trails**—who/when/inputs/advice/confirmer.  
**No AI conclusive judgments** on sanctions, integrity, grievances, safeguard determinations—retrieve/summarize only. Model-first conclusions anchor later “reasons” as post-hoc rationalization; reverse the order.  
**External publish firewall** + default “internal reference.”  
**Multilingual**—MT is working draft unless human-reviewed for official text.

---

# 5. Attribute scorecard

Seven dimensions scored 0–3 for reviews when the tree is ambiguous.

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **1. Decision rights** | Human; system informs | System drafts; human confirms | System picks fixed branches | System generates paths at runtime |
| **2. Scope** | Read-only text | Read-only cross-system | Write own state/drafts | Write business / external emit |
| **3. Reversibility** | Fully reversible | Compensatable | Hard to restore | Irreversible / external / funds |
| **4. Domain width** | Single form/API | Single system | Single business domain | Cross units |
| **5. Runtime length** | Seconds | Minutes | Hours | Multi-day / async |
| **6. Data readiness** | Authoritative metrics | Warehouse, no unified metrics | DBs, no warehouse | Scattered systems |
| **7. Verifiability** | Gold answers auto-check | Spot-checkable | Subjective only | Volume exceeds human review |

Plus two yes/no flags: **classification touch**, **accountability-sensitive**.

**How to read**:

- Dims 2 and 3 both ≥2 → human gate + full audit (mandatory).  
- Dim 3=3 and dim 1≥2 → not approvable; force dim 1 ≤1.  
- Dim 6≥2 and Form B → metrics governance first.  
- Dim 7=3 → requirement invalid.  
- Dim 1=3 and 4=3 → research, not delivery.  
- Total &lt;6 → skip Agents; rules/templates/engines win.  
- Dim 5≥2 → durable orchestration; most light frameworks out.

---

# 6. Scenario library

Match business unit quotes:

- “Make the procurement guide askable” → A (effective version + exceptions).  
- “Search lessons in past evaluation reports” → A (citations + year).  
- “Board documents askable?” → A, classification is the hard problem.  
- “Query portfolio without waiting for reports” → B (define commitment amount first).  
- “Talkable portfolio cockpit” → B (latency + metric alignment).  
- “Auto country briefs” → B + C, two phases, country team reviews text.  
- “Draft supervision report” → C (history inject &gt; prose quality).  
- “Draft concept note” → C (+ similar project retrieval).  
- “Loan agreement risk review” → A + C; legal concludes; never auto-approve.  
- “Auto-review withdrawals” → D + human gate; kill “auto-disburse.”  
- “Auto sanctions screen” → D, accountability-sensitive; compliance decides hits.  
- “Auto integrity DD” → summarize only; no ratings/conclusions.  
- “Auto-classify and publish notices” → D; publish needs human confirm.  
- “Smart CV matching” → A or D; no evaluative judgments on candidates.  
- “AI find why disbursement stalled” → E (good fit); writes behind gates.  
- “Auto preliminary judgment on complaints” → E retrieval only; no judgment.  
- “Auto aggregate results indicators” → B; data availability first.  
- “Member-language files askable” → multilingual pilot on real files.  
- “Search old scans” → OCR sample first.  
- “AI research other MDBs on the web” → injection exposure; min tools; human-verify sources.  
- “Similar grievance precedents” → A, highly sensitive; no case conclusions.  
- “AI platform for every request” → vision, not a requirement; triage first three scenarios.  
- “Org X went live—we need the same” → pilot vs production (~10× gap).  
- “Find portfolio anomalies” → likely classic anomaly detection; model narrates.

---

# 7. Build order from zero

**Layer 0 (first)**: model gateway, prompt versioning, observability, cost breakers, **deploy form & data egress policy**. The gateway should route across vendors by task, classification, and cost rather than hard-wiring one model per project. Design fixed system prompts and retrieval prefixes to hit Prefix/Prompt Cache—the main cost lever for Forms A and C. Open-weight models make self-hosted inference more realistic than before; procurement, classification review, and supply-chain checks still apply.  
**Layer 1 (pick one path)**: knowledge pipeline + vectors + classification ACL *or* warehouse/OLAP + metrics.  
**Layer 2 (when D/E)**: tool registry, state store, orchestration, sandbox, identity inheritance.  
**Layer 3 (when E/F)**: evals, red team, fine cost attribution, multi-agent coord.

**Suggested project sequence**: Form C to stand up Layer 0 → Form A on public docs → start metrics governance for B → only then D/E. Matching capability growth to risk exposure matters; a first project on funds or board files can burn institutional patience.

---

# 8. Red-flag list

- Business cannot define “done right”  
- Demands “100% accuracy”  
- Scope words “all / any / fully automatic”  
- Funds, external publish, board, sanctions/integrity without human gates  
- Restricted+ materials with unclear who may see what  
- Process/metrics already messy  
- Borrower-submitted data of uncontrolled quality  
- Demo video as the requirement  
- No business owner—only IT pushing  

---

# 9. Notes on the source book

If the team uses *Enterprise Agent Platform Engineering*:

- Do not use the four-way split for selection.  
- RAG is now under context engineering.  
- Missing dimensions: multi-agent org design, long-running resume, blast radius.  
- Compliance chapters are generic enterprise; IOs need extra (data sovereignty, board classification, IEG/audit trails).  
- Product lists go stale.  
- Data-governance weight for Form B is a go/no-go.  
- Risk stratification (Part I Ch.2) pairs well with this scorecard.
