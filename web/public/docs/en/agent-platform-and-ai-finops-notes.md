# Agent Platforms in Practice and AI Cost Governance: Meeting Notes

> A write-up of an industry roundtable, reorganised to fit KYA. It is not a standard and not a vendor quote. Most conclusions are participants' experience, so anything marked "meeting view" is only what was said in the room; figures with an official source are linked, the rest are marked "to be verified".
>
> How it relates to the other documents: the layering maps to the Concept Map L0–L6 and the Protocol Comparison; the cost part supplements Cost & Capacity Estimation (that one is how to calculate, this one is how to manage); the guardrails map to Chapter 4 of the Selection Handbook (§4.3 distils the platform-level practices from this page) and Chapters 1 and 7 of the Release & Operations Checklist.

---

# 1. Where agents work, and where they struggle

## 1.1 Scenarios that already work reasonably well

Five areas came up: software engineering (async coding, test automation, DevOps/SRE, incident management and root-cause analysis), cybersecurity (incident analysis, automated response, vulnerability remediation), customer service (text and voice agents, triage), digital office assistants (search, summarise, draft) and finance/HR back office (AP/AR, document processing, onboarding, candidate screening).

What they share: fairly standard processes, lots of repetition, outcomes that are easy to measure. In our bank, checking documents on disbursement requests or triaging IT on-call alerts is a better first target than "help a loan officer make an investment decision". Security agents are the exception: the scenarios are mature, but permissions, runtime monitoring and human intervention must be one notch stricter.

## 1.2 Failed projects mostly don't lose on the model

Meeting view: many agent projects underperform not because the model is weak but because data and context weren't supplied: inaccurate or stale data, unclear business definitions, no lineage, missing tools and permissions, awkward workflows, and no proper evaluation before launch.

Context was split into three kinds. Semantic context: business terms, rules, data ownership and policy, for example what "stalled project" actually means in our bank. Real-time business state: live data and retrieval results, what must be looked up at inference time. Lineage: where data came from, which workflows it entered, whether it can be audited. Miss any one and the agent will confidently give the wrong answer.

---

# 2. Platform layers and decoupling

## 2.1 Six layers

Bottom to top:

| Layer | What it covers | KYA mapping |
|---|---|---|
| Model | Large/small models, open-weight or closed, multimodal | Map L0–L1 |
| Integration | Open protocols such as MCP connecting apps, databases, tools, external services | Map L3–L4, MCP in the Protocol Comparison |
| Context | Getting the right business data and knowledge in | Map L2 (context supply) |
| Orchestration & runtime | Multi-agent collaboration, workflows, state, exception handling | Map L5–L6, A2A |
| Harness control | Tool/function calling, identity, permissions, memory, runtime control | Loop control at Map L5, design knobs in the Definitions Revision |
| Governance | Privacy, IAM, runtime security, behaviour monitoring, kill switch, audit, cost | Ops Checklist, Selection Handbook Ch. 4 |

Meeting view: the model and integration layers are standardising and commoditising; the real differentiation is the context and governance layers. That matches our Selection Handbook: spend money and people on data access and guardrails, not on training your own model.

## 2.2 Why decouple

Models turn over every six months and nobody knows who will be best next year. The advice was to separate model, harness, orchestration, governance, data and context, and infrastructure, so that swapping a model doesn't mean rewriting the agent, governance isn't welded to one model, and context capabilities are reused across agents.

This matters most across regions. The example given was a China-built agent going global: different models inside and outside China, one control plane and governance layer, and expansion only touches the model and infrastructure layers. For a multilateral development bank, headquarters and regional offices can run different models (self-hosted where data cannot leave the country) while approval rules, audit scope and permission model stay the same.

## 2.3 Open-weight models: flexible, but count the maintenance

Upside: fine-tuning, deployment in cloud, on-prem or edge depending on data sensitivity, less lock-in. Cost: complex licences, heavy selection and evaluation work, patches and upgrades are on you, high operating cost. One easily missed risk: an "open community" may really be one vendor; if that vendor stops, the ecosystem can wither fast. So beyond benchmark scores, check who maintains it, the release cadence and whether the licence allows commercial use.

## 2.4 Five kinds of vendor

| Type | Strengths | Weaknesses |
|---|---|---|
| Frontier model labs | Fast model iteration; strong reasoning, computer use, tool use | Enterprise integration, SLAs and ecosystem may be thin |
| Cloud providers | Full stack from infrastructure to models; enterprise experience | Closed stack, cloud lock-in |
| SaaS vendors | Know specific business processes | Narrow solutions; per-seat pricing doesn't fit agents |
| Automation/RPA vendors | Process governance, rules engines, execution management | Weak on business context; slower innovation |
| Data platform vendors | Hold enterprise data and analytics platforms | Agent capability still maturing; boundaries unclear |

