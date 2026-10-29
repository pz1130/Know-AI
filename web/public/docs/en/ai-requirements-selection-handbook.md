# AI Requirements Selection Handbook (MDB edition)

Who it is for: solution architects. When a business unit brings a request, use this document to decide what form to build, which components you need, and which products to shortlist.

How to use it — pick one entry point:

- If the requirement is already clear, walk the Chapter 2 triage tree. Five questions land you on a form; then open Chapter 3 for that form's components and products.
- If the requirement is fuzzy, or it sounds familiar, start with the Chapter 6 scenario library and match the business unit's own wording.
- If you are unsure, or you need material for a proposal or design review, use the Chapter 5 attribute scorecard. Score seven dimensions, then read the combination rules.

Two premises up front. First, assume the technical foundation is roughly greenfield, so Chapter 7 gives a build order. Second, this institution's compliance, classification, and accountability bars sit higher than a typical enterprise; the hard constraints in Chapter 4.2 apply to every form and cannot be skipped.

---

# 1. Kill one myth first

Industry writing often splits AI systems into RAG, Copilot, Workflow, and Agent. Using that split for selection fails, because the four words do not sit on one layer: RAG is a technique, Copilot a product shape, Workflow a control structure, Agent a degree of autonomy. A real system is often all four at once — a Copilot UI, RAG retrieval, a hard-coded process skeleton, plus a few nodes where the model decides. So "which class is this requirement?" is the wrong question; it cannot produce an answer.

This handbook asks two things instead. Does the requirement output information or an action? If it is an action, can we draw that path in advance? From those two questions you land on six deliverable forms.

---

# 2. Triage decision tree

Answer in order. Stop when you have a conclusion.

### Q1: Is the final output "information" or "action"?

Information means answers, reports, or drafts for a human who then decides what to do. Action means the system really changes something — approve a withdrawal, publish a procurement notice, update a project risk rating, submit a report to donors, write into the loan system.

- Output is information: continue with Q2.
- Output is action: jump to Q4.
- Unclear: the requester usually packed two asks into one. Split them and do the information half first. That is the most common way to rescue a project. A business unit saying "build a smart withdrawal assistant" often wants both historical disbursement lookup (information) and auto-approval of complete packages (action). Those two differ in timeline, risk, and approval gates; bundling them only delays both.

### Q2: Where do answers come from?

- Unstructured materials such as policy files, operational handbooks, appraisal reports, evaluation reports, or board papers: Form A, knowledge Q&A.
- Structured systems such as loan, procurement, finance, or results monitoring: Form B, data Q&A.
- New content such as concept notes, supervision mission drafts, or country briefs: Form C, assisted drafting.
- Both sources: do not treat it as one project. Forms A and B barely share a stack, and their timelines and risks diverge. Build one first, then add a router on top if needed. A "country brief," for example, needs portfolio disbursement figures and citations from the country strategy and safeguard policies; the right split is Form B for numbers plus Form C for prose, delivered in two phases.

### Q3 (A and B only): Is the question space closed or open?

List the types of questions users might ask. If you can finish the list and stay under roughly fifty types, the need is closed — do not build retrieval or NL2SQL. A classifier plus parameterized templates costs an order of magnitude less and is far more accurate.

Only when the types truly cannot be listed, and users will ask from many angles in many phrasings, is the full Form A or B stack worth it.

This rule is ignored more often than people admit. Many "smart Q&A" projects later find that 80% of traffic concentrates on a dozen questions — procurement thresholds, which method a contract type should use, how much a trust fund can still commit this fiscal year. Those belong in parameterized queries, not a vector index.

### Q4: Can you draw the action path as a flowchart in advance?

- Yes, and the branches are enumerable: Form D, workflow automation.
- No, but the domain is narrow (about 10–15 systems or APIs, inside one business unit): Form E, bounded autonomous agent.
- No, and it crosses business domains or needs multi-path parallelism: Form F, multi-agent collaboration. Read the Form F dissuasion in Chapter 3 first.

The common mistake is overstating uncertainty. When a business unit says "every project is different, we cannot fix a process," it often means nobody has mapped one. Much of this bank's work already has written operational manuals and approval matrices — withdrawals, procurement, contract amendments all have fixed nodes. Spend a week drawing the flow with the business side, then decide. If it draws, take Form D; you save money and two years of maintenance and audit pain.

### Q5 (follow-up for D, E, F): Is the action reversible?

- Fully reversible — drafts, temporary tables, to-dos: auto-run with rollback is fine.
- Compensatable — for example an internal ledger entry that can be reversed: auto-run plus compensation transactions plus full audit.
- Irreversible or external: forced human confirmation gate, and a complete audit trail is mandatory.

This institution has an unusually large share of third-class actions. Spot them at requirements time: any funds payment or withdrawal approval; external procurement notices and contract awards; board submissions; external data and statistical definitions; any sanctions or integrity determination; formal letters to member governments or borrowers. These are non-negotiable. Do not relax them because a business unit finds the process slow.

