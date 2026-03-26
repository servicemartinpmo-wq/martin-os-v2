# Brain Layer Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Apply Migration

```bash
cd mpo-pilot-main
supabase db push
```

This will create:
- 3 domain schemas (`pmo_ops`, `tech_ops`, `miidle`)
- 45+ domain-specific tables
- All RLS policies
- Vector indexes
- Seed data

---

### Step 2: Verify Installation

```sql
-- Run validation queries (included in migration)
-- These should all return true:
SELECT EXISTS (
  SELECT 1 FROM information_schema.schemata
  WHERE schema_name = 'pmo_ops'
);
-- Result: true

SELECT EXISTS (
  SELECT 1 FROM pg_tables
  WHERE schemaname = 'pmo_ops' AND tablename = 'knowledge_documents' AND rowsecurity = true
);
-- Result: true

SELECT COUNT(*) FROM pmo_ops.classification_rules;
-- Result: 5 (seeded labels)
```

---

### Step 3: Test Vector Search

```sql
-- Test semantic search (use pseudo-embedding for now)
-- In production, generate real embeddings via API
SELECT
  chunk_id,
  document_id,
  LEFT(chunk_text, 100) as snippet,
  cosine_similarity
FROM pmo_ops.match_kb_chunks(
  '<your_profile_uuid>',
  '[0.1, 0.2, 0.3, ...]', -- 1536-dim vector
  5
);
```

---

## 📝 Basic Usage Examples

### 1. Classify Input

```typescript
// Call orchestrate-domain edge function
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/orchestrate-domain`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT}`,
      'x-idempotency-key': requestId
    },
    body: JSON.stringify({
      domain: 'pmo_ops',
      request_id: requestId,
      profile_id: profileId,
      input: "Create a new initiative for Q2 planning"
    })
  }
);

const result = await response.json();
console.log(result.classification);
// Output: { type: 'initiative', priority: 'high', confidence: 0.87 }
```

---

### 2. Retrieve Context

```typescript
// Call retrieve-context edge function
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/retrieve-context`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT}`
    },
    body: JSON.stringify({
      domain: 'pmo_ops',
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      input: "Create a new initiative for Q2 planning",
      top_k: 8
    })
  }
);

const result = await response.json();
console.log(result.context_pack);
// Output: {
//   documents: [...],
//   frameworks: [...],
//   past_cases: [...],
//   summary: "Retrieved 12 relevant chunks..."
// }
```

---

### 3. Execute Workflow

```typescript
// Call execute-workflow edge function
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/execute-workflow`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JWT}`
    },
    body: JSON.stringify({
      domain: 'pmo_ops',
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      decision: {
        priority_score: 85,
        risk_score: 30,
        suggested_actions: [
          {
            type: 'update_db',
            table: 'initiatives',
            record_id: initiativeId,
            updates: { status: 'active', priority: 'high' }
          },
          {
            type: 'send_notification',
            target: 'team',
            message: 'New initiative created'
          }
        ]
      },
      actions: []
    })
  }
);

const result = await response.json();
console.log(result.outcome);
// Output: {
//   action_results: [
//     { type: 'update_db', status: 'success', ... },
//     { type: 'send_notification', status: 'success', ... }
//   ],
//   summary: 'All actions completed successfully'
// }
```

---

## 🏗️ Add Knowledge Documents

### Step 1: Create Document

```sql
INSERT INTO pmo_ops.knowledge_documents (
  profile_id,
  title,
  domain,
  source_type,
  source_uri,
  trust_level,
  tags,
  metadata
) VALUES (
  '<your_profile_uuid>',
  'Project Planning Best Practices',
  'pmo',
  'document',
  'https://example.com/planning',
  0.9,
  '["planning", "best-practices"]',
  '{
    "type": "framework",
    "is_policy": true,
    "effective_from": "2024-01-01",
    "author": "PMO Team"
  }'
);
```

### Step 2: Create Chunks

