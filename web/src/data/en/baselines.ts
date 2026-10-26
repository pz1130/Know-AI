/** Handbook §4.1 general baselines + per-form baselines (from §3 required components / preconditions). */
export const generalBaselinesEn = [
  'Cost breakers at three levels — per request, per session, per day — and trip them on breach',
  'Full tracing: record inputs, outputs, tool calls, latency and cost per OTel GenAI conventions (Lecture 8)',
  'Treat model output as untrusted: never splice it raw into SQL, pages or a shell',
  'Injection posture is least privilege plus action confirmation, not a prompt line that says “ignore malicious instructions”',
  'Prompts, model versions and tool schemas are all versioned and can be rolled back',
]

export const formBaselinesEn: Record<string, string[]> = {
  A: ['Answers cite the specific clause of the specific file', 'Filter by user classification at retrieval, not by masking at display'],
  B: [
    'Semantic layer / metric definitions are already in place; otherwise do definition work first',
    'SQL runs in a sandbox with timeout, scan-size and permission limits',
    'Output is labelled "internal reference, not confirmed by finance/statistics" and firewalled from external publication',
  ],
  C: ['A human confirms at the end in an editable UI', 'Model deployment, data egress and vendor retention are decided on the first project'],
  D: [
    'The LLM appears in only one or two nodes; hard-code the rest',
    'Idempotency keys, retry with backoff and failure alerts are in place',
    'The audit log can replay the decision basis for the audit committee',
  ],
  E: [
    'All four preconditions hold: at most fifteen tools, a single domain, failures tolerable or reversible, clear done-criteria',
    'Stop conditions are configured as a set: done-criteria, max iterations, timeout, cost cap, confidence threshold',
    'The agent accesses systems as the initiator, not a shared service account',
    'State can persist and resume from a breakpoint, with human-in-the-loop points and an eval set ready',
  ],
  F: [
    'Satisfy every Form E baseline first',
    'Subtasks are truly independent and parallel, or need entirely different expert context',
    'Authenticate and validate inter-agent messages (OWASP ASI07)',
  ],
}