---

# 3. Six forms: components and products

Each form gives three layers — what it is, which component classes it needs, which products to shortlist — plus a duration estimate and dissuasion signals.

Treat product lists as starting points, not conclusions. This field turns over quickly; before you commit, check the current version and community activity, and run a compliance assessment against this bank's procurement and information-security rules.

## Form A: Knowledge Q&A (read-only · unstructured)

Typical asks: make procurement guides and operational handbooks askable; search past appraisal and completion reports; query Independent Evaluation findings and lessons; consult safeguard policy clauses; look up board resolutions and precedents.

Required components cover the full chain. Document parsing must handle scan OCR, because many historical policies and reports here are scanned PDFs. Chunking, a vector store, an embedding model, retrieve-and-rerank, and an LLM are all needed. Two more pieces are non-negotiable in this bank. Citation grounding must land answers on specific clauses in specific files — staff will use them to support decisions, and answers without a source will not be trusted. Access control must filter at the vector-index layer by the user's clearance, because the corpus mixes public, internal, and board-confidential material; filtering only at display time already put secrets into the model context.

Add optional pieces only when needed. Query rewrite helps when users ask in spoken language. Multilingual support matters when member-language files dominate. A knowledge graph is worth it only when the ask is truly relational — "how is this project related to that trust fund?"

Product candidates: vector stores Milvus, Qdrant, Weaviate, or pgvector when volume is modest; embeddings from the BGE or Conan families, watching member-language coverage; rerankers bge-reranker or Cohere Rerank; parsers MinerU, Unstructured, PaddleOCR; platforms Dify or RAGFlow, or build in-house. Prefer RAGFlow for parse quality and citation grounding; from 0.27 its UI dropped GraphRAG / RAPTOR and aims at knowledge compilation for agents — do not plan around the old buttons.

Duration: about 2–6 weeks, excluding document cleanup and classification labeling. The real time sink is cleaning files and labeling clearance, not the tech. Many historical files here are scans, lack a uniform classification tag, and keep several revisions of the same policy in parallel; those problems come first.

Dissuasion: fewer than a hundred rarely updated documents — put the full text in context, do not build a vector store. Multiple policy versions with no one able to say which is effective — fix records first, or you only spread obsolete clauses faster; citing an outdated procurement clause in this bank will cause real trouble.

## Form B: Data Q&A / DataAgent (read-only · structured)

Typical asks: natural-language portfolio queries; project disbursement progress; "energy-sector commitments in Southeast Asia this fiscal year"; results-indicator rollups; co-financing statistics.

Required components are built around "askable, correctly computed, and auditable." After source ingest, the semantic layer (metric definitions) is the real foundation; only then come NL2SQL, a SQL execution sandbox (timeouts, scan limits, and permissions mandatory), visualization, and metric lineage. Without the semantic layer, every later step amplifies error.

Optional pieces — auto exploratory analysis, attribution, portfolio anomaly detection — all assume metrics are already unified.

Product candidates: OLAP engines Doris, StarRocks, ClickHouse, or DuckDB for local or light cases; semantic layer Cube or MetricFlow, or an in-house metrics definition table; NL2SQL references Vanna, DB-GPT, WrenAI.

Duration depends on the semantic layer: 4–8 weeks if it is ready; otherwise 3–6 months of metrics governance first.

This form has the highest failure rate of the six, and multilateral development banks are especially exposed. Failures almost never come from the model; they come from missing unified metrics. Typical metric conflicts here include at least these layers:

First, amount definitions. The same "commitment" may mean board-approved amount, signed amount, effective amount, or net of cancellations — different units' reports do not use the same one. "Disbursement" likewise splits into cumulative, period, and whether advance payments are included.

Second, currency and FX. How local currency, USD, and SDR convert, and which date's rate to use (signing, effectiveness, payment, or period-end), often differs by system default; the same transaction yielding two figures is common.

Third, time. Fiscal year and calendar year diverge, and some members still report on their own fiscal calendars.

Fourth, ownership. How regional projects allocate to countries, how this bank's share of co-financing is counted, whether technical assistance enters the portfolio.

Fifth, status. Whether a project is "completed" means physical completion, financial closure, or a submitted completion report.

Without an authoritative definition for each, every NL2SQL answer is wrong in a quiet way: the number looks plausible, yet it is 8% off finance's figure. If discovery shows no unified definitions, this is a metrics-governance project, not an AI project. Say so plainly in the proposal; do not force a connection.

External risk needs equal attention. This bank's numbers often go outside — annual reports, open-data portals, development-effectiveness reviews. Once an AI-generated figure is cited externally, the error becomes an institutional reputation event. Outputs from such systems must default to the label "internal reference, not confirmed by finance or statistics," with a clear firewall from publish channels.

Dissuasion: if the business side really wants a handful of fixed portfolio reports, ship parameterized templates in a week. If source fields lack comments and history carries several migration leftovers, fix metadata first.

