# 企业级 Agent 平台工程 · 概念术语提炼

来源：[datagallery-lab/enterprise_agent_platform](https://github.com/datagallery-lab/enterprise_agent_platform) 的 `glossary/terms.md`，按十个主题域重新梳理。

---

## 一、基础概念：先分清三种形态

这本书开篇要解决的是定义混乱问题。**Agent（智能体）**指具备"感知—决策—行动"闭环的程序实体，依赖 LLM 做决策、调用工具、维护状态；**Copilot（助手）**嵌在既有产品里，自主性有限，动作需用户确认；**Workflow（工作流）**则是开发者预先编排好的步骤序列，分支和条件都是写死的。三者的差别在于"谁决定下一步"。

在此之上是 **AI-native System**：以 Agent 为主入口，把数据资产和工具能力当作业务原语的企业系统。书中还反复提到 **mini-platform**，即配套的开源参考实现 `mini-enterprise-agent-platform`，用来把概念映射到真实代码结构。

---

## 二、模型与推理：延迟和成本从哪里省

工具调用侧的核心是 **Function Calling / Tool Use**——LLM 输出结构化的函数调用请求，由宿主程序解析执行，参数声明和结构化输出约束都靠 **JSON Schema**。

性能优化有一条清晰的递进链：**KV Cache** 缓存 Transformer 推理中的历史 Key/Value 避免重算；**Prefix Cache（前缀缓存）**在其之上复用相同 Prompt 前缀的 KV，对 RAG 和 Agent 这类重复调用收益极高；**Speculative Decoding（投机解码）**用小模型出草稿、大模型并行校验来压延迟；**Quantization（量化）**把权重从 FP16 降到 INT8/INT4，常见方法有 GPTQ、AWQ、SmoothQuant。

模型适配方面，**LoRA** 冻结基座、只训练旁路低秩矩阵；**DPO** 是不需要独立奖励模型的对齐方法。推理范式上，**CoT（思维链）**让模型显式输出推理步骤，**ToT（思维树）**在 CoT 基础上分叉多条路径再用启发式择优。

推理引擎点名了 **vLLM**（基于 PagedAttention 的高吞吐引擎）、**SGLang**（强调结构化生成与高效控制流）、**LMDeploy**（对 Qwen、InternLM 有专门优化）。

---

## 三、数据基础设施：整本书篇幅最重的部分

**数据接入**从 **CDC（变更数据捕获）**开始，工具是 Debezium、Flink CDC，底层依赖 **WAL（预写日志）**和 **LSN（日志序列号）**来标记读取进度与恢复点。业务源系统常见 **OMS（订单管理）**和 **WMS（仓储管理）**。加工模式上，**ELT** 先加载原始数据再转换，与 ETL 的先转换后加载相对。

**存储架构**的关键词是 **Lakehouse（湖仓）**——用开放表格式统一数据湖的廉价存储和数仓的事务查询能力。四种表格式各有侧重：**Iceberg** 支持 ACID、模式演进、时间旅行；**Hudi** 强调流批一体和增量处理；**Delta Lake** 由 Databricks 主导；**Paimon** 提供原生流式湖仓表格式。底层存储从 **HDFS** 演进到 **S3** 类对象存储。

**查询引擎**围绕 **OLAP**（Doris、StarRocks、ClickHouse、Trino、DuckDB）与 **OLTP** 的分野展开。**MPP** 架构把查询拆到多节点并行；Doris/StarRocks 的节点角色分为 **FE**（接入/元数据/规划调度）、**BE**（存储与执行）、**CN**（存算分离下只执行不持久化）。优化器层面 **CBO** 基于统计信息估算代价选计划，与规则式 RBO 相对。硬件层面 **SIMD** 是列式引擎提速的基础，**OOM** 则是单机 OLAP 在大 Join 时的典型故障。书中默认的本地 OLAP 引擎是 **DuckDB**（进程内分析型数据库）。

**数据治理**是这部分最容易被跳过但书里最强调的：**Metadata（元数据）**描述资产结构、语义、运行状态与治理属性；**Data Catalog（数据目录）**集中登记归属、标签、质量状态与血缘；**Data Quality** 从完整性、唯一性、准确性、时效性、一致性、有效性六个维度度量；**Quality Gate（质量门禁）**在下游消费前做阻断、降级或告警，并绑定失败动作、责任人和审计记录；**Lineage（数据血缘）**追踪从源系统到表、指标、查询、答案引用的完整链路，开源标准是 **OpenLineage**。

契约与抽象层包括 **Data Contract（数据契约）**——生产者与消费者之间关于 schema、语义、SLA、质量、权限、变更流程的约定；**Headless BI（无头 BI）**把指标定义与具体 BI 工具解耦（Cube、MetricFlow）；**Feature Store（特征平台）**管理在线/离线特征（Feast、Tecton、Hopsworks）。编排框架是 Airflow / Dagster / Prefect，任务依赖用 **DAG** 表达，服务承诺用 **SLA** 约束。

**流式处理**部分强调角色分工：**Kafka** 负责事件存储与分发，不做复杂状态计算；**Flink** 是有状态流计算引擎，支持事件时间、Watermark、Checkpoint；**Spark Structured Streaming** 走微批路线，与 Flink 的原生连续流不同。几个易混淆概念被专门拆开：**Watermark（水位线）**只是事件时间进度的估计，不是"所有事件都已到达"的证明；**Checkpoint** 是周期性自动的状态与位点快照，用于故障恢复；**Savepoint** 是人工触发的可移植快照，用于升级、迁移、回滚；**Exactly-once** 由可重放输入 + 可恢复状态 + 下游幂等三者共同构成，业务层仍需幂等键；**Backpressure（背压）**表现为消费延迟和 Watermark 延迟同时上升。贯穿这一切的抽象是 **Stream-table Duality（流表二象性）**。

---

## 四、向量与知识：RAG 的检索侧全景

检索方式分三路：**Dense Retrieval（稠密检索）**基于向量相似度，**Sparse Retrieval（稀疏检索）**基于词项（BM25、SPLADE），**Hybrid Search（混合检索）**用 RRF（倒数排名融合）合并两者结果。

向量索引算法包括 **HNSW**（分层可导航小世界图，平衡召回与延迟）、**IVF**（倒排文件）、**PQ**（乘积量化，压缩向量降低内存占用）。**Embedding** 模型列举了 BGE、E5、GTE、Conan。

精排环节靠 **Reranker（重排器）**，通常是 Cross-Encoder；**ColBERT / Late Interaction** 保留 token 级向量做查询时细粒度匹配。

知识结构侧有 **Knowledge Graph（知识图谱）**（Neo4j、NebulaGraph）和 **GraphRAG**（微软的图增强 RAG，用社区发现 + 层次化摘要）。文档入口是 **OCR**（PaddleOCR、TrOCR、Nougat）。

---

## 五、Agent 与编排：运行时是平台的核心

**Runtime（运行时）**负责 Agent 任务执行、状态管理与故障恢复；**Tool Registry（工具注册中心）**集中登记工具 Schema、版本与权限。

协议层是这本书的一个重点：**MCP（Model Context Protocol）**是 Anthropic 主导的开放协议，用 host-client-server 架构统一暴露 tools/resources/prompts；**A2A（Agent-to-Agent）**面向 Agent 间协作与跨平台互操作，其中 **Agent Card** 是描述 Agent 能力、端点、认证的元数据文件。

时点注记（2026-09）：MCP 现行规范 2026-07-28 已去掉协议级会话，请求自描述、按普通 HTTP 扩展；A2A 与 MCP 现同属 Agentic AI Foundation。书中的 host-client-server 仍可用来理解角色分工，不要再按「先握手再持会话」来设计。

推理编排范式有四种：**ReAct**（思考与调用交替循环）、**Plan-and-Execute**（先全局规划再分步执行）、**Reflexion（反思）**（失败后复盘轨迹并改进）、**Self-Refine（自我改进）**（用自己的输出做输入迭代优化）。关键节点引入人工审批或纠正的设计叫 **HITL（Human-in-the-Loop，人在回路）**。

**Memory（记忆）**分短期（会话级）和长期（用户/企业级）。编排框架横向对比了 LangGraph、AutoGen、CrewAI、Dify、Coze。时点注记：AutoGen 已进维护模式，新项目看 Microsoft Agent Framework；CrewAI 仍可用于原型。

---

## 六、评估与可观测：怎么证明它在工作

标准层面是 **OpenTelemetry（OTel）**，涵盖 trace/metrics/logs，并采用 **GenAI Semantic Conventions** 来规范 LLM/Agent 的 span 字段。可观测产品有 Langfuse、Phoenix、Helicone；评估框架有 Ragas、TruLens、DeepEval、Promptfoo。

**LLM-as-Judge** 用 LLM 评判 LLM 输出，但需要警惕偏见与稳定性问题。基准测试方面，NL2SQL 用 **Spider / BIRD / CoSQL / SParC**，Embedding 用 **MTEB**。

成本侧有两种缓存要区分：**Semantic Cache（语义缓存）**基于 embedding 相似度命中（GPTCache），**Prompt Cache（提示缓存）**是服务端对相同前缀复用 KV Cache 的能力。质量与性能目标用 **SLO** 量化。

---

## 七、安全与合规：Agent 特有的攻击面

最核心的威胁是 **Prompt Injection（提示注入）**——攻击者在输入中嵌入指令，把 Agent 从原任务上带偏；更隐蔽的是 **Indirect Prompt Injection（间接提示注入）**，攻击者污染外部数据，Agent 一消费就被劫持。

防御手段包括 **Guardrails（护栏）**（NeMo Guardrails、Llama Guard）对输入输出施加规则约束，以及 **Red Teaming（红队）**通过对抗测试发现漏洞（PyRIT、Garak）。

治理框架列了 **OWASP LLM Top 10**、**NIST AI RMF**（核心职能为 GOVERN / MAP / MEASURE / MANAGE）、**EU AI Act**、中国《生成式 AI 服务管理办法》，以及内容溯源标准 **C2PA**。

数据保护概念要注意一个同名陷阱：脱敏语境下的 **Tokenization** 指用令牌不可逆替换敏感数据，与 LLM 的分词完全不同。此外还有 **PII（个人可识别信息）**和 **RBAC（基于角色的访问控制）**。

---

## 八、部署与运维：Kubernetes 上的 LLM 特殊性

GPU 调度靠 **Device Plugin**（NVIDIA Device Plugin 把 `nvidia.com/gpu` 注册为可调度资源）和 **MIG**（单卡切分为多实例）。多卡张量并行推理必须用 **Gang Scheduling（组调度）**，即 Pod 组要么一起成功要么一起等待，Volcano PodGroup 的 `minMember` 实现这一语义。批处理调度器是 **Volcano / Kueue**。

模型服务的主 CRD 是 KServe 的 **InferenceService**，声明 Runtime、副本、扩缩容与流量切分。扩缩容常用 **KPA（Knative Pod Autoscaler）**，按并发数而非 CPU 触发。灰度发布用 **Canary Traffic（金丝雀流量）**，通过 `canaryTrafficPercent` 控制。关键 SLO 指标是 **TTFT（首 token 延迟）**。

部署框架有 KServe、BentoML、Triton、Ray Serve；网关层有 LiteLLM、Portkey、Higress AI Gateway、Kong AI，提供统一 API、路由、限流、计费。

基础设施管理走 **GitOps**（ArgoCD、Flux），Git 仓库作为集群期望状态的 **SSOT（单一事实来源）**；**IaC**（Terraform、Helm）管理基础设施；**External Secrets Operator** 从 Vault/KMS 同步密钥，避免仓库里出现明文。

边缘侧用 **ONNX Runtime / llama.cpp / MLC** 做端侧推理，通过 **OTA** 远程更新，需要校验和验证与原子切换。

---

## 九、前端与交互：流式与多模态

流式输出用 **SSE（Server-Sent Events）**，单向流式 HTTP 协议。**Generative UI（生成式 UI）**由 LLM 输出驱动组件渲染（图表、表单、表格），代表实现是 Vercel AI SDK 的 useChat + tool rendering；安全上必须注意模型输出不能直接写 **DOM**，需要转义、白名单或沙箱，并配合 **CSP（内容安全策略）**缓解 XSS。**Artifacts** 是 Claude.ai 用独立画布展示长内容的模式。

语音 Agent 管线由 **STT（语音转文本）**、**TTS（文本转语音）**、**VAD（语音活动检测，判断说话起止与打断时机）**组成，低延迟接口如 OpenAI 的 **Realtime API**。

---

## 十、数据智能：全书的主线案例

**DataAgent** 是本书核心案例——用自然语言完成数据查询、分析与报告生成的 Agent；**ChatBI** 只是它的早期子集。

底层任务是 **NL2SQL / Text-to-SQL**，关键子问题是 **Schema Linking（模式链接）**，即把自然语言提到的实体和字段映射到实际表列。中间抽象是 **Semantic Layer（语义层）**，连接业务术语与物理数据，定义指标口径和维度关系。分析能力上有 **Auto-EDA（自动探索性数据分析）**，自动产出数据概览、分布和相关性分析。

工具生态：Text-to-Chart / Text-to-Pandas 方向有 Lida、Chat2VIS、PandasAI；开源 DataAgent / Text-to-SQL 平台有 DB-GPT、Vanna、WrenAI、Defog。

---

## 附：几组最容易混淆的术语对照

| 容易混淆的一对 | 关键区别 |
|---|---|
| Checkpoint vs Savepoint | 前者周期自动、用于故障恢复；后者人工触发、用于升级迁移回滚 |
| ELT vs ETL | 前者先加载后转换；后者加载前就转换 |
| Kafka vs Flink | 前者管事件存储与分发；后者管有状态流计算 |
| Tokenization（脱敏） vs Tokenization（分词） | 前者是不可逆令牌替换；后者是 LLM 文本切分 |
| Prompt Cache vs Semantic Cache | 前者服务端复用相同前缀的 KV；后者按 embedding 相似度命中 |
| CBO vs RBO | 前者用统计信息估代价择优；后者按固定规则改写 |
| Dense vs Sparse Retrieval | 前者向量相似度；后者词项匹配 |
| Agent vs Copilot vs Workflow | 自主决策 vs 建议待确认 vs 预先编排 |
| Watermark 的含义 | 是事件时间进度的估计，不是"事件已全部到达"的保证 |
| Exactly-once 的构成 | 可重放输入 + 可恢复状态 + 下游幂等，业务层仍需幂等键 |
