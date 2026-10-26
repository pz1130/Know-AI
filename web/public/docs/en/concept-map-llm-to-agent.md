# Concept Hierarchy Map: From LLM to Agent

Reorder the book’s concepts by “capability stacked from the bottom up.” That order is also historical: each layer was added to fix limits of the one below.

Core point first: layers do not replace each other; they stack. In a production Agent today, L0 through L5 often all run at once. Understanding what each layer solves—and what it leaves broken—matters more than memorizing terms.

```
L6  Multi-agent collaboration   A2A, Agent Card, fan-out / pipeline / manager–worker
     ↑ one is not enough
L5  Agent (loop)                ReAct, Runtime, memory, resume, HITL
     ↑ one call is not enough
L4  Standard tool access        MCP, tool registry, Schema versions
     ↑ per-app×system adapters are too expensive
L3  Function calling (act)      Function Calling, Tool Use, JSON Schema
     ↑ can only talk, not act
L2  Context supply (know)       ┌─ unstructured: vectors, retrieve, rerank → knowledge Q&A
                                └─ structured: CDC, lakehouse, OLAP, semantic layer → data Q&A
     ↑ does not know enterprise internals
L1  Conversation (this turn)    context window, prompting, CoT
     ↑ stateless Q&A
L0  The model itself            Transformer, KV Cache, quantization, fine-tune

Cross-cutting: observability, evaluation, security, cost, deploy
```

---

# L0 · The model itself

At this layer the system is just a function that takes text and returns text. Nothing else: no memory, no network, no actions, no sense of “now.”

Book concepts here: LLM, Transformer, autoregressive generation; inference-side KV Cache, Prefix Cache, speculative decoding, quantization (GPTQ/AWQ…); adaptation LoRA, DPO; engines vLLM, SGLang, LMDeploy.

The key fact: parametric knowledge is frozen at training time with a cutoff, and the model does not “know that it does not know.” When unsure it still answers fluently and confidently. That is how it works, not a bug to patch. Every higher layer is, in some sense, patching that fact.

In a multilateral development bank, ask it “what does clause N of this loan agreement say” without putting the agreement in context, and it may invent a clause that sounds like our house style but does not exist. Fabrication, stale knowledge, and unreliable arithmetic are the built-in failure modes.

Practically, deep optimization of engines, quantization, and KV cache matters mainly for self-hosted GPU fleets. On API or managed services, know the concepts and where cost and latency come from.

---

# L1 · Conversation

This layer wraps the stateless function so multi-turn chat looks continuous. The late-2022 ChatGPT leap was interaction form, not a new model class.

Book concepts: context window, token budget, prompting, CoT, ToT, system prompt.

Multi-turn “memory” is an application illusion. The model does not remember the last line; the app resends the whole history every turn so the model appears to remember. Two direct consequences: longer chats cost more, because every turn pays for the full history; past the window you must truncate or compress, and how you truncate defines the UX.

After three revision rounds on a supervision report, a user says “revise again using last round’s metric.” If the middle turns were truncated roughly, that metric is gone—overflow “amnesia.” Mid-context dilution and cost growing with history are the other failure modes.

Form C (assisted drafting) mostly needs only this layer; that is why it has the shortest timeline and lowest risk.

---

# L2 · Context supply

The model knows nothing internal to the institution. At ask time, inject relevant material.

Two very different technical paths—under-explained in the book, critical for selection.

## L2-A Unstructured: knowledge Q&A

Book concepts: Embedding, vector DB, dense/sparse (BM25), hybrid, RRF, HNSW/IVF/PQ, rerankers, Cross-Encoder, ColBERT, chunking, OCR, doc parse, knowledge graphs. GraphRAG is optional, not a default architecture; some integrated platforms have dropped it from the UI—do not plan from sales narrative.

RAG does not make the model smarter; it hands references at ask time. Answer quality is capped by retrieval, not by the model: if retrieval misses, a stronger model still answers wrong, and often falls back to stale parametric knowledge. Ask “what is the current single-source threshold in the procurement guide”; if retrieval hits a two-year-old PDF, the model will answer confidently from expired clauses—and citing expired procurement clauses will get you in trouble here.

The industry has also demoted RAG to one technique under context engineering: retrieve, compress, remember, format, budget tokens. Retrieval is only one ring of that work.

## L2-B Structured: data Q&A

