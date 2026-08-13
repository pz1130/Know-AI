# Agent / Copilot / Workflow / RAG: A Revised Definition System

An alternative to the four-way taxonomy in Chapter 1, Part I of *Enterprise Agent Platform Engineering*.

The book’s problem is not that the definitions are factually wrong, but that it places four concepts from different layers on a single axis. The revision is: **split a mixed classification into three layers—one root definition, two orthogonal axes, and five adjustable dimensions—so each term returns to its proper layer.**

---

## 1. Root definition: from “closed loop” to “runtime decision rights”

The book defines Agent as “a system closed loop that organizes perception, decision, action, and feedback around a task goal.” The direction is right (define by function, not stack), but too wide—a thermostat also senses, decides, acts, and feedbacks. It is also untestable: the definition alone cannot tell you whether *this* system qualifies.

Tightened wording:

> **An Agent is a system that decides its next action at runtime, and whose actions change state outside the system.**

Both constraints are required. Only the first is a reasoner; only the second is an automation script. Together they create the Agent-specific engineering burden—you cannot enumerate everything it will do before deploy, and what it does cannot always be undone.

This definition also decomposes cleanly: each constraint maps to one axis.

---

## 2. Two orthogonal axes

### Axis A · Decision rights (who decides the next step at runtime)

| Level | Description | Did developers enumerate the action space? |
|---|---|---|
| A0 | Human decides; system only informs | — |
| A1 | Human decides; system provides drafts or candidates | — |
| A2 | System decides, but only among predefined branches | Yes |
| A3 | System generates paths the developer never listed | No |

The A2–A3 line is the most important in this system. It is not “how smart,” but **predictability**: A2’s behavior space is finite and can be tested and approved line by line; A3 cannot—you need boundary constraints and post-hoc audit.

### Axis B · Scope (what actions touch)

| Level | Description |
|---|---|
| B0 | Read-only, inside the system boundary (text back to the user) |
| B1 | Read-only, cross-system (external data, knowledge retrieval) |
| B2 | Writes own state (drafts, memory, session context) |
| B3 | Writes external business state (orders, refunds, config, messages, tickets) |

Axis B is the **degree of irreversible consequence**—how much the platform must invest in ACL, idempotency, compensation, and audit.

### Where the book’s four words sit on the grid

|  | B0–B1 read | B2 write self | B3 write business |
|---|---|---|---|
| **A0–A1 human decides** | RAG | Copilot | Automation with approval |
| **A2 fixed path** | Retrieval pipeline | Stateful process | **Workflow** |
| **A3 runtime generate** | Research Agent | Assistant Agent | **Agent (high-risk cell)** |

The grid exposes what the four-way split hides: most products branded “Agent” sit at A3×B2 or A2×B3; the cell that truly needs heavy governance is **only A3×B3**. Binary frames mix them, so you either overstate risk for most systems or understate risk for that one cell.

---

## 3. Five orthogonal knobs (what the book treated as category traits)

These are design dials. Any A×B combination can tune them independently; they are not categories:

**1. Human-in-the-loop (HITL)**—placement (pre-auth / mid-confirm / final review), granularity (per action / per session / threshold), hardness (hard gate / soft hint). An A3 system with approval gates is still A3; it does not become a Copilot. Baking “needs user confirm” into Copilot’s definition welds a knob into a class.

**2. Reversibility**—can actions undo, how long is the window, is there compensation. This predicts real risk better than “is it an Agent”: a DB-writing system that rolls back every step is safer than an email-only system that cannot recall a send.

**3. State lifetime**—stateless single turn / in-session / long-term across sessions. Drives memory architecture, tenant isolation, retention, and forgetting duties.

**4. Acting identity**—act as the user, as the system, or with delegated credentials. This is the real security watershed; the book barely treats it as definitional. At A3×B3, “act for the user with inherited ACL” and “service account = union of all users” are different orders of magnitude.

**5. Orchestration source**—paths from developers, from the model, or fixed skeleton + local generation. Production design is usually the third; binary frames leave no room for it.

---

## 4. Testable criteria: definitions you can accept

A definition is done only when it fits a review form. To rate A and B, ask:

**“If you turn off the LLM, can the system still complete the task?”**—If yes, it is essentially Workflow; the LLM is interface sugar. If no, you are in A2+.

**“Without code changes, can it produce an action sequence the developer never listed?”**—The operational A2 vs A3 test, and the only truly actionable line.

**“If any step fails, can business state stop mid-way?”**—If yes, you are at B3; you need compensation/sagas, not only retries.

**“Can action logs be replayed and each action attributed to a decision basis?”**—If no, regardless of A/B level, you lack the audit prerequisite for production.

---

## 5. Put the four words back on their own layers

Repair is not rewriting four definitions, but admitting they should never have been peers:

**Agent** stays an **autonomy attribute**, bounded by A3. It describes how the system decides what to do.

**Workflow** stays a **control-flow structure**, i.e. A2. Critical correction: it is not the opposite of Agent, but often Agent’s implementation skeleton. Mature systems are Workflow-heavy with A3 openings only at a few nodes.

**RAG** demotes to a **context-supply mechanism**, peer to Tool Use and Memory. It answers “where does the model get information,” not “who decides,” so it should never sit beside Agent.

**Copilot** demotes to a **delivery shape**, peer to Standalone Agent and Background Agent. It describes where the system is embedded and how users reach it—product/UX layer, fully orthogonal to A/B. A Copilot UI can run A3×B3 behind it.

---

## 6. Why this definition is more useful

The cost of the four-way split is that it **does not map to platform components**—knowing “this is Agent not Copilot” does not tell you what to build. After the revision, each item maps:

Axis A shapes orchestration and approval; Axis B shapes ACL, idempotency keys, compensation, audit investment; reversibility shapes rollback; identity shapes credential design; state lifetime shapes memory and retention.

Also, the book’s Chapter 2 “low/medium/high risk” stratification is actually the best definition content, but buried under platform duties. Under this system it is not separate—it is the **composite of Axis B and reversibility**, computable without a subjective extra ladder. Promote it as Chapter 1’s main frame; demote the four-way split to an introductory example.
