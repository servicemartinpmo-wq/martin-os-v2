# Claude Brain Layer Prompt Package

## 1) MASTER SYSTEM PROMPT (paste into Claude as System)

```text
You are a senior AI systems architect and backend engineer.

Your single job is to convert raw product inputs into a fully specified AI operating system brain layer that sits between UI and backend.

Hard requirements:
- Be explicit and deterministic.
- Do not use vague language.
- Do not output summaries.
- Output executable system definitions, not advice.
- Think in execution steps only.
- Use language understandable by non-technical operators.
- Keep machine structures exact (JSON, formulas, pseudocode).

You MUST output EXACTLY these sections in this order:
SECTION 1 — INPUT CLASSIFICATION SYSTEM
SECTION 2 — CONTEXT RETRIEVAL SYSTEM (RAG)
SECTION 3 — DECISION ENGINE
SECTION 4 — FRAMEWORK EXECUTION MODEL
SECTION 5 — WORKFLOW ENGINE
SECTION 6 — MEMORY + LEARNING SYSTEM
SECTION 7 — FULL SYSTEM FLOW

Output format constraints:
1. Use deterministic JSON schemas (Draft 2020-12 style).
2. For every score, provide formula + variable definitions + threshold table.
3. For every pipeline, provide ordered steps with step IDs.
4. For every engine, provide pseudocode that is executable in sequence.
5. For every state machine, provide states, transitions, guards, retry policy, fallback policy.
6. For storage, provide concrete table schemas with field types and keys.
7. For APIs, provide concrete request/response schemas and status enums.
8. If an input field is missing, apply defaults from DEFAULT_POLICY and continue.
9. Never use these phrases: “you could”, “it depends”, “consider”, “typically”, “high-level”.
10. Do not ask clarifying questions. Use defaults when missing.

Determinism rules:
- Fixed execution order: Section1 -> Section2 -> Section3 -> Section4 -> Section5 -> Section6 -> Section7.
- Use explicit constants from CONSTANTS block.
- When two items tie on score, sort by lexical ascending ID.
- All probabilities/confidence values must be clamped to [0,1].
- All priority/risk scores must be clamped to [0,100].
- All ranking outputs must include score breakdown by term.

Non-technical language rules:
- Human-facing labels must avoid engineering jargon.
- Keep machine keys technical if needed, but include operator_label beside technical labels.
- Every section must include:
  - machine_view (strict structures)
  - operator_view (plain-language labels and instructions)

Failure behavior:
- If any section cannot be built from inputs, output a section-level ERROR object with:
  - error_code
  - missing_inputs
  - default_applied
  - next_action
- Continue generating remaining sections.

Return only the 7 required sections and their required structures. No preface. No appendix.
```

## 2) INPUT PACKET TEMPLATE (paste into Claude as User input)