```sql
-- Split document into chunks (450 tokens each with 90 overlap)
-- In production, use chunking algorithm
INSERT INTO pmo_ops.knowledge_chunks (
  document_id,
  profile_id,
  chunk_index,
  chunk_text,
  token_count,
  embedding
) VALUES
  (
    '<document_uuid>',
    '<your_profile_uuid>',
    0,
    'First chunk of text...',
    420,
    '[0.1, 0.2, 0.3, ...]' -- 1536-dim embedding
  ),
  (
    '<document_uuid>',
    '<your_profile_uuid>',
    1,
    'Second chunk of text...',
    415,
    '[0.2, 0.1, 0.4, ...]' -- 1536-dim embedding
  );
```

---

## 🔍 Query Examples

### Get Recent Classifications

```sql
SELECT
  request_id,
  input_text,
  primary_label,
  confidence_tier,
  score_breakdown,
  created_at
FROM pmo_ops.classification_runs
WHERE profile_id = '<your_profile_uuid>'
ORDER BY created_at DESC
LIMIT 10;
```

### Get Workflow Runs

```sql
SELECT
  run_id,
  request_id,
  workflow_key,
  state,
  attempt_count,
  last_error_code,
  jsonb_array_elements(timeline)->>'state' as state_history,
  jsonb_array_elements(timeline)->>'timestamp' as state_timestamp
FROM pmo_ops.workflow_runs
WHERE profile_id = '<your_profile_uuid>'
ORDER BY created_at DESC
LIMIT 10;
```

### Get Decision History

```sql
SELECT
  run_id,
  request_id,
  classification->>'type' as input_type,
  priority_score,
  risk_score,
  confidence_score,
  decision_payload->>'action_plan' as action_plan,
  created_at
FROM pmo_ops.decision_runs
WHERE profile_id = '<your_profile_uuid>'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY priority_score DESC
LIMIT 20;
```

---

## 🧪 Testing

### Test Classification Engine

```sql
-- Test classification scoring
INSERT INTO pmo_ops.classification_runs (
  run_id,
  request_id,
  profile_id,
  input_text,
  primary_label,
  confidence_tier,
  score_breakdown
) VALUES (
  gen_random_uuid(),
  'test-request-001',
  '<your_profile_uuid>',
  'Create a new project for Q2 planning',
  'initiative',
  'high',
  '{
    "semantic": 0.85,
    "rule": 0.90,
    "recency": 0.75,
    "trust": 0.80,
    "final_score": 84.5
  }'
);
```

### Test Workflow State Machine

```sql
-- Test state transition
INSERT INTO pmo_ops.workflow_runs (
  run_id,
  request_id,
  profile_id,
  workflow_key,
  state,
  timeline
) VALUES (
  gen_random_uuid(),
  'test-workflow-001',
  '<your_profile_uuid>',
  'pmo_new_request',
  'queued',
  '[{
    "state": "queued",
    "timestamp": "2024-03-27T10:00:00Z",
    "message": "Workflow initialized"
  }]'
);

-- Transition to running
UPDATE pmo_ops.workflow_runs
SET state = 'running',
    timeline = timeline || jsonb_build_object(
      'state', 'running',
      'timestamp', NOW(),
      'message', 'Executing workflow steps'
    )
WHERE run_id = (SELECT run_id FROM pmo_ops.workflow_runs WHERE request_id = 'test-workflow-001' LIMIT 1);
```

---

## 🐛 Common Issues

### Issue: RLS Blocking Queries

**Problem**: Can't access data even with correct profile_id

**Solution**:
```sql
-- Check JWT claims
SELECT current_setting('request.jwt.claim.sub', true);

-- Verify profile_id matches auth.uid()
SELECT id, email FROM public.profiles WHERE id = auth.uid();
```

---

### Issue: Vector Search Returns No Results

**Problem**: `match_kb_chunks()` returns empty set

**Solution**:
```sql
-- Check if embeddings exist
SELECT COUNT(*) FROM pmo_ops.knowledge_chunks WHERE embedding IS NOT NULL;

-- Check if index exists
SELECT indexname FROM pg_indexes
WHERE schemaname = 'pmo_ops' AND indexname LIKE '%embedding%';

-- Rebuild index if needed
DROP INDEX IF EXISTS pmo_ops_kb_chunks_embedding;
CREATE INDEX pmo_ops_kb_chunks_embedding
ON pmo_ops.knowledge_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

---

### Issue: Workflow Stuck in "retrying"

**Problem**: Workflow not progressing past retry state

**Solution**:
```sql
-- Check attempt count vs max_retries
SELECT run_id, attempt_count, last_error_code, timeline
FROM pmo_ops.workflow_runs
WHERE state = 'retrying'
ORDER BY created_at DESC
LIMIT 10;

