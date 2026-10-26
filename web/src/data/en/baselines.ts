/** Handbook §4.1 general baselines + per-form baselines (from §3 required components / preconditions). */
export const generalBaselinesEn = [
  'Cost breakers: per-request, per-session and per-day caps; trip on breach',
  'Full tracing: inputs, outputs, tool calls, latency, cost per OTel GenAI conventions (Lecture 8)',
  'Outputs are untrusted: never raw into SQL, pages or shell',
  'Injection posture: least privilege + action confirmation, not a prompt line',
  'Version & rollback: prompts, model versions and tool schemas all versioned and revertible',
]

export const formBaselinesEn: Record<string, string[]> = {
  A: ['Answers cite the specific clause of the specific file', 'Filter by user classification at retrieval, not display'],
  B: [
    'Semantic layer / metric definitions in place, or do definition work first',
    'SQL sandbox: timeout, scan-size and permission limits',
    'Output labelled "internal reference, not confirmed by finance/statistics" and firewalled from external publication',
  ],
  C: ['Human confirms at the end in an editable UI', 'Model deployment, data egress and vendor retention decided on the first project'],
  D: [
    'LLM in only one or two nodes; hard-code the rest',
    'Idempotency keys + retry with backoff + failure alerts',
    'Audit log can replay the decision basis for the audit committee',
  ],
  E: [
    'Four preconditions: ≤15 tools, single domain, failures tolerable or reversible, clear done-criteria',
    'A set of stop conditions: done-criteria, max iterations, timeout, cost cap, confidence threshold',
    "Agent accesses systems as the initiator, not a service account",
    'State persistence and resume, human-in-the-loop points, eval set',
  ],
  F: [
    'All form E baselines first',
    'Subtasks truly independent and parallel, or need entirely different expert context',
    'Authenticate and validate inter-agent messages (OWASP ASI07)',
  ],
}
