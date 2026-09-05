# Concept Hierarchy Map: From LLM to Agent

Reorder the book’s concepts by “capability stacked from the bottom up.” That order is also historical—each layer was added to fix limits of the one below.

**Core point first: layers do not replace each other; they stack.** In a production Agent today, L0 through L5 often all run at once. Understanding what each layer solves—and what it leaves broken—matters more than memorizing terms.

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

**What this layer is**: a function that takes text and returns text. Nothing else. No memory, no network, no actions, no sense of “now.”

**Book concepts**: LLM, Transformer, autoregressive generation; inference-side KV Cache, Prefix Cache, speculative decoding, quantization (GPTQ/AWQ…); adaptation LoRA, DPO; engines vLLM, SGLang, LMDeploy.

**Key insight**: parametric knowledge is frozen at training time with a cutoff, and the model does not “know that it does not know”—when unsure it still answers fluently and confidently. That is how it works, not a bug to patch. Every higher layer is, in some sense, patching that fact.

**Failure modes**: fabrication (confident fake clauses and numbers), stale knowledge, unreliable arithmetic.

**Our practical choice**: deep optimization of engines/quant/KV is needed mainly for self-hosted GPU fleets. On API/managed services, know the concepts and where cost and latency come from.

---

# L1 · Conversation

**What it solves**: wrap the stateless function so multi-turn chat *looks* continuous—the late-2022 ChatGPT leap was interaction form, not a new model class.

**Book concepts**: context window, token budget, prompting, CoT, ToT, system prompt.

**Key insight**: **multi-turn memory is an illusion.** The model does not remember the last line; the app resends history every turn. Consequences: longer chats cost more; past the window you must truncate or compress—and *how* you truncate defines UX.

**Failure modes**: overflow “amnesia,” mid-context dilution, cost growing with history.

**Our forms**: Form C (assisted drafting) mostly needs only this layer—shortest timeline, lowest risk.

---

# L2 · Context supply

**What it solves**: the model knows nothing internal to the institution. At ask time, inject relevant material.

Two very different technical paths—under-explained in the book, critical for selection.

## L2-A Unstructured: knowledge Q&A

**Book concepts**: Embedding, vector DB, dense/sparse (BM25), hybrid, RRF, HNSW/IVF/PQ, rerankers, Cross-Encoder, ColBERT, chunking, OCR, doc parse, knowledge graphs. GraphRAG is optional, not a default architecture; some integrated platforms have dropped it from the UI—do not plan from sales narrative.

**Key insight**: RAG does not make the model smarter—it hands references. Answer quality is capped by retrieval. Industry now demotes RAG to one technique under **context engineering** (retrieve, compress, remember, format, budget tokens).

## L2-B Structured: data Q&A

**Book concepts**: CDC, WAL, ELT, lakehouse (Iceberg/Hudi/Delta/Paimon), OLAP, MPP, semantic layer, Headless BI, NL2SQL, Schema Linking, catalog, lineage, data contracts, quality gates, streaming (Kafka/Flink…).

**Key insight**: far heavier than L2-A. Not “plug a DB into the model,” but clean warehouse + unified metrics first. That is why the book spends so much on data infrastructure.

**Failure modes**: miss retrieval, stale versions, metric inconsistency that looks plausible, ACL bypass at retrieval.

**Our forms**: L2-A → Form A; L2-B → Form B. Do not merge into one project—they only share the top LLM call.

---

# L3 · Function calling

**What it solves**: after L0–L2 the system can only *speak*. Function calling lets the model say “call tool X with params Y.”

**Book concepts**: Function Calling, Tool Use, JSON Schema, structured output.

**Most important insight in this document**: **the model executes nothing.** It emits structured text meaning “I suggest calling X with Y.” The host runs tools.

Security answers fall out: ACL lives in the host, not the system prompt; prevent “delete DB” by not exposing the tool; injection can request danger, but execution is still ours. **The security boundary is always the host.**

**Failure modes**: param hallucination, wrong tool choice, infinite same-tool loops.

**Our forms**: Form D (workflow automation) often only needs L3—LLM on a few nodes; path is fixed.

---

# L4 · Standard tool access

**What it solves**: without a standard, every app×system is a custom adapter. MCP exposes capabilities once for reuse.

