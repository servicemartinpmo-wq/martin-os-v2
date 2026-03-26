# Brain Layer Implementation Guide

## Overview

This guide documents the complete Brain Layer implementation for the multi-domain operations platform, including all SQL schemas, edge functions, and operational procedures.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Domain Schemas](#domain-schemas)
3. [Brain Engines](#brain-engines)
4. [Edge Functions](#edge-functions)
5. [Migration Strategy](#migration-strategy)
6. [API Contracts](#api-contracts)
7. [Testing & Validation](#testing--validation)
8. [Rollback Strategy](#rollback-strategy)
9. [Hardening Recommendations](#hardening-recommendations)

---

## Architecture Overview

### Multi-Domain Structure

The Brain Layer operates across three domain schemas:

- **pmo_ops**: Project/Program Management operations
- **tech_ops**: Technical Operations (incidents, alerts, maintenance)
- **miiddle**: Market Intelligence/Data operations

### Shared Core

All domains share core infrastructure:
- `public.profiles`: User profiles (1:1 with auth.users)
- `public.organizations`: Organization/tenant boundaries
- `public.organization_members`: Role-based access (owner/admin/member)
- `public.brain_*`: Shared brain layer foundation tables

### Brain Engines (5 per Domain)

Each domain implements 5 brain engines:

1. **Classification Engine**: Input classification with scoring
2. **Retrieval Engine (RAG)**: Knowledge retrieval with vector search
3. **Decision Engine**: Rule-based decisions with confidence scoring
4. **Execution Engine**: Workflow orchestration with state machine
5. **Memory + Learning System**: Event logging and outcome tracking

---

## Domain Schemas

### Schema Structure

Each domain (`pmo_ops`, `tech_ops`, `miiddle`) contains:

```
domain/
├── classification_rules
├── classification_runs
├── knowledge_documents
├── knowledge_chunks
├── decision_rules
├── decision_runs
├── workflows
├── workflow_runs
├── tools
├── memory_events
├── memory_outcomes
└── feedback
```

### Table Naming Convention

- `{domain}_classification_rules`: Classification label definitions
- `{domain}_classification_runs`: Classification execution logs
- `{domain}_knowledge_documents`: Knowledge base documents
- `{domain}_knowledge_chunks`: Vector-embedded text chunks
- `{domain}_decision_rules`: Deterministic decision rules
- `{domain}_decision_runs`: Decision execution logs
- `{domain}_workflows`: Workflow definitions
- `{domain}_workflow_runs`: Workflow execution state
- `{domain}_tools`: Tool/automation registry
- `{domain}_memory_events`: Event logs for learning
- `{domain}_memory_outcomes`: Outcome tracking
- `{domain}_feedback`: User feedback collection

---

## Brain Engines

### 1. Classification Engine

**Purpose**: Classify input into deterministic routing labels

**Tables**:
- `classification_rules`: Label definitions with weights and patterns
- `classification_runs`: Execution logs with scores

**Classification Types**:
- **pmo_ops**: ticket, action, question, initiative, risk, signal
- **tech_ops**: ticket, incident, alert, maintenance
- **miiddle**: ticket, automation, report, idea

**Scoring Formula**:
```
classification_score = 100 * (
  w_semantic * semantic_similarity +
  w_rule * rule_match +
  w_recency * recency +
  w_trust * trust_level
)
```

**Thresholds**:
- `score >= 85`: confidence_tier = "high"
- `65 <= score < 85`: confidence_tier = "medium"
- `score < 65`: confidence_tier = "low"

**Tie-breaker**: Lexical ascending order on label_id

---

### 2. Retrieval Engine (RAG)

**Purpose**: Retrieve relevant context from knowledge base

**Tables**:
- `knowledge_documents`: Document metadata
- `knowledge_chunks`: Vector-embedded text chunks

**Chunking Policy**:
- `chunk_size_tokens`: 450
- `chunk_overlap_tokens`: 90
- `heading_aware`: true

**Retrieval Pipeline**:
```
R1 ingest -> R2 chunk -> R3 embed -> R4 dense_search
-> R5 sparse_search -> R6 merge -> R7 metadata_filter
-> R8 rerank -> R9 final_context_pack
```

**Ranking Formula**:
```
retrieval_score = 0.50 * dense_sim +
                 0.20 * sparse_sim +
                 0.15 * recency +
                 0.10 * trust +
                 0.05 * policy_boost
```

**Vector Configuration**:
- `vector_dim`: 1536 (OpenAI ada-002 compatible)
- `index_method`: ivfflat with 100 lists
- `similarity_metric`: cosine

---

### 3. Decision Engine

**Purpose**: Make deterministic decisions with confidence scoring

**Tables**:
- `decision_rules`: Rule definitions with conditions and actions
- `decision_runs`: Decision execution logs

**Decision Formulas**:

```
priority_score = 100 * (a * impact + b * urgency + c * business_value)
```

```
risk_score = 100 * (d * likelihood + e * severity)
```

```
confidence_score = clamp(
  evidence_coverage - missing_fields * n_penalty - conflict_penalty,
  0, 1
)
```

**Constants** (from default_v1):
- `priority_weight_impact`: 0.5
- `priority_weight_urgency`: 0.3
- `priority_weight_value`: 0.2
- `risk_weight_likelihood`: 0.6
- `risk_weight_severity`: 0.4
- `confidence_penalty_missing_fields`: 0.08

---

### 4. Execution Engine (Workflow)

**Purpose**: Orchestrate workflow execution with retry/fallback

**Tables**:
- `workflows`: Workflow definitions
- `workflow_runs`: Execution state machine
- `tools`: Tool/automation registry

**State Machine**:
```
queued -> running -> waiting_review
         -> retrying -> completed
         -> failed -> fallback
```

**Retry Formula**:
```
retry_delay_seconds(attempt_n) = base_delay * (2^(attempt_n-1))
```
- `base_delay`: 1000ms (1 second)

**Fallback Policy**:
- Triggered when `attempt_count > max_retries`
- State transitions to `fallback`
- Logs error code: `MAX_RETRIES_EXCEEDED`

**Workflow Templates** (seeded):
- **pmo_ops**: `pmo_new_request`, `pmo_initiative_creation`
- **tech_ops**: `tech_incident_response`, `tech_alert_handling`
- **miidle**: `miidle_task_processing`, `miidle_report_generation`

---

### 5. Memory + Learning System

**Purpose**: Store events and outcomes for learning

**Tables**:
- `memory_events`: Event logs
- `memory_outcomes`: Outcome tracking
- `feedback`: User feedback

**Update Formulas**:

```
new_weight = old_weight + lr * (observed_error * feature_value)
```

```
trust_update = clamp(old_trust + alpha * positive - beta * negative, 0, 1)
```

**Learning Rate**:
- `lr`: 0.01 (default)
- `alpha`: 0.1 (positive feedback weight)
- `beta`: 0.05 (negative feedback weight)

**Storage Policy**:
- `memory_events`: Retain 365 days
- `memory_outcomes`: Retain 730 days
- `feedback`: Retain indefinitely

---

## Edge Functions

### Available Functions

1. **orchestrate** (existing): Main orchestration function
2. **orchestrate-domain** (new): Domain-aware orchestration
3. **classifier** (existing): Input classification
4. **retrieve-context** (new): RAG context retrieval
5. **decide** (existing): Decision making
6. **execute** (existing): Action execution
7. **execute-workflow** (new): Workflow orchestration
8. **store_result** (existing): Result storage
9. **brain_status** (existing): Status checking
10. **brain_result** (existing): Result retrieval

---

### orchestrate-domain

**Purpose**: Route requests to appropriate domain brain layer

**Request**:
```json
{
  "domain": "pmo_ops" | "tech_ops" | "miidle",
  "request_id": "string",
  "profile_id": "string",
  "organization_id": "string" | null,
  "input": "string",
  "actions": array,
  "workflow_id": "string" | null
}
```

**Response**:
```json
{
  "request_id": "string",
  "run_id": "string",
  "state": "queued" | "running" | "waiting_review" | "retrying" | "completed" | "failed" | "fallback",
  "domain": "string",
  "eta_seconds": number,
  "machine_view": object,
  "operator_view": object
}
```

---

### execute-workflow

**Purpose**: Execute workflow steps with retry/fallback logic

**Request**:
```json
{
  "domain": "pmo_ops" | "tech_ops" | "miidle",
  "run_id": "string",
  "request_id": "string",
  "profile_id": "string",
  "decision": object,
  "actions": array,
  "workflow_id": "string" | null
}
```

**Response**:
```json
{
  "run_id": "string",
  "workflow_run_id": "string",
  "state": "queued" | "running" | "waiting_review" | "retrying" | "completed" | "failed" | "fallback",
  "attempt_count": number,
  "outcome": {
    "action_results": array,
    "summary": "string"
  }
}
```

---

### retrieve-context

**Purpose**: Retrieve relevant context from domain knowledge base

**Request**:
```json
{
  "domain": "pmo_ops" | "tech_ops" | "miiddle",
  "run_id": "string",
  "request_id": "string",
  "profile_id": "string",
  "input": "string",
  "top_k": number
}
```

**Response**:
```json
{
  "run_id": "string",
  "context_pack": {
    "documents": array,
    "frameworks": array,
    "past_cases": array,
    "summary": "string"
  },
  "retrieval_metadata": {
    "top_k": number,
    "chunks_retrieved": number,
    "avg_similarity": number,
    "query_time_ms": number
  }
}
```

---

## Migration Strategy

### Migration Order

1. **Migration 20260326000001** (existing): Brain layer foundation
   - Tables in `public` schema
   - Basic indexes
   - RLS policies

2. **Migration 20260327000001** (new): Complete domain schemas
   - Domain schemas (`pmo_ops`, `tech_ops`, `miiddle`)
   - Domain-specific brain engine tables
   - Additional indexes
   - Domain RLS policies
   - Seed data

### Prerequisites

- Supabase project with PostgreSQL 15+
- `pgvector` extension enabled
- `pg_trgm` extension enabled
- `pgcrypto` extension enabled
- Existing `public.profiles` and `public.organizations` tables

### Execution

```bash
# Apply migration
supabase db push

# Or manually
supabase db reset
```

### Verification

Run validation queries at end of migration:
```sql
-- Check schemas
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('pmo_ops', 'tech_ops', 'miidle');

-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname IN ('pmo_ops', 'tech_ops', 'miiddle')
AND tablename = 'knowledge_documents';

-- Check indexes
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname IN ('pmo_ops', 'tech_ops', 'miiddle')
ORDER BY schemaname, tablename;
```

---

## API Contracts

### Cloudflare Workers

**Base URL**: `/brain/v1`

**Headers**:
- `Authorization`: `Bearer <JWT_TOKEN>`
- `Content-Type`: `application/json`
- `x-idempotency-key`: `<REQUEST_ID>`

**Idempotency**:
- `x-idempotency-key` must equal `request_id`
- Subsequent requests with same idempotency key return cached result

**Circuit Breaker**:
- Failure threshold: 5
- Reset window: 60 seconds

**Retry on Status**:
- 408 (Request Timeout)
- 429 (Too Many Requests)
- 500, 502, 503, 504 (Server Errors)

---

### POST /brain/execute

**Request**:
```json
{
  "request_id": "string",
  "domain": "pmo_ops" | "tech_ops" | "miidle",
  "profile_id": "string",
  "organization_id": "string" | null,
  "input": "string",
  "actions": array,
  "workflow_id": "string" | null
}
```

**Response**:
```json
{
  "request_id": "string",
  "run_id": "string",
  "state": "queued" | "running" | "waiting_review" | "retrying" | "completed" | "failed" | "fallback",
  "eta_seconds": number
}
```

---

### GET /brain/status/{run_id}

**Request**:
```json
{
  "run_id": "string",
  "profile_id": "string"
}
```

**Response**:
```json
{
  "run_id": "string",
  "state": "queued" | "running" | "waiting_review" | "retrying" | "completed" | "failed" | "fallback",
  "attempt_count": number,
  "updated_at": "ISO8601 timestamp",
  "operator_status_label": "Waiting to start" | "In progress" | "Needs human check" | "Trying again" | "Done" | "Stopped with issue" | "Used backup path"
}
```

---

### GET /brain/result/{run_id}

**Request**:
```json
{
  "run_id": "string",
  "profile_id": "string"
}
```

**Response**:
```json
{
  "run_id": "string",
  "machine_view": {
    "classification": object,
    "context_pack": object,
    "decision": object,
    "outcome": object
  },
  "operator_view": {
    "status": "string",
    "message": "string"
  },
  "trace_id": "string"
}
```

---

## Testing & Validation

### RLS Test Matrix

Test cross-org data denial:

```sql
-- Setup: Create two organizations with different profiles
-- Org A: profile_a in org_a
-- Org B: profile_b in org_b

-- Test: Profile A cannot access Org B data
SET LOCAL request.jwt.claim.sub = '<profile_a_uuid>';

-- This should return 0 rows
SELECT COUNT(*) FROM pmo_ops.knowledge_documents
WHERE profile_id = '<profile_b_uuid>';

-- This should return data
SELECT COUNT(*) FROM pmo_ops.knowledge_documents
WHERE profile_id = '<profile_a_uuid>';
```

---

### Owner/Admin/Member Roles Test

```sql
-- Owner: Full access
SET LOCAL request.jwt.claim.sub = '<owner_profile_uuid>';
SELECT * FROM pmo_ops.workflows; -- Should work

-- Admin: Can read and scoped write
SET LOCAL request.jwt.claim.sub = '<admin_profile_uuid>';
SELECT * FROM pmo_ops.workflows; -- Should work

-- Member: Read access only to own data
SET LOCAL request.jwt.claim.sub = '<member_profile_uuid>';
SELECT * FROM pmo_ops.workflows WHERE profile_id = '<member_profile_uuid>'; -- Should work
```

---

### Vector Search Test

```sql
-- Test semantic search
SELECT
  chunk_id,
  document_id,
  chunk_text,
  cosine_similarity
FROM pmo_ops.match_kb_chunks(
  '<profile_uuid>',
  '[0.1, 0.2, 0.3, ...]', -- 1536-dim vector
  5
)
LIMIT 5;
```

---

### State Machine Test

```sql
-- Test workflow state transitions
INSERT INTO pmo_ops.workflow_runs (
  run_id,
  request_id,
  profile_id,
  workflow_key,
  state
) VALUES (
  '<run_uuid>',
  '<request_id>',
  '<profile_uuid>',
  'pmo_new_request',
  'queued'
);

-- Transition to running
UPDATE pmo_ops.workflow_runs
SET state = 'running'
WHERE run_id = '<run_uuid>';

-- Check transition
SELECT state FROM pmo_ops.workflow_runs WHERE run_id = '<run_uuid>';
```

---

## Rollback Strategy

### Migration Rollback

If issues occur, rollback in reverse order:

```bash
# Rollback domain schemas migration
supabase migration down 20260327000001

# Or manually drop schemas
DROP SCHEMA IF EXISTS pmo_ops CASCADE;
DROP SCHEMA IF EXISTS tech_ops CASCADE;
DROP SCHEMA IF EXISTS miidle CASCADE;
```

### Data Preservation

Before applying migration:

```sql
-- Backup existing brain layer data
CREATE TABLE brain_runs_backup AS SELECT * FROM public.brain_runs;
CREATE TABLE brain_decisions_backup AS SELECT * FROM public.brain_decision_runs;
CREATE TABLE brain_workflow_runs_backup AS SELECT * FROM public.brain_workflow_runs;
```

### Partial Rollback

If only one domain has issues:

```sql
-- Drop specific domain schema
DROP SCHEMA IF EXISTS tech_ops CASCADE;
```

---

## Hardening Recommendations

### 1. Policy Idempotency

All policy creation uses `_create_policy_if_not_exists()` helper:

```sql
CREATE OR REPLACE FUNCTION public._create_policy_if_not_exists(
  p_table text, p_name text, p_cmd text, p_expr text
)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = p_table AND policyname = p_name
  ) THEN
    -- Create policy
  END IF;
END;
$$;
```

---

### 2. Audit Tables

Create audit trail for critical operations:

```sql
CREATE TABLE IF NOT EXISTS pmo_ops.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_profile ON pmo_ops.audit_log(profile_id, created_at DESC);
CREATE INDEX idx_audit_log_table ON pmo_ops.audit_log(table_name, record_id);
```

---

### 3. Soft-Delete Strategy

Add `deleted_at` column to all major tables:

```sql
-- Example for knowledge_documents
ALTER TABLE pmo_ops.knowledge_documents
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Update queries to filter soft-deleted records
-- Add `WHERE deleted_at IS NULL` to all SELECT queries

-- Update RLS policies
CREATE POLICY "pmo_kb_docs_own_soft_delete" ON pmo_ops.knowledge_documents
FOR SELECT USING (profile_id = auth.uid() AND deleted_at IS NULL);
```

---

### 4. State Transition Constraints

Add CHECK constraints for valid state transitions:

```sql
-- Example for workflow_runs
ALTER TABLE pmo_ops.workflow_runs
ADD CONSTRAINT check_state_transition
CHECK (
  -- Initial state
  state = 'queued' OR
  -- Allowed transitions
  (old_state = 'queued' AND state IN ('running', 'failed')) OR
  (old_state = 'running' AND state IN ('waiting_review', 'retrying', 'completed', 'failed', 'fallback')) OR
  (old_state = 'waiting_review' AND state IN ('running', 'completed', 'failed')) OR
  (old_state = 'retrying' AND state IN ('running', 'failed', 'fallback')) OR
  (old_state = 'failed' AND state = 'fallback')
);
```

Note: This requires a trigger to track old_state.

---

### 5. Performance Indexes

Ensure all foreign keys and frequently queried columns are indexed:

```sql
-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS pmo_ops_kb_chunks_doc_profile
ON pmo_ops.knowledge_chunks(document_id, profile_id);

CREATE INDEX IF NOT EXISTS tech_ops_dec_runs_profile_state
ON tech_ops.decision_runs(profile_id, state, created_at DESC);

CREATE INDEX IF NOT EXISTS miiddle_wf_runs_profile_created
ON miiddle.workflow_runs(profile_id, created_at DESC);

-- Add partial indexes for filtered queries
CREATE INDEX IF NOT EXISTS pmo_ops_kb_active_docs
ON pmo_ops.knowledge_documents(profile_id, created_at DESC)
WHERE deleted_at IS NULL;
```

---

### 6. EXPLAIN Plan Checks

Monitor query performance:

```sql
-- Check vector search plan
EXPLAIN ANALYZE
SELECT * FROM pmo_ops.knowledge_chunks
WHERE embedding <=> '[...]' ORDER BY embedding <=> '[...]' LIMIT 8;

-- Check classification run query plan
EXPLAIN ANALYZE
SELECT * FROM pmo_ops.classification_runs
WHERE profile_id = '<uuid>' AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC LIMIT 100;
```

---

### 7. Connection Pooling

Configure connection pool for edge functions:

```toml
# In supabase/config.toml
[api]
max_request_duration = "30s"
port = 54321

[db]
port = 54322
shadow_port = 54320
major_version = "15"
pooler_enabled = true
pooler_port = 6543
pooler_default_pool_size = 15
pooler_max_client_conn = 100
```

---

### 8. Rate Limiting

Implement rate limiting for API endpoints:

```sql
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_end TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 minute',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_profile_endpoint
ON public.rate_limits(profile_id, endpoint, window_start);
```

---

## Troubleshooting

### Common Issues

**Issue**: RLS policies blocking queries
- **Solution**: Check `auth.uid()` is set in JWT claims
- **Debug**: Run `SELECT current_setting('request.jwt.claim.sub', true);`

**Issue**: Vector search slow
- **Solution**: Ensure ivfflat index exists with proper `lists` parameter
- **Debug**: Run `EXPLAIN ANALYZE` on query

**Issue**: Workflow stuck in `retrying` state
- **Solution**: Check `attempt_count` vs `max_retries`
- **Debug**: Query workflow_runs timeline for error messages

**Issue**: Classification always returns "low" confidence
- **Solution**: Check classification_rules have weights > 0
- **Debug**: Review score_breakdown in classification_runs

---

## Next Steps

1. **Apply Migration**: Run `supabase db push`
2. **Seed Knowledge Base**: Add initial documents to each domain
3. **Configure Embeddings**: Set up embedding API integration
4. **Test Edge Functions**: Deploy and test orchestration flow
5. **Monitor Performance**: Set up observability and alerting
6. **Iterate**: Refine classification rules and decision thresholds based on feedback

---

## Support

For questions or issues:
- Review this implementation guide
- Check Supabase logs
- Consult the brain layer prompt package documentation
- Review edge function code in `/supabase/functions/`
