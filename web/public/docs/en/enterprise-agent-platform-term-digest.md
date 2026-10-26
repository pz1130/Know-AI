# Enterprise Agent Platform Engineering · Term Digest

Source: [datagallery-lab/enterprise_agent_platform](https://github.com/datagallery-lab/enterprise_agent_platform) `glossary/terms.md`, reorganized into ten domains. This is a colleague-to-colleague skim, not a dictionary; details still live in the source book and the *Concept handbook*.

---

## 1. Foundations: three shapes first

Chapter one exists to clear definition fog. Agent means a program entity with a perceive–decide–act loop, using an LLM to decide, call tools, and keep state. Copilot sits inside an existing product, with limited autonomy and actions that need user confirm. Workflow is a developer-orchestrated step sequence with fixed branches and conditions. The difference is who decides next—for a finer split see the A×B grid in *Agent definitions revision*.

Above them sits the AI-native System: Agent as main entry, data assets and tools as business primitives. The book’s mini-platform is the open reference `mini-enterprise-agent-platform`, mapping concepts onto real code structure.

---

## 2. Models & inference: where latency and cost are saved

On the tool side the core is Function Calling / Tool Use: the LLM emits a structured call request; the host parses and runs it. JSON Schema constrains arguments and structured output.

Performance has a clear progression: KV Cache stores past Key/Value tensors in Transformer inference to avoid recomputing; Prefix Cache reuses KV for a shared prompt prefix on top of that—high payoff for RAG and Agent workloads with repeated calls; Speculative Decoding drafts with a small model and verifies in parallel with a large one to cut latency; Quantization drops weights from FP16 to INT8/INT4 (GPTQ, AWQ, SmoothQuant…). On API paths here, prefix cache and output length dominate the bill; quantization and inference engines matter mainly for self-hosted fleets.

Adaptation: LoRA freezes the base and trains a low-rank side path; DPO aligns without a separate reward model. Reasoning: CoT makes the model emit steps explicitly; ToT forks multiple paths on top of CoT and picks with a heuristic.

Engines called out: vLLM (PagedAttention, high throughput), SGLang (structured generation and control flow), LMDeploy (tuned for Qwen and InternLM).

---

## 3. Data infrastructure: the book’s heaviest part

Ingest starts with CDC (change data capture)—Debezium, Flink CDC—backed by WAL (write-ahead log) and LSN (log sequence numbers) for read progress and recovery points. Source systems in the book often cite OMS and WMS; here the closer analogues are loan, payment, and procurement cores. Processing: ELT loads raw first then transforms; ETL transforms before load.

Storage keyword: Lakehouse—open table formats that unify cheap lake storage with warehouse-grade transactional query. Four formats with different emphases: Iceberg (ACID, schema evolution, time travel), Hudi (stream–batch unity, incremental), Delta Lake (Databricks-led), Paimon (native streaming lakehouse tables). Underlying storage moved from HDFS to S3-class object stores.

Query engines sit on the OLAP (Doris, StarRocks, ClickHouse, Trino, DuckDB) vs OLTP split. MPP shards a query across nodes. Doris/StarRocks roles: FE (ingress / metadata / planning), BE (store and execute), CN (compute-only under storage–compute split). Optimizers: CBO picks plans from cost estimates on stats; RBO rewrites by fixed rules. SIMD underpins columnar speedups; OOM is the classic single-node OLAP failure on big joins. The book’s default local OLAP is DuckDB (in-process analytical DB).

Metrics definitions and asset registry are the easiest section to skip and the one the book stresses most. Metadata describes structure, semantics, runtime state, and governance attributes; Data Catalog registers ownership, tags, quality, and lineage; Data Quality measures completeness, uniqueness, accuracy, timeliness, consistency, validity; Quality Gate blocks, degrades, or alerts before downstream consume, with failure actions, owners, and audit; Lineage traces source → table → metric → query → answer citation (OpenLineage). Without a shared definition of “disbursed” or “commitment,” Form B projects do not ship—that is the metrics premise the selection handbook keeps repeating, not a separate product-line topic.

Contracts and abstractions: Data Contract (schema, semantics, SLA, quality, ACL, change process between producer and consumer); Headless BI (Cube, MetricFlow) decoupling metric definitions from a specific BI tool; Feature Store (Feast, Tecton, Hopsworks) for online/offline features. Orchestration: Airflow / Dagster / Prefect, dependencies as DAGs, commitments as SLAs.

Streaming roles: Kafka stores and distributes events, it does not do complex stateful compute; Flink is the stateful stream engine (event time, Watermark, Checkpoint); Spark Structured Streaming is micro-batch, unlike Flink’s native continuous stream. Easy mix-ups called out: Watermark estimates event-time progress, it is not proof that every event has arrived; Checkpoint is a periodic automatic state/offset snapshot for recovery; Savepoint is a manually triggered portable snapshot for upgrade, migrate, rollback; Exactly-once is replayable input + recoverable state + downstream idempotency together—business still needs idempotency keys; Backpressure shows up as rising consume lag and Watermark lag together. The spanning abstraction is Stream-table Duality.

---

## 4. Vectors & knowledge: RAG retrieval side

Three retrieval paths: Dense (vector similarity), Sparse (terms—BM25, SPLADE), Hybrid merged with RRF. Policy corpora here mix Chinese and English with many proper nouns; sparse retrieval is often non-optional.

Index algorithms: HNSW (layered navigable small-world—recall vs latency), IVF (inverted files), PQ (product quantization to shrink memory). Embeddings listed: BGE, E5, GTE, Conan.

Rerankers (usually Cross-Encoder) do the fine rank; ColBERT / Late Interaction keeps token-level vectors for fine-grained match at query time.

Structure side: Knowledge Graph (Neo4j, NebulaGraph) and GraphRAG (Microsoft’s graph-augmented RAG via community detection + hierarchical summaries). Document entry is OCR (PaddleOCR, TrOCR, Nougat)—much of this institution’s historical policy and reporting is scanned PDF; without OCR, Form A does not go far.

---

## 5. Agent & orchestration: runtime is the core

Runtime runs agent tasks, state, and recovery; Tool Registry centralizes tool Schema, versions, and ACL.

Protocols are a book focus: MCP (Model Context Protocol), Anthropic-led, exposes tools/resources/prompts via a host-client-server split; A2A (Agent-to-Agent) covers agent collaboration and cross-platform interop, with Agent Card as the metadata file for capabilities, endpoints, and auth.

As of 2026-09: MCP spec 2026-07-28 is sessionless—self-describing requests, scales as ordinary HTTP; A2A and MCP now sit in the Agentic AI Foundation. The book’s host-client-server roles still explain the duty split; do not design around “handshake then hold a session.”

Orchestration patterns: ReAct (think/call loop), Plan-and-Execute (plan globally then step), Reflexion (review the trace after failure), Self-Refine (iterate on own output). HITL (Human-in-the-Loop) inserts human approve or correct at critical nodes—external correspondence and money-touching writes almost always keep such nodes here.

Memory splits short-term (session) and long-term (user / enterprise). Frameworks compared: LangGraph, AutoGen, CrewAI, Dify, Coze. Note: AutoGen is in maintenance mode; new work should look at Microsoft Agent Framework; CrewAI remains fine for prototypes.

---

## 6. Evaluation & observability: how you prove it works

Standard: OpenTelemetry (trace/metrics/logs) with GenAI Semantic Conventions for LLM/Agent span fields. Products: Langfuse, Phoenix, Helicone. Eval frameworks: Ragas, TruLens, DeepEval, Promptfoo.

LLM-as-Judge uses an LLM to score LLM output—watch bias and stability. Benchmarks: NL2SQL via Spider / BIRD / CoSQL / SParC; embeddings via MTEB.

Two caches on the cost side: Semantic Cache hits by embedding similarity (GPTCache); Prompt Cache is server-side KV reuse for identical prefixes. Quality and performance targets are SLOs. Without eval sets and tracing, nothing above Form A should go to production—see *Release and operations checklist*.

---

## 7. Security & compliance: agent-specific attack surface

Core threat: Prompt Injection—attacker embeds instructions in input and steers the agent off task. More subtle: Indirect Prompt Injection—attacker poisons external data; the agent is hijacked on consume (for example a vendor attachment with malicious instructions retrieved into context).

Defenses: Guardrails (NeMo Guardrails, Llama Guard) constraining input/output; Red Teaming (PyRIT, Garak) finding holes via adversarial tests.

Frameworks listed: OWASP LLM Top 10, NIST AI RMF (GOVERN / MAP / MEASURE / MANAGE), EU AI Act, China’s generative-AI service rules, C2PA for content provenance. (Note: after the book, OWASP released the agent-specific Top 10 for Agentic Applications 2026 in December 2025; see the concept handbook §1.9.)

Homonym trap: privacy Tokenization (irreversible token substitution for sensitive data) is not LLM tokenization. Also PII and RBAC.

---

## 8. Deploy & ops on Kubernetes: LLM-specifics

GPU scheduling: Device Plugin (NVIDIA registers `nvidia.com/gpu`) and MIG (slice one card into instances). Multi-GPU tensor-parallel inference needs Gang Scheduling—Pod groups succeed together or wait together; Volcano PodGroup `minMember` implements that. Batch schedulers: Volcano / Kueue.

Main model-serving CRD: KServe InferenceService (Runtime, replicas, scale, traffic split). Scale often via KPA (Knative Pod Autoscaler) on concurrency, not CPU. Canary Traffic via `canaryTrafficPercent`. Key SLO: TTFT (time to first token).

Stacks: KServe, BentoML, Triton, Ray Serve; gateways LiteLLM, Portkey, Higress AI Gateway, Kong AI for unified API, routing, rate limits, billing.

Infra: GitOps (ArgoCD, Flux) with Git as SSOT for desired cluster state; IaC (Terraform, Helm); External Secrets Operator syncing from Vault/KMS so the repo stays free of plaintext secrets.

Edge: ONNX Runtime / llama.cpp / MLC for on-device inference; OTA updates need checksum verification and atomic switch.

---

## 9. Frontend & interaction: streaming and multimodal

Streaming via SSE (Server-Sent Events)—one-way streaming HTTP. Generative UI lets LLM output drive component rendering (charts, forms, tables); representative pattern is Vercel AI SDK useChat + tool rendering. Never write raw model text into the DOM—escape, allowlists, or sandboxes, plus CSP against XSS. Artifacts is Claude.ai’s pattern of a separate canvas for long content.

Voice pipelines: STT, TTS, VAD (speech activity—start/stop and barge-in); low-latency interfaces such as OpenAI’s Realtime API.

---

## 10. Data intelligence: the spine case

DataAgent is the book’s core case: an agent that does data query, analysis, and report generation in natural language; ChatBI is an early subset. Mapped here, that is Form B: without a semantic layer and shared metrics, such systems do not ship.

Underlying task: NL2SQL / Text-to-SQL; critical subproblem Schema Linking (map entities and fields in natural language to real tables and columns). Middle abstraction: Semantic Layer, connecting business terms to physical data and defining metric definitions and dimension relations. Analysis: Auto-EDA for automatic overviews, distributions, correlations.

Tooling: Text-to-Chart / Text-to-Pandas via Lida, Chat2VIS, PandasAI; open DataAgent / Text-to-SQL platforms DB-GPT, Vanna, WrenAI, Defog.

---

## Appendix: easy-to-confuse pairs

| Pair | Critical difference |
|---|---|
| Checkpoint vs Savepoint | Periodic automatic, for failure recovery vs manually triggered, for upgrade / migrate / rollback |
| ELT vs ETL | Load then transform vs transform before load |
| Kafka vs Flink | Event store and distribute vs stateful stream compute |
| Tokenization (privacy) vs Tokenization (LLM) | Irreversible token substitution vs text splitting for the model |
| Prompt Cache vs Semantic Cache | Server-side KV reuse for identical prefixes vs hit by embedding similarity |
| CBO vs RBO | Cost estimates from stats vs fixed rewrite rules |
| Dense vs Sparse Retrieval | Vector similarity vs term matching |
| Agent vs Copilot vs Workflow | Autonomous decide vs suggest-for-confirm vs pre-orchestrated |
| Watermark meaning | Estimate of event-time progress, not a guarantee that every event has arrived |
| Exactly-once composition | Replayable input + recoverable state + downstream idempotency; business still needs idempotency keys |
