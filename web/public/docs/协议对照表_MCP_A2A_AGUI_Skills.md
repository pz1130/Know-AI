# 协议对照表：MCP · A2A · AG-UI · Agent Skills

> 配套《概念层级图谱：从 LLM 到 Agent》L4–L6。四样东西经常被并列成"Agent 协议"，但它们管的是不同的连接：MCP 管 Agent ↔ 工具，A2A 管 Agent ↔ Agent，AG-UI 管 Agent ↔ 用户界面，Agent Skills 根本不是线上协议，而是一种给 Agent 装"做事方法"的文件格式。 状态与版本核对于 2026-10-26，来源见文末。

---

# 一、总表

| | MCP（Model Context Protocol） | A2A（Agent2Agent） | AG-UI（Agent-User Interaction） | Agent Skills |
|---|---|---|---|---|
| **管哪段连接** | Agent / AI 应用 → 工具、数据、提示模板 | Agent → 另一个（远程、不透明的）Agent | Agent 后端 → 前端用户界面 | Agent 本地加载的能力包，不走网络 |
| **谁和谁说话** | Host 里的 MCP Client ↔ MCP Server（业务系统按标准暴露一次） | Client Agent ↔ Remote Agent，先读对方的 Agent Card 再交任务 | 前端发一次请求，Agent 回一串有序的类型化事件 | 无"对端"：Agent 启动时读各 Skill 的名称与描述，匹配任务时才读全文与附件 |
| **交换什么** | Tools / Resources / Prompts | 任务、消息、产物（Artifact），长任务的状态更新 | 文本流、工具调用、推理过程、共享状态、进度、人工确认请求等事件（1.0 共 31 种） | 目录 + `SKILL.md`（YAML 头 `name`、`description` + 操作说明），可附脚本、参考资料、模板 |
| **对应图谱层** | **L4** 标准化工具接入 | **L6** 多 Agent 协同 | **L5** Agent 的人机交互面（人工介入点）；L6 时也能把子 Agent 事件推到界面 | **L5** Agent 的"技能 / 程序性知识"；常指导 Agent 去调用 L4 的 MCP 工具 |
| **对应形态** | E（D 的个别节点也可用） | F（跨机构协同才需要） | 自建 Agent 交互界面时的 C / E / F | E / F；也用于开发者工具里的编码 Agent |
| **现行状态 / 版本** | 现行规范 **2026-07-28**：去掉协议级会话和 initialize 握手，请求自描述，按普通 HTTP 水平扩展；企业授权看 Enterprise-Managed Authorization | **v1.0**（2026-03 发布，首个稳定版）：签名 Agent Card、多租户、版本协商 | **1.0**（2026-09 发布并冻结）：HTTP + SSE 或 Protobuf | 开放规范见 agentskills.io；**规范本身的版本号未查到（待核实）** |
| **治理方** | Agentic AI Foundation（AAIF，Linux 基金会下）创始项目（2025-12），技术方向仍由原维护者决定 | AAIF Growth Stage 项目（2026-08 加入） | ag-ui-protocol 社区维护，源自 CopilotKit；未见加入 AAIF 的公告 | AAIF 项目（2026-10-22 宣布，由 Anthropic 贡献） |
| **本行关注点** | 工具 Schema 描述是提示词的一部分；授权要做成"继承发起人权限"；工具 ≤15 是治理上限 | Agent 间消息必须鉴权和校验（OWASP ASI07）；标准化不降低审计可解释性要求 | 人工确认请求通过它推到界面，确认结果要写审计日志 | 附带脚本会在 Agent 环境执行，引入外部 Skill 按供应链审查（OWASP ASI04） |

---

# 二、放回层级图谱看

```
L6 多 Agent 协同   ── A2A：Agent ↔ Agent（交任务）
L5 Agent           ── AG-UI：Agent ↔ 用户界面（流式事件、人工确认）
                   ── Agent Skills：Agent 加载的做事方法（文件，非协议）
L4 标准化工具接入  ── MCP：Agent ↔ 工具 / 数据
L3 函数调用        ── 各家模型 API 的 tool calling（MCP 建在它之上）
```

三条判断：

1. **只做单体 Agent（形态 E）**：MCP 必看；Skills 可选；AG-UI 只在自建界面时看；A2A 用不到。
2. **MCP 和 Skills 不是二选一**：MCP 接入"能调用的外部系统"，Skill 装"怎么做这类事"的说明和脚本；一个 Skill 可以写明去调哪个 MCP 工具。
3. **A2A 和 MCP 的边界**：对方是"一个能自己决策的 Agent、你看不到它的内部"（用 A2A；对方是"一个按参数执行的工具"）用 MCP。行内能直接调的系统都应作为 MCP 工具暴露，不要包成 Agent 再走 A2A。

---

# 三、选型时该问供应商的问题

- **MCP**：支持哪一版规范？还停在有会话的旧规范吗？授权是否支持 Enterprise-Managed Authorization、以发起人身份访问业务系统？
- **A2A**：是否支持 v1.0 的签名 Agent Card？Agent 间消息怎么鉴权、怎么留痕？
- **AG-UI**：人工确认事件怎么落审计日志？界面断线后长任务能否恢复？
- **Agent Skills**：Skill 从哪里来、谁审核、脚本在什么沙箱里执行？

---

来源：MCP 规范 2026-07-28 https://blog.modelcontextprotocol.io/posts/2026-07-28/ ；MCP 加入 AAIF https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/ ；A2A v1.0 https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/ ；A2A 加入 AAIF https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/ ；AG-UI https://github.com/ag-ui-protocol/ag-ui ；Agent Skills https://agentskills.io ；Agent Skills 加入 AAIF https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox ；AAIF https://aaif.io/about 。