Don't judge on the demo. Ask six things: open standards and MCP support, swappable underlying model, multi-cloud and hybrid deployment, enterprise-grade security and governance, full observability, and cost visibility per project.

---

# 3. Autonomy versus guardrails

The leaning was clear: when choosing between autonomy and guardrails, guardrails first. Build them, then widen autonomy step by step.

Guardrails: least privilege, time-boxed access, tool allow-lists, per-task token and cost caps, human approval points, runtime monitoring, anomaly detection, kill switch. Code changes, payments, commitments to customers and production-system actions get the strictest tier. Take the payment-stall diagnosis agent: it may query transaction status, pull logs and write a diagnosis, but resending a payment instruction needs a human to click confirm.

## 3.1 Full lifecycle management

Once agents multiply, the question is no longer "how do we build one" but: which agents exist (discovery and registry), are they any good (evaluation and testing), how are they running (observability), what can they touch (permissions), which version, how incidents are handled, when they retire, and whether they've been red-teamed. Meeting view: no single tool covers creation to retirement today; some large enterprises reportedly run tens or even hundreds of thousands of agents internally (to be verified; no source given). Agent governance will end up like application and identity governance, a routine enterprise management problem.

## 3.2 Business users building tools with AI

When business users build small apps with Codex or low-code tools, manage four risks. Data: route through an AI gateway, filter and mask sensitive data, agree with vendors that data is not used for training. Security: defend against prompt injection, restrict external access, allow-list tools, security-test any internet-facing agent. Quality: check for hallucination and bias, human review, test the outputs. Code compliance: trace code provenance, identify open-source licences, go through code review and release, and put these tools in the application inventory.

---

# 4. Managing AI cost (FinOps)

## 4.1 Why estimates keep getting harder

Many models, big price gaps, separate input and output pricing, and agents that chain model and tool calls on their own; SaaS is moving from per-seat to usage- or outcome-based pricing; the people using it don't pay and can't see what they spend. Meeting view: inference will be a more persistent and larger cost than training, and AI projects stand a real chance of overrunning.

## 4.2 Ten practices

1. Model tiers. Gold (strongest, most expensive), silver (value), bronze (simple repetitive work). Don't use gold where silver will do, or silver where bronze will do.
2. Model routing. Choose the model automatically by prompt content, task complexity, user identity, latency and quality needs, cost limits and data sensitivity, with enterprise policy able to override. E.g. routine document tidying goes to a cheap model; sensitive data may only go to a designated self-hosted model.
3. Caching. Reuse results for identical or near-identical requests, via the vendor's prompt cache or in the enterprise AI gateway. See `P_cache` in Cost & Capacity Estimation 1.2.
4. Caps on agents. Per-task cost, tokens, steps, tool calls, runtime and stop conditions. In worked example E, 8 steps becoming 30 raises cost about 8×; that's what no cap looks like.
5. Closed task goals. State what to do, output format, allowed tools, boundaries, when to stop and when to escalate. The more open the task, the more tokens the agent burns exploring.
6. Right deployment model. Public cloud, private cloud, on-prem, edge and hybrid each have their own maths. Self-hosting must count infrastructure, staff, hardware depreciation, idle rate and elasticity; the advice was to negotiate "base plus burst capacity" opex rather than stockpiling GPUs.
7. Lean context. Give only what the task needs, extract key fields, don't paste whole documents, drop general knowledge the model already has, limit retrieval results, prune stale content. Longer context is pricier, slower and more likely to drift.
8. Match pricing to the scenario. See the table below.
9. FinOps tooling. At minimum: token and cost views by person, team, project and model (visibility); hard caps (quota control); showback/chargeback to departments; trend-based forecasting. OTel `gen_ai.usage.*` can be the data source.
10. Teach cost. Beyond how to use AI safely, cover model price gaps, how tokens and context drive cost, the benefits of caching and batching, and when a large model is warranted. One company reportedly requires staff to pass AI FinOps training and a test before using AI engineering tools.

| Scenario | Suggested pricing |
|---|---|
| Repetitive document processing | Per document or task volume |
| AP / AR | Per document or automated process volume |
| Customer service | Per outcome, accuracy, satisfaction or resolution rate |
| Software engineering | Per user, agent or workload |
| Legal and other professional work | Mix of per user, task and outcome |

