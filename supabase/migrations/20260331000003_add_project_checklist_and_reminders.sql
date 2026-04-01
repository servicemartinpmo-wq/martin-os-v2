
-- Add category to checklist_items
ALTER TABLE checklist_items ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Seed project-specific checklist items
INSERT INTO checklist_items (label, is_urgent, category)
VALUES 
('Stakeholder Analysis', false, 'project'),
('Risk Register Update', true, 'project'),
('Resource Allocation', false, 'project'),
('Quality Audit', false, 'project');

-- Create a system_reminders table
CREATE TABLE IF NOT EXISTS system_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  time_label TEXT NOT NULL,
  type TEXT DEFAULT 'normal', -- urgent, normal
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed system reminders
INSERT INTO system_reminders (title, time_label, type)
VALUES 
('Budget Review', '2h left', 'urgent'),
('Team Sync', 'Tomorrow', 'normal'),
('Compliance Report', 'Friday', 'normal');

-- Enable RLS for system_reminders
ALTER TABLE system_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for system_reminders" ON system_reminders FOR SELECT USING (true);
CREATE POLICY "Allow public update for system_reminders" ON system_reminders FOR UPDATE USING (true);
