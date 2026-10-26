# Protocol comparison: MCP · A2A · AG-UI · Agent Skills

> Companion to *Concept map: from LLM to agent*, L4–L6. These four are often lumped together as "agent protocols", but they cover different connections: MCP is agent to tools, A2A is agent to agent, AG-UI is agent to user interface, and Agent Skills is not a wire protocol at all but a file format for giving an agent "how-to" capabilities. When someone says "we need an agent protocol" in a selection meeting, ask which connection they mean. Status and versions checked 2026-10-26; sources at the end.

---

# 1. Summary table

| | MCP (Model Context Protocol) | A2A (Agent2Agent) | AG-UI (Agent-User Interaction) | Agent Skills |
|---|---|---|---|---|
| **Connection** | Agent / AI app → tools, data, prompt templates | Agent → another (remote, opaque) agent | Agent backend → front-end UI | Capability package loaded locally by the agent; no network |
| **Who talks to whom** | MCP client in the host ↔ MCP server (a business system exposes itself once, to the standard) | Client agent ↔ remote agent; reads the other's Agent Card, then hands over a task | Front end sends one request; agent returns an ordered stream of typed events | No peer: at start-up the agent reads each skill's name and description, and loads the full text and attachments only when a task matches |
| **What is exchanged** | Tools / resources / prompts | Tasks, messages, artifacts, status updates for long tasks | Events: text streams, tool calls, reasoning, shared state, progress, human-approval requests, etc. (31 types in 1.0) | Folder + `SKILL.md` (YAML front matter `name`, `description` + instructions), optionally scripts, references, templates |
| **Concept-map layer** | **L4** standardised tool access | **L6** multi-agent | **L5** the agent's human-interaction surface (human-in-the-loop points); at L6 it can also surface sub-agent events | **L5** agent skills / procedural knowledge; often directs the agent to call L4 MCP tools |
| **Forms** | E (also single nodes in D) | F (only needed for cross-organisation collaboration) | C / E / F when building your own agent UI | E / F; also coding agents in developer tools |
| **Current status / version** | Spec **2026-07-28**: protocol-level sessions and the initialize handshake removed, self-describing requests, scales like plain HTTP; enterprise auth via Enterprise-Managed Authorization | **v1.0** (released 2026-03, first stable): signed Agent Cards, multi-tenancy, version negotiation | **1.0** (released and frozen 2026-09): HTTP + SSE or Protobuf | Open spec at agentskills.io; **no version number found for the spec itself (待核实)** |
| **Governance** | Founding project of the Agentic AI Foundation (AAIF, under the Linux Foundation, 2025-12); technical direction still with its maintainers | AAIF Growth Stage project (joined 2026-08) | Maintained by the ag-ui-protocol community, originated at CopilotKit; no announcement of joining AAIF found | AAIF project (announced 2026-10-22, contributed by Anthropic) |
| **What to watch here** | Tool-schema descriptions are part of the prompt; auth must "inherit the initiator's permissions"; ≤15 tools is a governance cap | Inter-agent messages must be authenticated and validated (OWASP ASI07); standardisation does not relax audit explainability | Human-approval requests reach the UI through it; approvals must be written to the audit log | Bundled scripts run in the agent environment; vet external skills as supply chain (OWASP ASI04) |

---

# 2. Back on the concept map

```
L6 Multi-agent            ── A2A: agent ↔ agent (hand over tasks)
L5 Agent                  ── AG-UI: agent ↔ user interface (event stream, approvals)
                          ── Agent Skills: how-to loaded by the agent (files, not a protocol)
L4 Standardised tools     ── MCP: agent ↔ tools / data
L3 Function calling       ── each model API's tool calling (MCP sits on top)
```

Three rules of thumb:

1. Single agent only (form E): MCP is a must; Skills optional; AG-UI only if you build your own UI; A2A not needed. In-bank payment-stuck diagnosis usually stops at this line.
2. MCP and Skills are not either/or: MCP connects callable external systems; a skill packages instructions and scripts for a kind of task, and can name which MCP tool to call.
3. A2A vs MCP boundary: if the other side is an agent that decides for itself and whose internals you cannot see, use A2A; if it is a tool that executes on parameters, use MCP. Loan, procurement, and finance systems you can call directly should be exposed as MCP tools, not wrapped as agents behind A2A.

---

# 3. Questions for vendors

- MCP: which spec version? Still on the old session-based spec? Does auth support Enterprise-Managed Authorization and access business systems as the initiator?
- A2A: v1.0 signed Agent Cards? How are inter-agent messages authenticated and logged?
- AG-UI: how do approval events reach the audit log? Can long tasks resume after the UI disconnects?
- Agent Skills: where do skills come from, who reviews them, and in what sandbox do their scripts run?

---

Sources: MCP spec 2026-07-28 https://blog.modelcontextprotocol.io/posts/2026-07-28/ ; MCP joins AAIF https://blog.modelcontextprotocol.io/posts/2025-12-09-mcp-joins-agentic-ai-foundation/ ; A2A v1.0 https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/ ; A2A joins AAIF https://a2a-protocol.org/latest/blog/2026/08/27/a-new-chapter-for-a2a-joining-the-agentic-ai-foundation/ ; AG-UI https://github.com/ag-ui-protocol/ag-ui ; Agent Skills https://agentskills.io ; Agent Skills joins AAIF https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox ; AAIF https://aaif.io/about .