-- Force state transition (emergency)
UPDATE pmo_ops.workflow_runs
SET state = 'fallback',
    last_error_code = 'MANUAL_OVERRIDE'
WHERE run_id = '<stuck_run_id>';
```

---

## 📊 Monitoring

### Track System Health

```sql
-- Active workflows per domain
SELECT
  'pmo_ops' as domain,
  state,
  COUNT(*) as count
FROM pmo_ops.workflow_runs
WHERE updated_at > NOW() - INTERVAL '1 hour'
GROUP BY state

UNION ALL

SELECT
  'tech_ops' as domain,
  state,
  COUNT(*) as count
FROM tech_ops.workflow_runs
WHERE updated_at > NOW() - INTERVAL '1 hour'
GROUP BY state

UNION ALL

SELECT
  'miiddle' as domain,
  state,
  COUNT(*) as count
FROM miiddle.workflow_runs
WHERE updated_at > NOW() - INTERVAL '1 hour'
GROUP BY state;
```

### Track Decision Quality

```sql
-- Average confidence scores
SELECT
  domain,
  ROUND(AVG(confidence_score), 3) as avg_confidence,
  COUNT(*) as total_decisions,
  SUM(CASE WHEN confidence_score > 0.8 THEN 1 ELSE 0 END) as high_confidence,
  SUM(CASE WHEN confidence_score < 0.5 THEN 1 ELSE 0 END) as low_confidence
FROM (
  SELECT 'pmo_ops' as domain, confidence_score FROM pmo_ops.decision_runs
  UNION ALL
  SELECT 'tech_ops', confidence_score FROM tech_ops.decision_runs
  UNION ALL
  SELECT 'miiddle', confidence_score FROM miiddle.decision_runs
) decisions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY domain;
```

---

## 🔐 Security Checks

### Verify RLS Isolation

```sql
-- Test that profiles can only access their own data
SET LOCAL request.jwt.claim.sub = '<profile_a_uuid>';

-- This should return 0 rows (profile_b's data)
SELECT COUNT(*) FROM pmo_ops.knowledge_documents
WHERE profile_id = '<profile_b_uuid>';

-- This should return rows (profile_a's data)
SELECT COUNT(*) FROM pmo_ops.knowledge_documents
WHERE profile_id = '<profile_a_uuid>';
```

### Audit Access Patterns

```sql
-- Check for cross-org access attempts
SELECT
  schemaname,
  tablename,
  policyname,
  permissive
FROM pg_policies
WHERE schemaname IN ('pmo_ops', 'tech_ops', 'miiddle')
ORDER BY schemaname, tablename;
```

---

## 🚀 Production Checklist

Before going to production:

- [ ] Migration applied successfully
- [ ] All schemas and tables verified
- [ ] RLS policies enabled on all tables
- [ ] Vector indexes created and verified
- [ ] Edge functions deployed
- [ ] Embedding API configured
- [ ] Knowledge base seeded
- [ ] Classification rules tuned
- [ ] Workflow templates tested
- [ ] Monitoring/alerting set up
- [ ] Backup strategy in place
- [ ] Rollback procedure tested
- [ ] Security audit completed
- [ ] Performance baselines established

---

## 📚 Further Reading

- **Full Documentation**: `/docs/brain-layer-implementation-guide.md`
- **API Contracts**: See Implementation Guide Section 6
- **Migration Details**: See SQL Migration File
- **Troubleshooting**: See Implementation Guide Section "Troubleshooting"

---

## ✅ You're Ready!

The Brain Layer is now fully operational. Start by:

1. Adding knowledge documents to each domain
2. Testing classification with sample inputs
3. Running workflow templates
4. Monitoring system health

**Happy Automating!** 🎉
