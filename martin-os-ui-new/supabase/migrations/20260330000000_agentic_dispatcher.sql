-- Track the current stage of the 12-stage pipeline
ALTER TABLE diagnostics ADD COLUMN IF NOT EXISTS current_stage INT DEFAULT 1;
ALTER TABLE diagnostics ADD COLUMN IF NOT EXISTS stage_logs JSONB DEFAULT '[]';

CREATE OR REPLACE FUNCTION advance_pipeline_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-advance stage when log entry is added
  NEW.current_stage = jsonb_array_length(NEW.stage_logs) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_advance_stage ON diagnostics;
CREATE TRIGGER tr_advance_stage
BEFORE UPDATE OF stage_logs ON diagnostics
FOR EACH ROW EXECUTE FUNCTION advance_pipeline_stage();

-- Create agent_traces table for monitoring
CREATE TABLE IF NOT EXISTS agent_traces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intent TEXT NOT NULL,
  resolution TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