## Form C: Assisted drafting (human confirms at the end)

Typical asks: draft a project concept note; generate a supervision mission report first draft; summarize board papers; produce a country brief; draft a completion report; draft a technical-assistance proposal.

Required components are few: an LLM, versioned prompt templates, context injection, and an editable human UI. This bank's documents already pass through multi-level review, so human confirmation at the end is an existing control — do not bypass it for "full automation."

Among optional pieces, retrieval is often the highest-value part, especially when similar past project files should be referenced; house style and template libraries, plus version compare, also help.

Products: a model API plus gateway is enough; build the UI or stand it up quickly with a Dify-class platform.

Duration: about 1–3 weeks.

If you are just starting, the first AI project should usually be this form. It is the simplest tech, the fastest to show value, and the lowest risk, and it forces the team to stand up model access, prompt management, observability, and classification handling — basics every later project will reuse. Practicing here is wiser than opening with portfolio data Q&A. A common starter is "help the task team leader draft a supervision mission report"; the value comes mainly from pulling in past supervision records and project basics, not from the model's prose.

Drafting risk is low, but input materials can be highly classified — country strategy drafts, pre-board discussion papers. Settle how the model service is deployed, whether data leaves the institution, and whether the vendor retains content, on project one; do not wait until project three.

## Form D: Workflow automation (fixed path · writes business data)

Typical asks: completeness check and entry for withdrawal packages; classify and archive procurement notices; ingest and tag consultant CVs; roll up trust-fund donor reports; extract contract fields into a system of record.

Required components are the classic integration set: triggers, an orchestration engine, wrappers for external system APIs, idempotency keys, retry with backoff, failure alerts, and an audit log. Without idempotency and audit, you cannot safely re-run after a failure, and you cannot explain yourself to the audit committee.

An LLM is optional, and only on a few nodes.

The critical judgment in this section: the model should usually appear on one or two nodes only — for example extracting invoice fields from withdrawal attachments into structured data, or classifying a procurement notice into a sector. Everything else is traditional system integration and should stay hard-coded. Handing the whole path to an autonomous Agent is classic over-design: expensive, slow, unstable, and impossible to replay for the audit committee when something goes wrong.