Book concepts: CDC, WAL, ELT, lakehouse (Iceberg/Hudi/Delta/Paimon), OLAP (Doris/StarRocks/ClickHouse/DuckDB), MPP, semantic layer, Headless BI, NL2SQL, Schema Linking, catalog, lineage, data contracts, quality gates, streaming (Kafka/Flink/Watermark/Checkpoint).

This path is far heavier than L2-A. Plugging a database into the model is not enough; you need a clean warehouse and unified metric definitions first. That is why the book spends so much on data infrastructure. Ask “how much has been disbursed to country X this year”; if “disbursed” means different things in payment, loan, and finance systems, even pretty SQL will not reconcile.

Failure modes: miss retrieval (bad chunking, query wording mismatch), stale versions, metric inconsistency that looks plausible, ACL bypass at retrieval.

L2-A maps to Form A; L2-B to Form B. That is why the selection handbook keeps saying not to merge them into one project—they only share the top LLM call; everything below barely overlaps.

---

# L3 · Function calling

After L0–L2 the system can only speak. Function calling lets the model say “I want to call tool X with these parameters.”

Book concepts: Function Calling, Tool Use, JSON Schema, structured output.

The single most important line in this document: the model executes nothing. It emits structured text meaning “I suggest calling X with Y.” The host program we write actually runs the call.

Once that is clear, many security answers fall out by themselves: ACL lives in the host, not in the system prompt; prevent “delete the database” by not exposing that tool; injection can make the model request danger, but whether it runs is still our decision. The security boundary is always the host.

Example: extracting invoice fields from a withdrawal request, the model may emit “call extract_invoice with attachment ID …”; reading the attachment and writing fields back is the host’s job. If the host skips ACL, a model “request” to read another project’s attachment must still be denied.

Failure modes: parameter hallucination (real tool, invented args), wrong tool choice, infinite same-tool loops.

Form D (workflow automation) often only needs this layer: LLM on a few understanding/extraction nodes; the path itself is fixed.

---

# L4 · Standard tool access

After L3, every AI app × every business system is a custom adapter. Ten apps × ten systems is a hundred integrations. MCP standardizes this: expose the system once to the standard, and every app can use it.

Book concepts: MCP (Model Context Protocol), tools/resources/prompts, tool registry, Schema versioning.

The value here is economics, not raw ability. With or without MCP the model can do the same things; the difference is one-off glue versus reusable assets. For an institution wiring loan, procurement, and finance legacy systems, that decision has long-term impact—settle it before the first Agent project.

As of 2026-09: the 2026-07-28 spec removed protocol-level sessions and the initialize handshake. Each request carries protocol version and client capabilities; clients may call `server/discover`; servers scale like ordinary HTTP. The “like HTTP” analogy is now more accurate than the session-based version. Enterprise rollout needs the authorization extension (Enterprise-Managed Authorization) so “the agent inherits the initiator’s identity” is a protocol capability, not a custom bolt-on. Progressive tool discovery is coming for large catalogs; Form E’s “≤15 tools” remains a governance cap, not a protocol cap.

Failure modes: vague tool descriptions leading to wrong picks (the Schema text is part of the prompt—many people miss that), silent break on version change, ACL bypassed at the protocol layer, SDKs still on the sessionful spec.

---

# L5 · Agent

Everything above is still one question, one answer. Real tasks need multi-step loops: look something up, decide the next lookup from the result, retry another way on failure, until done. The leap is not a stronger model; it is moving “what next” from if-else in our code to the model at runtime.

Book concepts: Runtime, ReAct, Plan-and-Execute, Reflexion, Self-Refine, memory (short/long), HITL, orchestration frameworks (LangGraph, Microsoft Agent Framework, CrewAI, Dify, Coze). AutoGen is in maintenance mode; do not list it for new work.

Engineering cost cliffs here regardless of model IQ. Paths are no longer enumerable, so you cannot test every case before go-live; you must add state persistence and resume, timeouts and token budgets, retries and idempotency, step-level audit, human checkpoints, and eval sets.

The book is right that a “platform” truly starts here. L0–L4 can be papered over with application-local solutions; L5 needs shared runtime, tool governance, identity, and observability.

Example: diagnosing why a payment is stuck may mean checking payment status, then the borrower’s account, then a sanctions-hit record—each step depends on the previous result, and you cannot enumerate the path in advance. A mid-failure that leaves half-written business state is an order of magnitude harder to compensate and audit than Form D.