```json
{
  "meta": {
    "project_id": "string",
    "brain_layer_version": "v1.0.0",
    "generated_at_iso": "2026-03-26T00:00:00Z",
    "timezone": "UTC",
    "operator_language": "en",
    "constants_profile": "default_v1"
  },
  "knowledge_bases": [
    {
      "kb_id": "kb_001",
      "title": "Policy Rules",
      "domain": "operations",
      "source_type": "document",
      "source_uri": "string",
      "trust_level": 0.9,
      "effective_from": "2026-01-01",
      "effective_to": null,
      "text_content": "string",
      "tags": ["policy", "compliance"]
    }
  ],
  "frameworks": [
    {
      "framework_id": "fw_001",
      "framework_name": "Issue Priority Matrix",
      "purpose": "Decide work order",
      "input_fields": [
        {
          "field_id": "impact",
          "field_type": "number",
          "range": [0, 10],
          "required": true
        }
      ],
      "logic_steps": [
        {
          "step_id": "S1",
          "operation": "normalize",
          "expression": "(impact/10)"
        }
      ],
      "output_fields": [
        {
          "field_id": "priority_score",
          "field_type": "number",
          "range": [0, 100]
        }
      ],
      "constraints": [
        "priority_score must be integer"
      ]
    }
  ],
  "features": [
    {
      "feature_id": "feat_001",
      "name": "Task Intake",
      "description": "Accept new requests from front end",
      "inputs": ["title", "description", "requested_by"],
      "outputs": ["request_id", "classification", "status"],
      "sla_minutes": 15,
      "risk_tolerance": "medium"
    }
  ],
  "workflows": [
    {
      "workflow_id": "wf_001",
      "name": "New Request Handling",
      "trigger": {
        "type": "event",
        "event_name": "request_created"
      },
      "steps": [
        {
          "step_id": "W1",
          "name": "Classify Input",
          "max_retries": 2,
          "timeout_seconds": 30
        }
      ],
      "success_state": "completed",
      "failure_state": "failed"
    }
  ],
  "integration": {
    "supabase": {
      "project_ref": "string",
      "region": "string",
      "pgvector_dimensions": 1536,
      "rls_mode": "enabled"
    },
    "frontend": {
      "surface": "cto.new",
      "edge_runtime": "cloudflare",
      "status_poll_interval_seconds": 3
    }
  },
  "DEFAULT_POLICY": {
    "missing_trust_level": 0.6,
    "missing_sla_minutes": 60,
    "missing_risk_tolerance": "medium",
    "missing_effective_to": "9999-12-31",
    "missing_tags": [],
    "missing_constraints": []
  },
  "CONSTANTS": {
    "classification_weights": {
      "semantic_match": 0.35,
      "rule_match": 0.30,
      "recency": 0.20,
      "trust_level": 0.15
    },
    "retrieval": {
      "top_k_dense": 25,
      "top_k_sparse": 25,
      "rerank_k": 20,
      "final_k": 8
    },
    "scores": {
      "priority_weight_impact": 0.5,
      "priority_weight_urgency": 0.3,
      "priority_weight_value": 0.2,
      "risk_weight_likelihood": 0.6,
      "risk_weight_severity": 0.4,
      "confidence_penalty_missing_fields": 0.08
    }
  }
}
```

## 3) SECTION-BY-SECTION OUTPUT CONTRACT (paste into Claude as required output shape)

```text
SECTION 1 — INPUT CLASSIFICATION SYSTEM
- machine_view must include:
  1) JSON Schema: InputEnvelopeSchema, ClassifiedInputSchema
  2) labels: full enum list
  3) scoring formulas:
     classification_score(label_i) =
       100 * (
         w_semantic * semantic_similarity_i +
         w_rule * rule_match_i +
         w_recency * recency_i +
         w_trust * trust_i
       )
  4) thresholds table:
     - if score >= 85 => primary_label=label_i, confidence_tier="high"
     - if 65 <= score < 85 => confidence_tier="medium"
     - else confidence_tier="low"
  5) tie-breaker: lexical on label_id
- operator_view must include:
  - plain-language names for each label
  - one-line “what this means” text per label

SECTION 2 — CONTEXT RETRIEVAL SYSTEM (RAG)
- machine_view must include:
  1) chunking policy:
     - chunk_size_tokens=450
     - chunk_overlap_tokens=90
     - heading_aware=true
  2) embedding generation contract:
     - model_name
     - vector_dim
     - normalization method
  3) retrieval pipeline with step IDs:
     R1 ingest -> R2 chunk -> R3 embed -> R4 dense_search -> R5 sparse_search
     -> R6 merge -> R7 metadata_filter -> R8 rerank -> R9 final_context_pack
  4) ranking formula:
     retrieval_score(doc_j) =
       0.50*dense_sim_j +
       0.20*sparse_sim_j +
       0.15*recency_j +
       0.10*trust_j +
       0.05*policy_boost_j
  5) data structures for ChunkRecord, RetrievalCandidate, ContextPack
- operator_view must include:
  - plain “how context is chosen” steps with no jargon

SECTION 3 — DECISION ENGINE
- machine_view must include:
  1) deterministic if/then rule table
  2) framework execution order list
  3) formulas:
     priority_score = 100*(a*impact + b*urgency + c*business_value)
     risk_score = 100*(d*likelihood + e*severity)
     confidence_score = clamp(
       evidence_coverage - missing_fields*n_penalty - conflict_penalty, 0, 1
     )
  4) execution pseudocode with fixed order and clamps
- operator_view must include:
  - plain labels: “Work urgency”, “Chance of problem”, “How sure the system is”

SECTION 4 — FRAMEWORK EXECUTION MODEL
- machine_view must include one executable object per framework:
  framework_name:
    inputs: [{id,type,required,default}]
    transform_steps: [{step_id,expression,validation}]
    output_schema: JSON Schema
    failure_conditions: [{condition,error_code,fallback}]
- operator_view must include:
  - simple step cards with inputs and expected output

SECTION 5 — WORKFLOW ENGINE
- machine_view must include:
  1) trigger definitions
  2) step sequence contract
  3) state machine:
     states=[queued,running,waiting_review,retrying,completed,failed,fallback]
     transitions with guards
  4) retry formula:
     retry_delay_seconds(attempt_n)=base_delay * (2^(attempt_n-1))
  5) fallback policy object
  6) JSON workflow templates
- operator_view must include:
  - status names and plain meaning

SECTION 6 — MEMORY + LEARNING SYSTEM
- machine_view must include:
  1) storage policy: what is persisted and retention windows
  2) schema: MemoryEvent, DecisionOutcome, FeedbackSignal, ModelAdjustment
  3) update formulas:
     new_weight = old_weight + lr * (observed_error * feature_value)
     trust_update = clamp(old_trust + alpha*positive - beta*negative, 0, 1)
  4) safety bounds and rollback conditions
- operator_view must include:
  - what the system remembers and when it updates behavior

SECTION 7 — FULL SYSTEM FLOW
- machine_view must include one complete trace:
  input_received -> classified -> context_packed -> decisions_scored
  -> framework_executed -> workflow_transitioned -> memory_written -> output_returned
- For each step include:
  - step_id
  - input_schema_ref
  - transformation_expression
  - output_schema_ref
  - persisted_records
  - failure_path
- operator_view must include:
  - plain-language timeline of the same flow
```

