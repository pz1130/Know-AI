# Release and operations checklist

> Companion to the *AI requirements selection handbook* §4 baselines (especially "version & rollback", "full tracing", "cost breakers") and the *Concept handbook* Lecture 8 (observability), Lecture 9 (eval sets) and "model version drift". The handbook says what must exist before go-live; this checklist covers go-live day and after. Applies to forms A–F; the later the form (E, F), the more of it is mandatory.

---

# 1. Pre-launch gate (all items required)

- [ ] Version manifest frozen: model (exact vendor version or snapshot, never "latest"), prompt version, tool-schema version, retrieval-index version, eval-set version; all five on the release ticket.
- [ ] Eval baseline: run the eval set on the frozen versions and record scores as the rollback reference.
- [ ] Tracing ready: spans follow OTel GenAI conventions and can be filtered by release version (Lecture 8); content capture approved per system classification.
- [ ] Cost breakers configured: per-request, per-session, per-day caps and alert recipients.
- [ ] Rollback rehearsed: at least one real rollback in staging, with the time it took.
- [ ] Human fallback: how business continues if the system is switched off (form D falls back to a manual queue; forms A/B show "service paused", not an error page).
- [ ] §4.2 hard constraints re-checked: classification filtering, data residency, accountability trail, no conclusive determinations, external-publication firewall; signed off at review.
- [ ] Kill switch rehearsed: on-call staff can stop this agent (including queued tasks) in one action, and the business continues on the human fallback.
- [ ] Registered in the agent registry: owner, purpose, model and version, permission scope, planned retirement date; cost attached to a specific team or project quota.
- [ ] On-call and escalation: who receives alerts, response time, when to call the business owner and information security.

---

# 2. Gray (staged) release

**Principle**: "correct" is statistical for AI systems; widen only when small traffic shows no problems, with explicit promote and roll-back criteria at each stage.

| Stage | Traffic / scope | Suggested duration | Promote when | Roll back immediately when |
|---|---|---|---|---|
| 0 Shadow | Mirror real requests; users don't see results | 3–5 working days | Accuracy vs baseline / human results ≥ eval baseline | — |
| 1 Internal | Project team + seed users | 1 week | Feedback and spot checks show no severe errors | Any one classification leak, unauthorized action, or wrong externally-published figure |
| 2 Small slice | 5–10% of users or one department | 1–2 weeks | Spot-check accuracy, thumbs-down rate, cost, P95 latency within thresholds | As above, or key metrics worse than baseline beyond threshold |
| 3 Wider | 50% | 1 week | As above | As above |
| 4 Full | 100% | — | — | As above |

- **Forms D, E, F write business data**: stage by *action*, not just by user; read-only first, then low-risk writes, then all; every write uses an idempotency key (Lecture 4).
- **Tag traces with the release**: every trace carries the release version so metrics can be split new vs old.
- **Change one thing at a time**: don't ship a model swap, prompt change and retrieval change together, or you can't tell which caused a regression.

---

# 3. Rollback

- **The rollback unit is the five-version combination**, not a single file. The release ticket records the "last known good combination"; rollback = switch back to it.
- **Config-driven switch**: model name and prompt version switch via config centre or gateway routing, with no redeploy; target minutes.
- **When a vendor retires a model** you cannot go back; register retirement dates and finish evaluating and switching before then (section 4).
- **Business data**: writes already executed by forms D/E/F are not undone by switching versions; they need compensating transactions (Lecture 4). The runbook must say how to find written data, how to compensate, and who confirms.
- **Index rollback**: keep the previous index snapshot; run old and new side by side during rebuild and keep the old one for at least one release cycle.

---

# 4. Model version drift monitoring

The *Concept handbook* "model version drift" section notes vendors update versions, quality may change, and they may not tell you. Monitor three kinds of signal:

1. Version signals (hard). Record the requested model (`gen_ai.request.model`) and the model actually returned (`gen_ai.response.model`); alert on mismatch or when the response model name changes. Attribute names follow OTel GenAI conventions, still in Development status and subject to change (Lecture 8). Track vendor version announcements and retirement schedules; log them quarterly in the ops register.

