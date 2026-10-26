# Cost and capacity estimation (forms A–F)

> Companion to the *AI requirements selection handbook*, §4 "Cost gate". The goal is not a quote but an order of magnitude in ten minutes at triage time: roughly how many tokens a request uses, how long it takes, what it costs, and how much concurrency it needs. Procurement-guide Q&A and a payment-stuck Agent differ by more than an order of magnitude—getting the magnitude right at triage beats arguing over decimal places.
>
> Every number here is an example (labelled "example"), not a vendor price or measurement. Look up unit prices, throughput and rate limits on the chosen model's official pricing page and contract at project start, and record the date; prices change, often together with billing changes (caching, batch, long-context tiers).

---

# 1. General formulas

## 1.1 Tokens per model call

```
T_in  = T_sys + T_hist + T_ctx + T_user        (input tokens)
T_out = expected output length                 (output tokens)
```

- `T_sys`: system prompt + tool schemas. Tool schemas are input too; descriptions of 15 tools can be a thousand-plus tokens, paid again on every step.
- `T_hist`: history accumulated across turns or agent loop steps.
- `T_ctx`: injected content; retrieved chunks, table schemas, documents to process.
- Character/word-to-token ratios differ by tokenizer and language. Measure ten real samples with the target model's tokenizer or official counting endpoint; don't use rule-of-thumb factors.

## 1.2 Cost per request

```
C = ( T_in_uncached × P_in + T_in_cached × P_cache + T_out × P_out ) ÷ 1,000,000
```

`P_in` / `P_out` / `P_cache` are prices per million tokens. Without cache pricing, `P_cache = P_in`. Add non-model costs separately: embeddings, reranking, OCR, vector store, orchestration engine.

## 1.3 Latency

```
L_call    ≈ TTFT + T_out ÷ output rate
L_request ≈ Σ L_call over serial steps + Σ tool/retrieval time   (parallel branches: take the slowest)
```

`TTFT` is time to first token; long inputs lengthen it. Output tokens usually drive latency more than input tokens; shorten output first.

## 1.4 Capacity (concurrency and rate limits)

```
Concurrency ≈ peak requests/sec × L_request                 (Little's law)
TPM needed  ≈ peak requests/min × (T_in + T_out) × calls per request
```

Compare TPM / RPM needs with the provider's rate limits or the measured throughput of a self-hosted cluster. Size for peaks (weekday mornings, quarter-end, before Board meetings), not daily averages.

## 1.5 Monthly budget and gates

```
Monthly cost ≈ requests/day × C × working days × (1 + retry rate) × safety factor (1.5–2 suggested)
```

Set gates at three levels (handbook §4.1: per request, per session, per day): per-request cap ≈ 3–5× normal; per-session cap; daily budget ≈ monthly budget ÷ working days × 1.5. Trip and alert on breach, using OTel `gen_ai.usage.*` as the data source (see *Concept handbook*, Lecture 8).

---

# 2. Estimation by form

| Form | Model calls per request | Main token source | Cost grows with | Notes |
|---|---|---|---|---|
| A Knowledge Q&A | 1 (+ optional query rewrite) | `T_ctx` = k chunks × chunk length | Linear: k, chunk length | Add embedding (one-off ingestion + once per query) and reranking; ingestion = total document tokens × embedding price |
| B Data Q&A | 2–3 (generate SQL → retry on failure → explain) | Semantic layer / schema description | Linear: tables, metric definitions; × (1 + SQL failure rate) | Add OLAP query cost; measure SQL failure rate on the eval set |
| C Assisted drafting | 1–3 (outline → sections) | Reference documents + **long output** | Linear: output length | Latency is output-bound; sections can run in parallel |
| D Workflow automation | 1–2 per item (LLM nodes only) | Document / attachment content | Linear: item volume | Cost per item × items per month; other nodes are classic integration with almost no tokens |
| E Scoped autonomous agent | N steps, 1 call each | `T_sys` (incl. tool schemas) + **growing history** | **Roughly quadratic** in N | See formula below; max steps and token caps are mandatory |
| F Multi-agent | Coordinator + m sub-agents, N steps each | Each sub-agent's E-type cost + merge | ≈ m × E + merge; latency = slowest parallel branch | Estimate a single E first, multiply by m, add coordination and conflict resolution |

Key formula for form E: each step appends the previous tool call and result to history, with increment Δ per step:

```
T_in_total  ≈ N × T_0 + Δ × N × (N − 1) ÷ 2
T_out_total ≈ N × output per step
```

`T_0` is the first-step input (system prompt + tool schemas + task). Doubling steps nearly quadruples input tokens; the root of "hundreds of calls per task" cost blowouts. Context compaction (hard criterion 1 for form E) and prompt caching cut the `N × T_0` term substantially; estimate an "uncached" and a "cached" band.