## 4) SUPABASE INTEGRATION CONTRACT (paste into Claude as implementation constraints)

```json
{
  "supabase_contract_version": "v1",
  "extensions_required": ["pgcrypto", "vector", "pg_trgm"],
  "tables": [
    {
      "name": "kb_documents",
      "primary_key": "document_id",
      "columns": [
        {"name": "document_id", "type": "uuid", "default": "gen_random_uuid()"},
        {"name": "project_id", "type": "text", "not_null": true},
        {"name": "title", "type": "text", "not_null": true},
        {"name": "domain", "type": "text", "not_null": true},
        {"name": "source_type", "type": "text", "not_null": true},
        {"name": "source_uri", "type": "text", "not_null": false},
        {"name": "trust_level", "type": "numeric(4,3)", "not_null": true},
        {"name": "effective_from", "type": "date", "not_null": true},
        {"name": "effective_to", "type": "date", "not_null": true, "default": "'9999-12-31'::date"},
        {"name": "tags", "type": "jsonb", "not_null": true, "default": "'[]'::jsonb"},
        {"name": "created_at", "type": "timestamptz", "default": "now()"}
      ],
      "indexes": [
        {"name": "kb_documents_project_idx", "expr": "(project_id)"},
        {"name": "kb_documents_domain_idx", "expr": "(domain)"}
      ]
    },
    {
      "name": "kb_chunks",
      "primary_key": "chunk_id",
      "columns": [
        {"name": "chunk_id", "type": "uuid", "default": "gen_random_uuid()"},
        {"name": "document_id", "type": "uuid", "not_null": true, "references": "kb_documents(document_id)"},
        {"name": "project_id", "type": "text", "not_null": true},
        {"name": "chunk_index", "type": "int", "not_null": true},
        {"name": "chunk_text", "type": "text", "not_null": true},
        {"name": "token_count", "type": "int", "not_null": true},
        {"name": "metadata", "type": "jsonb", "not_null": true, "default": "'{}'::jsonb"},
        {"name": "embedding", "type": "vector(1536)", "not_null": true},
        {"name": "created_at", "type": "timestamptz", "default": "now()"}
      ],
      "indexes": [
        {"name": "kb_chunks_project_idx", "expr": "(project_id)"},
        {"name": "kb_chunks_doc_chunk_uidx", "expr": "(document_id, chunk_index)", "unique": true},
        {"name": "kb_chunks_embedding_idx", "expr": "embedding vector_cosine_ops", "method": "ivfflat"}
      ]
    },
    {
      "name": "brain_decisions",
      "primary_key": "decision_id",
      "columns": [
        {"name": "decision_id", "type": "uuid", "default": "gen_random_uuid()"},
        {"name": "request_id", "type": "text", "not_null": true},
        {"name": "project_id", "type": "text", "not_null": true},
        {"name": "classification_label", "type": "text", "not_null": true},
        {"name": "priority_score", "type": "numeric(5,2)", "not_null": true},
        {"name": "risk_score", "type": "numeric(5,2)", "not_null": true},
        {"name": "confidence_score", "type": "numeric(5,4)", "not_null": true},
        {"name": "decision_payload", "type": "jsonb", "not_null": true},
        {"name": "created_at", "type": "timestamptz", "default": "now()"}
      ],
      "indexes": [
        {"name": "brain_decisions_request_idx", "expr": "(request_id)"},
        {"name": "brain_decisions_project_created_idx", "expr": "(project_id, created_at desc)"}
      ]
    },
    {
      "name": "workflow_runs",
      "primary_key": "run_id",
      "columns": [
        {"name": "run_id", "type": "uuid", "default": "gen_random_uuid()"},
        {"name": "request_id", "type": "text", "not_null": true},
        {"name": "workflow_id", "type": "text", "not_null": true},
        {"name": "state", "type": "text", "not_null": true},
        {"name": "attempt_count", "type": "int", "not_null": true, "default": 0},
        {"name": "last_error_code", "type": "text", "not_null": false},
        {"name": "timeline", "type": "jsonb", "not_null": true, "default": "'[]'::jsonb"},
        {"name": "updated_at", "type": "timestamptz", "default": "now()"}
      ],
      "indexes": [
        {"name": "workflow_runs_request_idx", "expr": "(request_id)"},
        {"name": "workflow_runs_state_idx", "expr": "(state)"}
      ]
    },
    {
      "name": "memory_events",
      "primary_key": "memory_event_id",
      "columns": [
        {"name": "memory_event_id", "type": "uuid", "default": "gen_random_uuid()"},
        {"name": "request_id", "type": "text", "not_null": true},
        {"name": "event_type", "type": "text", "not_null": true},
        {"name": "event_payload", "type": "jsonb", "not_null": true},
        {"name": "quality_signal", "type": "numeric(5,4)", "not_null": false},
        {"name": "created_at", "type": "timestamptz", "default": "now()"}
      ],
      "indexes": [
        {"name": "memory_events_request_idx", "expr": "(request_id)"},
        {"name": "memory_events_type_idx", "expr": "(event_type)"}
      ]
    }
  ],
  "rpc_contracts": [
    {
      "name": "match_kb_chunks",
      "inputs": {
        "in_project_id": "text",
        "in_query_embedding": "vector(1536)",
        "in_top_k": "int",
        "in_domain_filter": "text[]"
      },
      "returns": {
        "chunk_id": "uuid",
        "document_id": "uuid",
        "chunk_text": "text",
        "cosine_similarity": "numeric",
        "trust_level": "numeric",
        "metadata": "jsonb"
      }
    }
  ],
  "rls_baseline": {
    "enabled": true,
    "policy_shape": "project_id = auth.jwt()->>'project_id'"
  }
}
```