2. Quality signals (soft, scheduled). Weekly run of the fixed eval set on the live configuration vs the launch baseline; alert on drops beyond threshold (e.g. 3–5 points, set per business). Weekly sample scored by humans or LLM-as-Judge (Lecture 9), attached to the trace (OTel event `gen_ai.evaluation.result`). Also watch week-on-week thumbs-down rate, human rewrite rate (form C), and human rejection rate (form D confirmation nodes).

3. Behavioural signals (indirect). Sudden shifts in output length, refusal rate, tool calls (`gen_ai.invoke_agent.tool_calls`), average steps, token usage (`gen_ai.usage.*`). These often show up before quality drops.

Response: any hard or quality alert, freeze other changes to the system first, run the full eval, then decide to roll back, adjust prompts, or accept the new version and update the baseline.

---

# 5. Incident severity and response

| Level | Examples | Response |
|---|---|---|
| P1 | Classified content shown to unauthorized users; AI output in external materials; unauthorized business-data writes; cost breaker failure causing runaway spend | Stop service or switch to manual immediately; notify information security and business owner; initial report within 24 h |
| P2 | Wrong key figure used by the business; agent wrote bad but compensable data; widespread outage | Roll back or degrade same day; compensate data; postmortem within a week |
| P3 | Individual wrong answers, latency over target, rising thumbs-down | Log, add to eval set, fix in iteration |

Every P1/P2 adds its triggering samples to the eval set so the same error cannot recur. A classification leak or a wrong externally published figure should enter the eval set the day of the postmortem, not only the incident ticket.

---

# 6. Postmortem template

```markdown
# Postmortem: <title>

- Severity: P1 / P2 / P3
- System and form: <system>, form <A–F>
- Detected / recovered / duration:
- Detected by: alert / user feedback / spot check / audit
- Impact: users, requests, classified content involved?, business data written?, reached external materials?

## Version combination at the time
- Model (requested / actually returned):
- Prompt / tool schema / index / eval-set versions:

## Timeline
| Time (Asia/Shanghai) | Event |
|---|---|

## Trace evidence
- Representative trace IDs:
- What the model saw (context, retrieved chunks, tool returns):
- Failing layer: retrieval / context truncation / model judgement / tool / permissions / process design

## Root cause
(Not just "the model hallucinated"—state which defence failed and why)

## Remediation
- Immediate (rollback / stop / compensate):
- Verification and compensation of written data, confirmed by:

## Follow-ups
| Item | Owner | Due | Status |
|---|---|---|---|
| Add triggering samples to eval set |  |  |  |

## Accountability trail
- Human confirmation points involved and who confirmed:
- Report to audit / independent evaluation: yes / no
```

Postmortems chase which defence failed, not individuals; but the §4.2 trail of "who confirmed what, based on which input" must be reconstructable from audit logs; if it isn't, that is itself a follow-up.

Sources (OTel attribute and event names): https://github.com/open-telemetry/semantic-conventions-genai (docs/gen-ai/ gen-ai-spans.md, gen-ai-agent-spans.md, gen-ai-metrics.md, gen-ai-events.md), checked 2026-10-26.

---

# 7. Cost operations and agent registry (after launch)

Pre-launch gates keep a single system from running away; after launch you also need a monthly look at the whole. The platform team should review the following monthly and send conclusions to each business owner.

| What to look at | How | If there's a problem |
|---|---|---|
| Spend distribution | Token and cost reports by team, project, model and agent (showback), sourced from OTel `gen_ai.usage.*` | Teams over quota justify the business value, approved by the business owner; move to chargeback against the department budget if needed |
| Model tiers | Share of calls and spend in gold / silver / bronze | If gold is unusually high, first check whether routing rules are being bypassed, then whether the task really needs gold |
| Batch share | Whether async-capable work (document checks, reports, bulk classification) runs as batch | Move it to the batch API or an overnight queue |
| Agent registry | Does every agent have an owner, any calls in the last 30 days, permissions within the registered scope | Switch off orphaned or idle agents; treat permission overreach as P2 |
| Kill switch | Actually stop one sampled agent each quarter | If it can't be stopped or takes longer than expected, log a follow-up |

Example: one month's report shows a drafting agent with 80% of calls on gold. It turns out the project team hard-wired routing to gold for convenience. After switching back to complexity-based routing, cost for the same output drops to roughly 30% (example figure). Without the report nobody would notice.

Background and more practices are in Chapters 3–4 of *Agent Platforms in Practice and AI Cost Governance: Meeting Notes*.