Failure modes: non-convergence, drift down the wrong path for many steps, mid-state business inconsistency, cost blowups (hundreds of calls per task), and the hardest one—non-reproducible behavior, where the same input takes different paths twice and attribution fails.

Maps to Form E. The selection handbook’s four preconditions (≤15 tools, single domain, rollback-tolerant, clear done criteria) exist to compress open-path risk.

---

# L6 · Multi-agent

When one agent cannot hold the context and tool set, split roles and add a coordination layer.

Book concepts: A2A, Agent Card; patterns fan-out, pipeline, manager–worker, debate, swarm.

Problems here are organizational design, not pure tech: who supervises whom, whose conclusion wins on conflict, how the others wind down when one fails, how the whole decision chain is explained. Benefits are often overrated; many “multi-agent” needs are L3 or L5 when you unpack them. MCP is how an agent uses tools; A2A is how one agent hands a task to another. Both now sit in the Agentic AI Foundation. A2A is for cross-institution collaboration, not a bank-internal single agent. Standardization lowers integration cost, not audit explainability; Form F’s dissuasive stance does not relax.

Failure modes: coordination cost beating parallel gain, error amplification across agents, multiplied cost, near-impossible attribution.

Maps to Form F; the selection handbook is largely dissuasive.

Protocols across L4–L6—which connection MCP, A2A, AG-UI and Agent Skills each cover, who talks to whom, current versions and governance—see *Protocol comparison* (`protocol-comparison-mcp-a2a-agui-skills.md`).

---

# Four cross-cutting concerns

These are not layers; every layer needs them. The book gives each its own part, which makes them look like late-stage work. In practice you build them from the first project.

Observability: OpenTelemetry, GenAI semantic conventions, Langfuse/Phoenix. Higher layers need full traces, because behavior is not reproducible without a complete chain.

Evaluation: eval sets, Ragas/DeepEval, LLM-as-Judge, benchmarks. This is how you tell whether a change got better or worse. Above L2, no eval set means no production.

Security: prompt and indirect injection, guardrails, red team, OWASP LLM Top 10 (plus the OWASP Agentic Top 10 2026 from L3), NIST AI RMF, identity propagation. Surface grows with layer: L2 adds “consume external documents” injection risk; L3 adds “can execute actions” consequence risk; L5 adds “decides what to execute” amplification.

Cost and deploy: caches (Prefix/Prompt/Semantic), model gateways, routing, budget breakers, KServe, GitOps. Cost climbs fast with layer: L1 is one call; L5 may be hundreds per task.

---

# Two laws

## 1. Higher layers, smaller model share of success

At L0, system ability ≈ model ability. At L5, the model is a small fraction of complexity; the rest is state, ACL, idempotency, audit, eval, and cost control—ordinary engineering.

Practical meaning: a stronger model helps L1/L2 a lot; L5 project outcomes rarely hinge on model choice. Nine in ten failed Agent projects are not “the model wasn’t smart enough.” Do not bet budget and expectations on model pick alone.

## 2. Layer boundaries keep moving down

Work that lived in the application is being absorbed into models. CoT was a prompting trick; reasoning models now step through on their own. Multi-hop retrieve used to be our loop; models increasingly decide to look again.

Practical meaning: architect for replaceable layers. Today’s L2 retrieve loop may be built into the model next year and done better; today’s pile of L5 orchestration may shrink. Do not weld business logic into an orchestration framework—keep interfaces clean so a layer can be lifted out later.

A useful runtime rule: flexible inside, standard outside. Carry business meaning in your own data structures (what a review task contains, what constraints a query has); adapt only at the boundary with frameworks, models, and protocols. A simple test: swapping the orchestration framework should touch only the adapter layer, not business logic. If business objects store a framework’s message types or state objects, you are already welded shut.

---

# How to use this map

Locate a requirement’s layer: one answer is L1–L2; multi-step self-directed work is L5. Layer drives effort and the schedule you quote the business. Jumping a layer usually multiplies work; it is not a small add-on.

What the team should learn: go deep on the active layer and the one below; survey the rest.

What vendors are selling: demos often show L5 effects while quotes and delivery scope cover L2. Ask which layer the feature sits on, and who builds the layers above—that question surfaces a lot.