## 5) FRONTEND + CLOUDFLARE HANDOFF CONTRACT (paste into Claude as interface constraints)

```json
{
  "api_version": "v1",
  "endpoints": [
    {
      "method": "POST",
      "path": "/brain/execute",
      "request_schema": {
        "type": "object",
        "required": ["request_id", "project_id", "input_payload"],
        "properties": {
          "request_id": {"type": "string"},
          "project_id": {"type": "string"},
          "input_payload": {"type": "object"},
          "operator_context": {"type": "object"},
          "workflow_id": {"type": "string"}
        }
      },
      "response_schema": {
        "type": "object",
        "required": ["request_id", "run_id", "state", "eta_seconds"],
        "properties": {
          "request_id": {"type": "string"},
          "run_id": {"type": "string"},
          "state": {
            "type": "string",
            "enum": ["queued", "running", "waiting_review", "retrying", "completed", "failed", "fallback"]
          },
          "eta_seconds": {"type": "integer", "minimum": 0}
        }
      }
    },
    {
      "method": "GET",
      "path": "/brain/status/{run_id}",
      "request_schema": {
        "type": "object",
        "required": ["run_id", "project_id"],
        "properties": {
          "run_id": {"type": "string"},
          "project_id": {"type": "string"}
        }
      },
      "response_schema": {
        "type": "object",
        "required": ["run_id", "state", "attempt_count", "updated_at"],
        "properties": {
          "run_id": {"type": "string"},
          "state": {"type": "string"},
          "attempt_count": {"type": "integer"},
          "updated_at": {"type": "string", "format": "date-time"},
          "operator_status_label": {"type": "string"}
        }
      }
    },
    {
      "method": "GET",
      "path": "/brain/result/{run_id}",
      "request_schema": {
        "type": "object",
        "required": ["run_id", "project_id"],
        "properties": {
          "run_id": {"type": "string"},
          "project_id": {"type": "string"}
        }
      },
      "response_schema": {
        "type": "object",
        "required": ["run_id", "machine_view", "operator_view"],
        "properties": {
          "run_id": {"type": "string"},
          "machine_view": {"type": "object"},
          "operator_view": {"type": "object"},
          "trace_id": {"type": "string"}
        }
      }
    }
  ],
  "cloudflare_worker_rules": {
    "idempotency_key_header": "x-idempotency-key",
    "request_timeout_seconds": 30,
    "max_payload_kb": 256,
    "retry_on_status": [408, 429, 500, 502, 503, 504],
    "circuit_breaker": {
      "failure_threshold": 5,
      "reset_window_seconds": 60
    }
  },
  "operator_language_rules": {
    "status_labels": {
      "queued": "Waiting to start",
      "running": "In progress",
      "waiting_review": "Needs human check",
      "retrying": "Trying again",
      "completed": "Done",
      "failed": "Stopped with issue",
      "fallback": "Used backup path"
    },
    "error_message_style": "one sentence, plain words, action-first"
  }
}
```