## 4.3 Real-time or batch

Not everything needs an instant answer. Candidate screening, cash-flow analysis, bulk document processing, data cleansing, report generation and non-urgent classification can run as batch. The meeting said batch can save about 50% in some cases. This matches the official docs: OpenAI's [Batch API](https://platform.openai.com/docs/guides/batch) states a 50% discount versus the synchronous APIs with completion within 24 hours; Anthropic's [Message Batches](https://docs.anthropic.com/en/docs/build-with-claude/batch-processing) states all usage is charged at 50% of standard prices with processing within 24 hours (both checked 2026-10-29). Other vendors and self-hosting may not offer this, so go by actual quotes. Month-end disbursement document checks are a typical batch job.

## 4.4 Match cost to accountability

Technology solves only half; the other half is "users don't pay". Suggestions: default quota per person or team, show the extra cost when it's exceeded, require a business case for more, have the product or business owner approve, and give higher quotas to high-return scenarios. In short: whoever uses it watches it; whoever asks for more justifies it.

What if IT staff refuse lower-tier models? Meeting view: top-tier models are allowed, but only with a clear, verifiable reason, managed together with quotas, routing and tiering.

## 4.5 Open up first or control first

It depends on the stage. In exploration, open up a bit to learn whether people will use it and which scenarios pay off. At scale, add routing, quotas, FinOps visibility, value assessment, budget approval and departmental allocation. "Staff use AI" is not "the enterprise has transformed"; what counts is organisation-level efficiency and business results. Time saved by individuals does not automatically become organisational output.

## 4.6 Breaking down the budget

Don't budget on model unit price alone. Cost items include at least: model calls, agent execution and tool calls, data and vector storage, AI gateway and platform, monitoring and governance, compute, development and operations staff, security/compliance/audit, licences and subscriptions.

Steps: define use case and goals → break down the workflow → split into tasks → assign large/medium/small model per task → estimate call frequency and tokens → separate real-time from batch → compare models and deployment options → add growth, peaks and anomalies → get real data from a POC → revise monthly or quarterly. Formulas and worked examples are in Chapters 1–3 of Cost & Capacity Estimation. Meeting view: unit prices are falling overall; budget error comes mainly from token volume, agent call counts and changes in SaaS pricing.

---

# 5. Roadmap: build or buy

Two factors: your engineering and platform maturity, and how much of the agent stack you want to own. Build core business processes, core data and context capability, governance and permissions, and long-term differentiators. Buy general office assistants, generic finance/HR tools, standard back-office processes and low-level components you can't maintain. The suggested model is "build the core, buy the generic, compose the platform": neither all-build nor all-buy, and no blind heavy investment in models and compute.

As SaaS vendors become agentic, enterprise IT should watch for traditional UIs being replaced by agent interaction, pricing shifting from seats to tokens or outcomes, support for open standards, freedom to swap models and agents, and lock-in risk.

On private AI, the meeting view was that interest is high in China and has risen in the US over the past year (to be verified; no data given). Drivers: small and open-weight models have matured, moving AI to the data is usually cheaper than moving data to the cloud, and regulated industries and data sovereignty demand more control. For an institution like ours it is first a compliance and data-security question, and only then a technology choice.

AI transformation also touches the organisation: hiring, training, performance, the IT/business boundary, outsourcing versus in-house. Suggested split: HR owns organisational change and adoption, the CFO owns value and cost, the CIO/CDO owns architecture, platform and governance, and business units turn AI into business results.

---

# 6. Consensus (excerpt)

1. The hard part is data, context, governance and organisational change, not the model.
2. Prioritise a model-neutral, decoupled architecture built on open standards.
3. Agent governance must cover discovery, evaluation, operation, monitoring, permissions, security and retirement.
4. Model tiers, routing, caching, batching, token caps and lean context are the main technical cost levers.
5. FinOps needs visibility, quota control, cost allocation and forecasting, and cannot sit with IT alone: finance, business and HR must take part.
6. Build only differentiating capabilities; training must cover cost awareness and model choice.
7. The goal is not more tokens but measurable business value at a controlled cost.

---

# To be verified

The three items below were stated verbally with no public source found. The 50% batch discount has been checked against official docs; see 4.3.


- "Large enterprises run tens to hundreds of thousands of agents internally": stated verbally, no source.
- "Private AI interest: high in China, rising in the US over the past year": stated verbally, no data.
- "A company requires AI FinOps certification before using AI engineering tools": anecdote, unnamed.