---

# 3. Worked examples (all example numbers)

Assume example prices `P_in = 2`, `P_out = 8` (CNY per million tokens; not any vendor's price), no caching; example output rate 50 tokens/s, TTFT 1 s.

Example A: procurement-guideline Q&A
- `T_sys` 500 + `T_user` 50 + `T_ctx` 5 chunks × 600 = 3,550 input; 400 output.
- Cost: 3,550 × 2 ÷ 10⁶ + 400 × 8 ÷ 10⁶ = 0.0071 + 0.0032 ≈ CNY 0.010 per query.
- Latency: 1 + 400 ÷ 50 = 9 s, plus ~0.3 s retrieval and rerank ≈ 9.3 s (with streaming, users see text after 1 s).
- 2,000 queries/day: ~CNY 20.6/day; × 22 working days × 1.5 safety ≈ CNY 680/month.

Example E: disbursement-stall investigation agent
- `T_0` = system prompt 1,000 + tool schemas 15 × 150 = 2,250 + task 750 = 4,000; Δ = 800 per step; N = 8; 200 output per step.
- Input: 8 × 4,000 + 800 × 8 × 7 ÷ 2 = 32,000 + 22,400 = 54,400; output 1,600.
- Cost: 54,400 × 2 ÷ 10⁶ + 1,600 × 8 ÷ 10⁶ = 0.1088 + 0.0128 ≈ CNY 0.12 per task, about 12× example A.
- Latency: 8 × (1 + 200 ÷ 50) = 40 s, plus 8 tool calls × 1.5 s = 12 s ≈ 52 s; design the UI as an async task; don't make users wait.
- If it runs away to N = 30: input = 30 × 4,000 + 800 × 30 × 29 ÷ 2 = 468,000, cost ≈ CNY 0.98 (incl. 6,000 output), ~8× normal; the per-task cap must trip before this.

Example D: invoice-field extraction for withdrawal applications
- 1 call per item: 3,000 input (OCR text + extraction schema), 300 output: 0.006 + 0.0024 ≈ CNY 0.008 per item; 5,000 items/month ≈ CNY 42 (example). Model cost is negligible; schedule and risk sit in system integration, consistent with "LLM in only one or two nodes".

Capacity example: example A at a peak of 2 queries/s × 9.3 s: ~19 concurrent; TPM ≈ 120 queries/min × 3,950 ≈ 474k tokens/min. Check this against rate limits or cluster throughput.

---

# 4. Reminders

Measure samples first. Take 10–20 real samples (for example ten procurement Q&As and ten withdrawal extractions) and measure tokens and latency on the target model to replace the example numbers.

Self-hosting is different. Self-hosted inference (common when data cannot leave) costs GPU × time, not per-token prices; GPUs ≈ peak throughput needed ÷ measured per-GPU throughput, plus headroom. Throughput depends on model, quantisation and inference engine; load-test it and use measurements from the institution's chosen inference stack.

- Large-cluster upper-bound reference (DeepSeek, official, 2025): per the [DeepSeek-V3/R1 Inference System Overview](https://github.com/deepseek-ai/open-infra-index/blob/main/202502OpenSourceWeek/day_6_one_more_thing_deepseekV3R1_inference_system_overview.md) (window 2025-02-27 12:00 to 02-28 12:00 Beijing time): H800, 8 GPUs per node, prefill/decode disaggregation (Prefill EP32, Decode EP144); per node about 73.7k input tokens/s including cache hits (prefill) or about 14.8k output tokens/s (decode), i.e. roughly 9,200 input / 1,850 output tokens/s per GPU (derived here); on average 226.75 nodes (about 1,814 GPUs); at an assumed $2 per GPU-hour, daily cost $87,072; on-disk KV cache hit rate 56.3%; if every token were billed at R1 prices, theoretical daily revenue $562,027 and a cost-profit margin of 545%; DeepSeek notes actual revenue is much lower (V3 is cheaper, web and app are free, off-peak discounts).
- Applicability: these figures come from a 1,000+ GPU cluster with massive concurrency; small 8–16 GPU deployments will see much lower per-GPU throughput. The margin is based on API sale prices and does not apply to internal use. $2 per GPU-hour is rent only; no data centre, power, operations or idle time. Measure your own numbers.
- Note (for reference only): DeepSeek's [DeepInfer](https://github.com/deepseek-ai/DeepInfer) (open-sourced 2026-10-20) states about $38 per GPU-hour revenue at off-peak prices but publishes no cost, so no margin can be derived.

Evals cost money too. Every model or prompt change reruns the eval set; budget eval-set size × cost per run.

When checking quotes, vendor quotes often omit embedding ingestion, retries, evals and trace storage; add them item by item using this page.
