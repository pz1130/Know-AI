# Enterprise Agent Platform Engineering · Term Digest

Source: [datagallery-lab/enterprise_agent_platform](https://github.com/datagallery-lab/enterprise_agent_platform) `glossary/terms.md`, reorganized into ten domains.

---

## 1. Foundations: three shapes first

**Agent**—a program entity with a perceive–decide–act loop, using an LLM to decide, call tools, and keep state.  
**Copilot**—embedded in an existing product, limited autonomy, actions need user confirm.  
**Workflow**—developer-orchestrated step sequences with fixed branches. Difference: **who decides next**.

Above them: **AI-native System**—Agent as main entry, data assets and tools as business primitives. The book’s **mini-platform** is the open reference `mini-enterprise-agent-platform` mapping concepts to code.

---

## 2. Models & inference: where latency and cost are saved

**Function Calling / Tool Use**—LLM emits structured call requests; the host executes. **JSON Schema** constrains args and structured output.

Performance chain: **KV Cache** → **Prefix Cache** (huge for RAG/Agent) → **Speculative Decoding** → **Quantization** (GPTQ, AWQ, SmoothQuant…).

Adaptation: **LoRA**, **DPO**. Reasoning: **CoT**, **ToT**. Engines: **vLLM**, **SGLang**, **LMDeploy**.

---

## 3. Data infrastructure: the book’s heaviest part

**Ingest**: **CDC** (Debezium, Flink CDC), **WAL**, **LSN**. Processing: **ELT** vs ETL. Domains often cite OMS/WMS.

**Storage**: **Lakehouse**—Iceberg, Hudi, Delta Lake, Paimon; storage HDFS → S3-class object stores.

**Query**: **OLAP** vs **OLTP**; **MPP**; FE/BE/CN roles; **CBO** vs RBO; **SIMD**; **OOM** on big joins; local default **DuckDB**.

**Governance**: **Metadata**, **Data Catalog**, **Data Quality** (six dimensions), **Quality Gate**, **Lineage** (OpenLineage). Contracts: **Data Contract**, **Headless BI**, **Feature Store**. Orchestration: Airflow/Dagster/Prefect, **DAG**, **SLA**.

**Streaming**: **Kafka** store/distribute; **Flink** stateful compute; Spark Structured Streaming micro-batch. Distinctions: **Watermark**, **Checkpoint**, **Savepoint**, **Exactly-once** (= replayable input + recoverable state + downstream idempotency), **Backpressure**, **Stream-table Duality**.

---

## 4. Vectors & knowledge: RAG retrieval side

**Dense / Sparse / Hybrid** (RRF). Indexes **HNSW / IVF / PQ**. Embeddings BGE, E5, GTE, Conan. **Reranker**, ColBERT. **Knowledge Graph**, **GraphRAG**. **OCR** entry.

---

## 5. Agent & orchestration: runtime is the core

**Runtime**, **Tool Registry**. Protocols: **MCP**, **A2A** + **Agent Card**. Patterns: **ReAct**, **Plan-and-Execute**, **Reflexion**, **Self-Refine**, **HITL**. **Memory** short/long. Frameworks: LangGraph, AutoGen, CrewAI, Dify, Coze.

---

## 6. Evaluation & observability

**OpenTelemetry** + GenAI semantic conventions. Products: Langfuse, Phoenix, Helicone. Eval: Ragas, TruLens, DeepEval, Promptfoo. **LLM-as-Judge** (watch bias). Benchmarks: Spider/BIRD…, **MTEB**. **Semantic Cache** vs **Prompt Cache**. **SLO**.

---

## 7. Security & compliance

**Prompt Injection**, **Indirect Prompt Injection**. **Guardrails**, **Red Teaming**. Frameworks: **OWASP LLM Top 10**, **NIST AI RMF**, **EU AI Act**, China generative-AI rules, **C2PA**. Homonym trap: privacy **Tokenization** ≠ LLM tokenization. **PII**, **RBAC**.

---

## 8. Deploy & ops on Kubernetes

GPU: **Device Plugin**, **MIG**, **Gang Scheduling** (Volcano). **InferenceService** (KServe), **KPA**, canary traffic, **TTFT**. Stacks: KServe, BentoML, Triton, Ray Serve; gateways LiteLLM, Portkey, Higress, Kong AI. **GitOps**, **IaC**, External Secrets. Edge: ONNX / llama.cpp / MLC, **OTA**.

---

## 9. Frontend & interaction

**SSE** streaming. **Generative UI** (Vercel AI SDK patterns)—never raw model text into **DOM**; escape, allowlists, sandboxes, **CSP**. **Artifacts**. Voice: **STT / TTS / VAD**, Realtime APIs.

---

## 10. Data intelligence: the spine case

**DataAgent**—NL data query, analysis, reporting; **ChatBI** is an early subset. Core task **NL2SQL** with **Schema Linking**; middle abstraction **Semantic Layer**; **Auto-EDA**. Tooling: Lida, Chat2VIS, PandasAI; platforms DB-GPT, Vanna, WrenAI, Defog.

---

## Appendix: easy confusions

| Pair | Distinction |
|---|---|
| Checkpoint vs Savepoint | Auto recovery snapshot vs manual portable snapshot |
| ELT vs ETL | Load-then-transform vs transform-then-load |
| Kafka vs Flink | Event store/dispatch vs stateful stream compute |
| Tokenization (masking) vs (LLM) | Irreversible redaction tokens vs text split |
| Prompt Cache vs Semantic Cache | Prefix KV reuse vs embedding-similar answer hit |
| CBO vs RBO | Cost-based vs rule-based plans |
| Dense vs Sparse retrieval | Vector similarity vs term match |
| Agent vs Copilot vs Workflow | Autonomy vs confirm-assist vs pre-orchestrated |
| Watermark | Estimate of event-time progress, not “all events arrived” |
| Exactly-once | Replayable input + recoverable state + downstream idempotency |