## 6) CLAUDE OUTPUT VALIDATOR CHECKLIST (run this against Claude output)

```text
[STRUCTURE]
1. Exactly 7 sections exist, with exact titles and exact order.
2. Each section includes both machine_view and operator_view.
3. No extra intro, outro, summary, or appendix.

[DETERMINISM]
4. Every score has formula + variables + clamp/range.
5. Every threshold decision has explicit numeric bounds.
6. Every sequence has ordered step IDs.
7. Every tie-break has deterministic rule.

[SCHEMAS]
8. JSON schemas are syntactically valid and include required fields.
9. Enums are explicit (no open-ended text where states are needed).
10. Missing-field defaults are specified and applied.

[RAG]
11. Chunk policy includes size + overlap + metadata behavior.
12. Retrieval includes dense + sparse + rerank + final_k.
13. Ranking formula includes weighted terms totaling 1.0.

[DECISIONS]
14. Priority, risk, confidence formulas are present and bounded.
15. Rule table has explicit conditions and outputs.
16. Framework execution order is fixed and listed.

[WORKFLOW]
17. State machine includes states, transitions, guards.
18. Retry formula is explicit and parameterized.
19. Fallback behavior is explicit and trigger-based.

[MEMORY]
20. Stored entities and schemas are explicit.
21. Learning/update formulas are explicit with bounds.
22. Rollback or safety constraints are explicit.

[END-TO-END]
23. One complete trace from input to output is present.
24. Each trace step includes transform + intermediate state + persistence behavior.

[LANGUAGE]
25. Human-facing text avoids jargon.
26. No banned phrases appear.
27. Operator instructions are action-based and short.
```

## 7) FINAL PASTE-READY MESSAGE FOR CLAUDE (single send)

```text
SYSTEM:
[PASTE THE FULL MASTER SYSTEM PROMPT FROM SECTION 1 HERE]

USER:
Use the exact generation contract below.

Required output sections and rules:
[PASTE SECTION 3 OUTPUT CONTRACT HERE]

Supabase constraints:
[PASTE SECTION 4 SUPABASE INTEGRATION CONTRACT HERE]

Frontend + Cloudflare constraints:
[PASTE SECTION 5 FRONTEND + CLOUDFLARE HANDOFF CONTRACT HERE]

Validation checklist you must satisfy before you answer:
[PASTE SECTION 6 VALIDATOR CHECKLIST HERE]

Input packet:
[PASTE YOUR FILLED INPUT PACKET FROM SECTION 2 HERE]

Terminal instruction:
Wait for my input.
```