**Book concepts**: MCP, tools/resources/prompts, tool registry, Schema versioning.

**Key insight**: economics, not raw ability. With or without MCP the model can do the same things; the difference is one-off glue vs reusable assets. For institutions wiring loan, procurement, and finance systems, decide before the first Agent project.

**As of 2026-09**: the 2026-07-28 spec removed protocol-level sessions and the initialize handshake. Each request carries protocol version and client capabilities; clients may call `server/discover`; servers scale like ordinary HTTP. The “like HTTP” analogy is now more accurate than the session-based version. Enterprise rollout needs the authorization extension (Enterprise-Managed Authorization) so “the agent inherits the initiator’s identity” is a protocol capability, not a custom bolt-on. Progressive tool discovery is coming for large catalogs—Form E’s “≤15 tools” remains a governance cap, not a protocol cap.

**Failure modes**: vague tool descriptions → wrong pick; silent break on version change; ACL bypassed at protocol layer; SDKs still on the sessionful spec.

---

# L5 · Agent

**What it solves**: real tasks need multi-step loops. The leap is not a stronger model—it is moving “what next” from if-else in our code to the model at runtime.

**Book concepts**: Runtime, ReAct, Plan-and-Execute, Reflexion, Self-Refine, memory, HITL, LangGraph / Microsoft Agent Framework / CrewAI / Dify / Coze. AutoGen is in maintenance mode; do not list it for new work.

**Key insight**: engineering cost cliffs regardless of model IQ. Non-enumerable paths force state persistence/resume, timeouts and token budgets, retries and idempotency, step audit, HITL, eval sets.

**The book is right that a “platform” truly starts here.** L0–L4 can be application-local; L5 needs shared runtime, tool governance, identity, observability.

**Failure modes**: non-convergence, drift, mid-state business inconsistency, cost blowups, **non-reproducible behavior**.

**Our forms**: Form E, with four preconditions (≤15 tools, single domain, rollback-tolerant, clear done criteria) to compress open-path risk.

---

# L6 · Multi-agent

**What it solves**: one agent cannot hold context/tools; split roles and coordinate.

**Book concepts**: A2A, Agent Card; fan-out, pipeline, manager–worker, debate, swarm.

**Key insight**: organizational design, not pure tech—who supervises, conflict resolution, failure cleanup, explainable chains. Benefits are often overrated; many “multi-agent” needs are L3 or L5. MCP is how an agent uses tools; A2A is how one agent hands a task to another. Both now sit in the Agentic AI Foundation. A2A is for cross-institution collaboration, not a bank-internal single agent. Standardization lowers integration cost, not audit explainability—Form F remains mostly dissuasive.

**Failure modes**: coordination > parallel gain, error amplification, multiplied cost, near-impossible attribution.

**Our forms**: Form F—selection handbook is largely dissuasive.

---

# Four cross-cutting concerns

Not layers; required from the first project.

**Observability**—OpenTelemetry, GenAI conventions, Langfuse/Phoenix. Higher layers need full traces.

**Evaluation**—eval sets, Ragas/DeepEval, LLM-as-Judge. Above L2, no eval set means no production.

**Security**—injection, guardrails, red team, OWASP LLM Top 10, NIST AI RMF, identity propagation. Surface grows with layer.

**Cost & deploy**—caches, gateways, routing, budget breakers. L1 is one call; L5 may be hundreds.

---

# Two laws

## 1. Higher layers, smaller model share of success

At L0, system ≈ model. At L5, model is a small fraction of complexity. Stronger models help L1/L2 a lot; L5 outcomes rarely hinge on model choice. Do not bet budget and expectations on model pick alone.

## 2. Layer boundaries keep moving down

What lived in app code moves into models (CoT, multi-hop retrieve). **Architect for replaceable layers**—flexible inside, standard outside—so adapters swap without welding business objects to a framework’s message types.

---

# How to use this map

**Locate a requirement’s layer**: one answer → L1–L2; multi-step self-directed work → L5. Layer drives effort and schedule; jumping a layer often multiplies work.

**What the team should learn**: go deep on the active layer and the one below; survey the rest.

**What vendors are selling**: demos often show L5 effects while quotes cover L2. Ask which layer the feature sits on—and who builds the layers above.