Product candidates for orchestration: Temporal (strong on long-running work and recovery), Camunda (strong on multi-level human approval flows, a natural fit for this bank's approval matrices), n8n (light, many connectors), Airflow (data-task oriented). Call the model API directly on extract nodes. Do not start with LangGraph-class Agent frameworks; they solve open-path problems, and your path here is fixed.

Duration: about 3–8 weeks, mostly spent integrating internal systems. Loan, procurement, and finance systems here are often aged with limited APIs; estimate that work pessimistically.

Dissuasion: data comes from borrower implementing agencies in uncontrolled formats and quality — run a real sample round before you quote a timeline. Systems you must connect have no API and only a UI to scrape — weigh maintenance cost; such designs are also hard to defend in audit.

## Form E: Bounded autonomous agent (open path · narrow domain)

Typical asks: automatically investigate why a project's disbursement stalled (tracing clues across loan, procurement, and finance systems); preliminary classification of a procurement complaint plus related precedent search; generate a self-check list for a project's safeguard compliance.

Four preconditions, all required: tool count controllable (within 15); single business domain; failure tolerable or rollbackable; a clear "done" criterion. Miss any one and fall back to Form D and re-split the requirement.

Required components go beyond Form D. The Agent runtime must include state persistence and resume; you also need tool registry and schema management, permission and credential management, timeout and token budgets, full tracing, human intervention points, an audit log, and an evaluation set. Identity is especially critical: does the Agent access business systems as the initiator, or under a service account? In this bank it must be the former; otherwise the effective permission equals the union of all users and will not pass information-security review.

Two places teams most often under-estimate work. First, tool onboarding. "Connect ten systems" is five actions each: register and declare the schema, validate parameters (models invent values), isolate execution, normalize results, and return errors. The last two are often missing from vendor quotes, yet without them the Agent repeats the same failure. Second, stop criteria. How the Agent stops must be defined as a set at requirements time, not a single flag: task-done criterion, max iterations, timeout, cost cap, confidence threshold. That is the concrete form of the "clear done criterion" above. If the business side cannot say when it should stop, do not start the project.

Product candidates: orchestration defaults to LangGraph when the path is open and you need resume or approval gates; on a Microsoft stack prefer Microsoft Agent Framework (native MCP / A2A). CrewAI is fine for role prototypes; review its code-execution sandbox before production. AutoGen is in maintenance mode — do not start new work on it. Four further SDKs can be shortlisted (pick by cloud and model stack; see the three hard criteria table below): OpenAI Agents SDK, Google ADK, Claude Agent SDK, AWS Strands Agents. Tool protocol: MCP (the 2026-07-28 spec removed protocol-level sessions; enterprise landing looks at Enterprise-Managed Authorization). Tracing: Langfuse, Phoenix. Model gateway: LiteLLM, Higress AI Gateway. Sandbox with container isolation, and treat allowlisted proxies, shared registries, and eval fixtures as part of the blast radius.

Three hard framework questions — if you cannot get clear answers, do not pick it: can it auto-compress context, and with what strategy; can execution state serialize and resume, and at what granularity; can it suspend for external events (human approval, callbacks) and continue. Approval-gated flows always pause; the wait must keep state. Withdrawal approvals and contract awards here regularly wait on a signature; a framework that cannot persist a paused state turns production into a human watch desk.

New candidates against the three hard criteria (versions checked 2026-10-26 on PyPI / npm; capabilities per the official docs listed under the table):

| Framework | Current version | 1. Context compression | 2. State serialise / resume | 3. Suspend for external events | Notes |
|---|---|---|---|---|---|
| OpenAI Agents SDK | Python 0.24.0 / JS 0.21.0 (still 0.x) | Yes: `OpenAIResponsesCompactionSession` wraps a session and calls the Responses API `responses.compact` when a trigger fires (default: 10 accumulated non-user items; can be token-based or custom); compaction can also be forced at a phase boundary. OpenAI Responses models only | Yes: `RunState` serialises to JSON and resumes later | Yes: tools set `needs_approval`; the run pauses with pending approvals and resumes after approve/reject; the paused state can be serialised and resumed in another process | Docs warn deserialisation is not authenticated; keep snapshots in trusted storage |
| Google ADK | Python 2.13.0 / JS 2.3.0 | Yes: `EventsCompactionConfig` with two strategies—sliding-window summaries by invocation count (`compaction_interval` + `overlap_size`), or a token threshold that keeps the last N raw events (`token_threshold` + `event_retention_size`); the summariser model is configurable | Yes (experimental): `ResumabilityConfig(is_resumable=True)` checkpoints per event; on resume it reinstates completed events and successful tool results and re-runs the unfinished step. Docs call it best-effort and at-least-once: unfinished tools may re-run and must be idempotent; in-memory state is lost on resume | Yes: Tool Confirmation; `require_confirmation` can be always-on or decided from arguments (e.g. an amount threshold), and can collect structured input; with Resumability the run can pause and resume. Since Python 2.13.0 Tool Confirmation is stable rather than experimental; `EventsCompactionConfig` and `ResumabilityConfig` remain experimental | Tightly tied to Gemini / Vertex; assess separately off Google Cloud |
| Claude Agent SDK | Python 0.2.174 (Alpha) / TS 0.3.310 | Yes: near the context limit it automatically summarises older history and emits a `compact_boundary` system message; a `PreCompact` hook can archive the full transcript first | Yes: `resume` by session ID restores full context; `fork_session` copies the history into a new branch and leaves the original unchanged; a `session_store` adapter mirrors transcripts to your own backend so another host can resume. Granularity is the session (conversation); forks branch the conversation, not file changes | Partial: `canUseTool` is an in-process callback, so a human can confirm while the process waits; the docs describe no way to pause, let the process exit, and continue the same tool call after approval. Across a restart, deny and end the turn, then `resume` the session after approval. Since TS 0.3.301, sdk-type MCP server configs accept a per-tool `permission_policy` (`always_ask` or `always_deny`); as of Python 0.2.174 its changelog still has no matching entry (待核实) | Still 0.x Alpha; pin versions before production |
| AWS Strands Agents | Python 1.62.0 (Production/Stable) / TS 1.22.0 | Yes: three conversation managers—`SlidingWindowConversationManager` (default, keeps the last 40 messages, can truncate oversized tool results), `SummarizingConversationManager` (summarises roughly the oldest 30% of messages, keeps at least the last 10), `NullConversationManager` (no management); proactive compression at 70% context use can be enabled | Yes: session manager persists state, including interrupts | Yes: interrupts raised from hooks or tools; resume by answering the interrupt id; interrupt state persists via the session manager and can be answered in a new session | 1.x stable; AWS-friendly. Since TS 1.22.0 the `limits` passed to `invoke` (turns, output tokens, total tokens) apply to the whole agent tree—sub-agents called as tools and Graph / Swarm nodes all count—so they can serve directly as the iteration and cost caps in the stop criteria; no matching change seen in the Python SDK (待核实) |

Verdict: all four have official support for criteria 1 and 2, with different details. ADK resume is experimental and at-least-once, so tools must be idempotent; Claude Agent SDK resumes at session level. On criterion 3, OpenAI Agents SDK, ADK and Strands can persist a paused-for-approval state and continue later; Claude Agent SDK only offers an in-process approval callback, so long human-approval waits need your own design. Defaults are unchanged: LangGraph stays the default, and Microsoft Agent Framework stays first choice on the Microsoft stack.

Sources: OpenAI https://openai.github.io/openai-agents-python/human_in_the_loop/ , https://openai.github.io/openai-agents-python/sessions/ ; ADK https://adk.dev/tools-custom/confirmation/ , https://adk.dev/context/compaction/ , https://adk.dev/runtime/resume/ , https://adk.dev/api-reference/java/com/google/adk/apps/ResumabilityConfig.html , https://github.com/google/adk-python/releases/tag/v2.13.0 ; Claude https://code.claude.com/docs/en/agent-sdk/sessions , https://code.claude.com/docs/en/agent-sdk/agent-loop , https://code.claude.com/docs/en/agent-sdk/permissions , https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md ; Strands https://strandsagents.com/docs/user-guide/sdk/agents/conversation-management/ , https://strandsagents.com/docs/user-guide/concepts/interrupts/ , https://github.com/strands-agents/sdk-python/releases/tag/python%2Fv1.62.0 , https://github.com/strands-agents/sdk-python/releases/tag/typescript%2Fv1.22.0 , https://github.com/strands-agents/sdk-python/pull/4667 .

Duration: about 8–16 weeks, and you must reserve separate time to build the evaluation system. Shipping an autonomous Agent without an eval set is like shipping a core system without regression tests.

Dissuasion is equally clear. If the business unit says "it can handle any situation," the requirement cannot be built — compress the scope to enumerable cases. If nobody can define "done right," write acceptance criteria first. In sanctions, integrity, or grievance domains, the Agent may only gather materials and search precedents; any conclusive judgment must be made by a person, and that limit must be written into the design document, because Independent Evaluation or audit will ask later.

## Form F: Multi-agent collaboration

Typical asks: assemble materials for a country diagnostic study; prepare complex cross-department diligence packs.

Common patterns: fan-out parallelism (dispatch subtasks then merge), pipeline (pass in sequence), manager–worker (one coordinates many), debate (independent conclusions then compare).

Read the dissuasion first. Most asks labeled "multi-agent" are really Form D or E. The costs multi-agent adds — coordination overhead, conflicting conclusions, hard debugging, runaway token spend, near-impossible fault attribution — usually dominate the benefit. This bank adds another layer: multi-agent decision chains are hard to explain to audit and Independent Evaluation.

Only two situations truly fit: subtasks that are genuinely independent and parallel; or subtasks that need wholly different professional contexts (macroeconomics, sector engineering, safeguards) so that mixing them in one context interferes. Everything else should fall back to E.

Products: meet every Form E requirement first. Use A2A between agents; the frameworks above all ship multi-agent orchestration (for example OpenAI Agents SDK handoffs, ADK agent hierarchies, Strands multi-agent patterns), but inter-agent messages must be authenticated and validated (OWASP ASI07).

Duration: from 16 weeks, and ship a Form E monolith that runs the business first before you consider splitting.

---

# 4. Cross-form baselines

## 4.1 General baselines

Install cost breakers first. Cap every request, every session, and every day; trip the breaker when a cap is hit. An AI system without breakers can burn a quarter's budget over one weekend. For rough token, latency, and cost estimates per form, and for gate values, see *Cost and capacity estimation* (`cost-capacity-estimation.md`).

Full tracing is equally a production gate. Use OpenTelemetry plus a Langfuse-class tool; record each call's inputs, outputs, tool calls, latency, and cost. Being able to replay a failure is the line between a demo and production, and in this bank it is also an audit prerequisite. Emit OpenTelemetry GenAI semantic conventions so traces stay portable across tools; for the concept-to-span mapping and content-capture privacy rules, see the concept handbook, Lecture 8.

Treat every model output as untrusted. Never splice it raw into SQL, never write it straight into a page, never execute it as a command. Escape where you must, whitelist where you must, sandbox where you must.

Prompt-injection defenses cannot rest on one system-prompt line. Any system that consumes external content must assume hostile instructions inside it. This bank's attack surface is wider than a typical enterprise: project files from borrowers and implementing agencies, bidder submissions, external pages scraped for peer research, inbound correspondence. What works is least privilege plus action confirmation — not a sentence that says "ignore malicious instructions."

Versioning and rollback must cover prompts, model versions, and tool schemas, all of them reversible. Quiet vendor model updates that change behavior are normal. For staged release, rollback, drift monitoring, and a postmortem template, see *Release and operations checklist* (`release-and-operations-checklist.md`).

## 4.2 Institution-specific hard constraints

Walk these items at requirements review. They apply to every form.

Classification and access control come before features. Documents and data sit in layers — public, internal, restricted, board-confidential — and must not share one index. Permission filtering must happen at retrieval time, not at display. A Q&A system that an ordinary user can coax into revealing board-confidential content is a major information-security incident, not a defect you patch later.

Decide data egress and deployment form before kickoff. Whether member-related data, personnel data, or unpublished country analysis may go to an external model vendor must land in a concrete plan (self-hosted inference, dedicated cloud, or public API). That decision constrains which models and frameworks you can even shortlist, so it comes first.

Accountable trails are mandatory. In principle every decision here must show its basis and its owner. Any AI-touched step must leave a record: who, when, on which inputs, what advice came back, who finally confirmed. That is not a nice-to-have; it is the production gate.

AI must not produce conclusive judgments. In sanctions screening, integrity due diligence, grievance case handling, and safeguard compliance determinations, AI may only retrieve, summarize, and pre-label; conclusions belong to authorized staff. Write that into the design document and confirm it at review.

The limit is not only "it might be wrong." There is a mechanistic reason worth explaining to business units: once a model states a conclusion first, every later "reason" is generated around that conclusion — rationalization, not argument. Each emitted token conditions the next sample, so the conclusion becomes an anchor. Designs that "let AI decide, then list reasons for human review" therefore fail; the reasons look thorough, but they were reverse-engineered from the conclusion, and reviewers are more easily persuaded.

Do the reverse. Let AI surface retrieved facts, applicable clauses, and precedents, and put them in front of a person who judges. If AI must reason at all, make it reason fully before stating a conclusion, and keep the intermediate trail complete and inspectable.

External publish channels must be firewalled. Any figure or wording that might enter an annual report, open-data portal, press release, or external report needs an explicit human confirmation step between the AI system and the publish path, and the system must default to labeling output "internal reference."

Clarify multilingual and translation responsibility up front. When member languages are involved, decide whether machine translation is a working draft or formal text. Official external text must not use unreviewed machine translation.

---

## 4.3 Managing cost and guardrails at platform level

§4.1 covers the gates each system installs for itself; this section is about the platform. Once there are many systems, per-system gates aren't enough: someone has to see, bank-wide, where the money goes and who can pull the plug.

Tier the models instead of defaulting to the best. We use gold, silver and bronze: gold for the few genuinely hard tasks, such as a complex payment-stall diagnosis; silver as the everyday workhorse for policy Q&A and drafting; bronze for repetitive work like classification and field extraction. Don't use gold where silver will do, or silver where bronze will do. Tiering is enforced by model routing in the gateway, chosen automatically by task complexity, data classification, latency and cost limits; classified data routes only to a designated self-hosted model. No project hard-wires one vendor, and users don't get to pick the most expensive model themselves.

Send work that doesn't need an instant answer to batch. Disbursement document checks, month-end reports and bulk classification aren't urgent. OpenAI's [Batch API](https://platform.openai.com/docs/guides/batch) and Anthropic's [Message Batches](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) both bill at 50% of the synchronous price (checked 2026-10-29), at the cost of results taking up to 24 hours. Self-hosted inference has no such discount, but batch jobs can be scheduled overnight on idle capacity.

Cost must land on people and departments. Circuit breakers alone aren't enough: you need tokens and spend visible by person, team, project and model, then shown to departments (showback) or charged to their budgets (chargeback). Each team gets a default quota; beyond it, show the extra cost; more quota needs a written business case approved by the business owner. If users can't see cost, they will always pick the most expensive model.

Guardrails before autonomy. A new agent starts with least privilege, a tool allow-list, time-boxed access and human approval, and gets more autonomy only once evals and production behaviour are stable. Every agent that can write data or call external systems needs a kill switch that stops it in one action, and it must be rehearsed: on-call staff shouldn't be hunting for the switch during an incident. Payments, external commitments and production changes are the last to get autonomy.

Keep an agent registry. Record each agent's owner, purpose, model and version, permission scope, launch date and planned retirement date; otherwise in a year nobody can say how many agents the bank runs or what each can touch. Unclaimed agents get switched off.

Background and further practices (budget breakdown, build vs buy) are in *Agent Platforms in Practice and AI Cost Governance: Meeting Notes*.

---

# 5. Attribute scorecard

Use this for requirements reviews, proposal defenses, or when the decision tree does not give a clear answer. Score seven dimensions from 0 to 3.

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **1. Decision rights** | Human; system informs | System drafts; human confirms | System picks fixed branches | System generates paths at runtime |
| **2. Scope** | Read-only text | Read-only cross-system | Write own state/drafts | Write business / external emit |
| **3. Reversibility** | Fully reversible | Compensatable | Hard to restore | Irreversible / external / funds |
| **4. Domain width** | Single form/API | Single system | Single business domain | Cross units |
| **5. Runtime length** | Seconds | Minutes | Hours | Multi-day / async |
| **6. Data readiness** | Authoritative metrics | Warehouse, no unified metrics | DBs, no warehouse | Scattered systems |
| **7. Verifiability** | Gold answers auto-check | Spot-checkable | Subjective only | Volume exceeds human review |

Add two institution-specific yes/no flags (not scored):

Classification touch: will the work reach restricted-or-above material? If yes, the access-control design must be finalized before feature design.

Accountability-sensitive: does it fall in sanctions, integrity, grievances, or safeguard determinations? If yes, the AI role caps at material gathering; it must not produce conclusions.

How to read the scores:

- Dimensions 2 and 3 both ≥2: whatever else scores, a human confirmation gate and full audit are mandatory.
- Dimension 3 = 3 and dimension 1 ≥2: funds or external action, and the system decides the action itself. This combination is not approvable here; force dimension 1 ≤1 (execute only after human confirmation).
- Dimension 6 ≥2 and the need is Form B: convert the project to metrics governance first, and say so in the proposal.
- Dimension 7 = 3: the requirement is invalid. Output volume beyond human review means nobody can catch errors. Fix verification first.
- Dimension 1 = 3 and dimension 4 = 3: this is a research project, not a delivery project. Do not commit to a go-live date.
- Seven-dimension total < 6: do not put an Agent on it; rules, templates, workflow engines, and parameterized queries are cheaper and more reliable.
- Dimension 5 ≥2: you need an orchestration engine that can pause and resume with durable state; most light frameworks are out.

---

# 6. Scenario library

Match the wording business units actually use.

"Make the procurement guide askable" — Form A. First confirm which edition is currently effective, and whether exception clauses exist for particular financing types; those exceptions are where Q&A systems most often answer wrong.

"Let colleagues search lessons in past evaluation reports" — Form A, and one of the highest-value scenarios here: Independent Evaluation knowledge sits for years but is hard to call up. Evaluation conclusions have time and country context; answers must carry source and year, never cited out of context.

"Can board documents be askable too?" — Form A, but classification is a hard constraint. The design must clear information security first, filter at retrieval, and distinguish visibility by the user's unit and role. The hard part of this project is permissions, not Q&A.

"I want to ask portfolio data without waiting for reports" — Form B. Your first sentence is "when you say commitment, do you mean approved, signed, or effective?" If they cannot answer, or units disagree, divert to metrics governance.

"Build a portfolio cockpit you can talk to" — Form B. Hidden hard parts are latency and metric consistency; management will not wait thirty seconds and will not accept numbers that disagree with finance. Precompute and align metrics before you build.

"Auto-generate country briefs" — Form B plus C. Numbers are B; prose is C. Deliver in two phases, and country-team review is mandatory on the prose.

"Help the TTL draft a supervision mission report" — Form C. Value comes mainly from injecting past supervision records and project basics, not from the model's writing quality.

"Draft a project concept note" — Form C. Wire in retrieval over similar past projects; that is far more useful than generation alone.

"Risk review of loan agreement clauses" — Form A plus C. Surface risk points and supporting clauses; legal concludes. Never auto-approve.

"Auto-review withdrawal applications" — Form D, and dimension 3 scores a full 3 (funds, irreversible). Automate completeness and consistency checks, flag doubts, and leave approval to authorized staff. Kill any phrasing of "auto-disburse" at requirements time.

"Auto screen suppliers against sanctions lists" — Form D, but it triggers the accountability-sensitive flag. The system only compares lists and surfaces similarity hints; compliance decides whether a hit is real. Both false-negative and false-positive handling must leave an audit trail.

"Can integrity due diligence be automated?" — accountability-sensitive. AI's ceiling is public-information gathering and lead organization; it must not produce conclusions or risk ratings. Say this to the business unit at requirements time, or you will discover the conflict at acceptance.

"Auto-classify and publish procurement notices" — Form D. Classification can be automatic; publishing is an irreversible external action and needs human confirmation.

"Smart matching on a consultant CV library" — Form A or D, depending on whether results write back. Watch personal-data rules, and do not let the model emit evaluative judgments on candidates.

"Disbursement is behind — let AI find out why" — Form E, and a good fit: mostly read-only, failure is harmless, clear done criterion (identify the stall). Any write (rating change, reminder letter) sits behind its own confirmation gate.

"A procurement complaint arrived — can AI give a preliminary judgment?" — Form E's retrieval part is fine (similar precedents, applicable clauses); the preliminary judgment is not — accountability-sensitive.

"Auto-aggregate results indicators" — Form B. The hard part is indicator definitions scattered across project results frameworks, inconsistent metrics, and some data from borrower reports of uncontrolled quality. Assess data availability before you talk tech.

"Member-language files should be askable too" — multilingual. Pilot on real files first. Decide whether translation output is a working draft or formal text.

"We also want to search old scanned archives" — measure OCR quality on real samples first. Recognition rates on aged scans vary wildly; do not quote a timeline from experience alone.

"See how other MDBs do this — let AI research the web" — consuming external pages is direct prompt-injection exposure; minimize tool permissions and have humans verify sources.

"Can grievance cases search similar precedents?" — Form A, highly sensitive. De-identification of complainants, visibility scope, and an absolute ban on case conclusions must be fixed first.

"We want an AI platform that takes every request" — that is a vision, not a requirement. Ask for the first three concrete scenarios, triage each with this handbook, then see what shared foundation those three need; that is the scope of platform v1.

"Institution X already went live; we need the same" — check whether what they published is a pilot or a production system. The gap is usually about 10× the work, mostly in permissions, audit, failure recovery, and cost control — exactly the bars this bank sets highest.

"Too much data — let AI find portfolio anomalies" — this is probably a classic anomaly-detection problem. Statistical methods or traditional ML are cheaper and more explainable, which matters when you must tell management why something is flagged red. The model's job is to put the conclusion into plain language.

---

# 7. Build order from zero

Since the foundation is roughly greenfield, build in the order below, not in the order requests arrive.

Layer 0 comes first and every form uses it: model access and a gateway (unified API, rate limits, metering, audit), prompt versioning, observability (OpenTelemetry plus a Langfuse-class tool), cost breakers, and a one-time decision on deployment form and data-egress policy. This layer takes roughly two to four weeks and is the shared base for every later project. The last item is policy work, not tech, but if you leave it until project three, the first two will be reworked. The gateway should route across vendors by task, classification, and cost, not hard-wire one model per project. Design fixed system prompts and retrieval prefixes to hit Prefix / Prompt Cache — the main cost lever for Forms A and C. Open-weight models make self-hosted inference more realistic than before; procurement, classification review, and supply-chain checks still apply.

Layer 1: pick one path, do not open both. Knowledge path — document pipeline, vector store, classification labeling and retrieval ACL. Data path — warehouse or OLAP plus a metrics definition layer. Investment on the two paths differs a lot. Metrics governance on the data path is most often under-estimated; it needs finance, operations, and statistics to align definitions — an organizational problem, not a technical one. Give it calendar time, preferably under someone with cross-unit coordination authority.

Layer 2, only when you build Forms D or E: tool registry and permissions, state store, orchestration engine, sandbox isolation, identity inheritance (Agent runs as the initiator).

Layer 3, only when you build Forms E or F: evaluation system, red-team testing, fine-grained cost attribution, multi-agent coordination.

Suggested project sequence. Start with a small Form C project (for example a supervision report draft) to stand up Layer 0 and run the release and security-review process end to end. Then build a Form A knowledge Q&A, preferably starting from public documents such as the procurement guide, so classification controls are proven in a low-risk setting. In parallel, start metrics governance to pave Form B. Only then touch D and E.

That order matches capability growth to risk exposure. Opening with a first project that touches funds or board papers fails often, and one security or metrics incident can burn the institution's patience for AI — a cost larger than the project itself.

---

# 8. Red-flag list

When you hear these in review, stop and realign.

The business unit cannot define "done right." Without acceptance criteria, do not start.

They demand "100% accuracy." They have not accepted that this is a probabilistic system; reset expectations, or switch to a deterministic design.

The requirement text uses "all," "any," or "fully automatic." Scope has not converged; go back and split.

The work touches funds payment, external publish, board submission, or sanctions / integrity determination — irreversible or accountability-sensitive. A human gate is mandatory; no negotiation.

Restricted-or-above material is in scope, but nobody can say who may see what. Access-control design comes before features. Do not prototype first and bolt permissions on later; you will rebuild.

Existing processes or metrics are already messy. AI will not tidy them; it will expose disagreement faster and spread it wider. Map first.

Data depends on borrower implementing-agency submissions of uncontrolled quality. Evaluate real samples first; do not assume clean data in the design.

Someone points at a demo video and says "we want that." Confirm whether it is a production system, and what data preparation and compliance work sits behind it.

No business unit will own it; only IT is pushing. Such projects go live with nobody maintaining metrics or the knowledge base, and they go fallow within six months.

---

# 9. Notes on the source book

If the team is using *Enterprise Agent Platform Engineering*, keep these contrasts in view.

Do not use the four-way split as a selection tool. Chapter 1 explains why: the four words are not on one layer and cannot classify a concrete requirement.

RAG's place has changed. The book treats RAG as a system class alongside Agent; the industry now mostly demotes it to one technique under "context engineering." Context engineering covers retrieval, compression, memory, formatting, and token budgets as a whole — much larger than RAG.

Three important dimensions are missing: multi-agent organization (who supervises whom, how conflicts resolve), long-running resume after interruption, and blast radius (sandbox versus production credentials). All three weigh heavily in real selection.

Compliance chapters lean generic. They center on typical enterprises and general regulations, and say little about international-organization specifics: applicable law under immunities, member data sovereignty, board-confidential classification, Independent Evaluation and audit trailability, accountability mechanisms. This bank must fill those gaps itself; section 4.2 of this handbook is a starting point.

Product lists go stale. Recheck frameworks and products against the current date, especially inference engines and Agent frameworks, and overlay this bank's procurement and information-security requirements.

Metrics governance is under-weighted. The book covers data infrastructure at length but does not stress enough that Form B success almost entirely depends on whether metric definitions exist — a go/no-go at proposal time.

The risk-stratification material is worth extracting on its own. Part I, Chapter 2 on low / medium / high risk layers is the most practical definition section in the book, and pairs well with this handbook's Chapter 5 scorecard.
