
-- Seed Projects
INSERT INTO projects (title, description, status, priority_score, strategic_alignment, public_visibility)
VALUES 
('Market Expansion Q3', 'Expanding into EMEA and APAC regions with localized marketing campaigns.', 'in-progress', 92, 'High', true),
('Core Infrastructure Upgrade', 'Upgrading database clusters and implementing global CDN for lower latency.', 'in-progress', 85, 'Medium', true),
('AI-Powered Support Agent', 'Developing Apphia, the autonomous support agent for system oversight.', 'planned', 78, 'High', true);

-- Seed Tasks
INSERT INTO tasks (title, description, priority, status, project_id)
SELECT 'Finalize EMEA Budget', 'Review and approve the budget allocation for European market entry.', 'critical', 'todo', id FROM projects WHERE title = 'Market Expansion Q3' LIMIT 1;

INSERT INTO tasks (title, description, priority, status, project_id)
SELECT 'Database Migration Plan', 'Drafting the step-by-step plan for the cluster upgrade.', 'high', 'in-progress', id FROM projects WHERE title = 'Core Infrastructure Upgrade' LIMIT 1;

INSERT INTO tasks (title, description, priority, status, project_id)
SELECT 'Apphia Training Data', 'Gathering historical support logs for model fine-tuning.', 'medium', 'todo', id FROM projects WHERE title = 'AI-Powered Support Agent' LIMIT 1;

-- Update signals table if it exists, or create it with more fields
CREATE TABLE IF NOT EXISTS signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT, -- info, warning, critical
  value TEXT,
  trend TEXT,
  is_positive BOOLEAN,
  history JSONB, -- Array of { name, value } for sparklines
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Signals with more data
TRUNCATE TABLE signals;
INSERT INTO signals (title, description, severity, value, trend, is_positive, history)
VALUES 
('System Load', 'Current CPU and Memory usage across all clusters.', 'info', '42%', '+5%', false, '[{"name": "Mon", "value": 30}, {"name": "Tue", "value": 35}, {"name": "Wed", "value": 40}, {"name": "Thu", "value": 38}, {"name": "Fri", "value": 42}]'),
('Revenue Drift', 'Deviation from projected revenue targets.', 'warning', '-2.4%', '-0.5%', false, '[{"name": "Mon", "value": 0}, {"name": "Tue", "value": -1}, {"name": "Wed", "value": -1.5}, {"name": "Thu", "value": -2}, {"name": "Fri", "value": -2.4}]'),
('Error Rate', 'Percentage of failed requests in the last hour.', 'critical', '0.8%', '+0.3%', false, '[{"name": "Mon", "value": 0.1}, {"name": "Tue", "value": 0.2}, {"name": "Wed", "value": 0.5}, {"name": "Thu", "value": 0.4}, {"name": "Fri", "value": 0.8}]'),
('User Growth', 'New user registrations compared to previous period.', 'info', '+18%', '+2%', true, '[{"name": "Mon", "value": 10}, {"name": "Tue", "value": 12}, {"name": "Wed", "value": 15}, {"name": "Thu", "value": 14}, {"name": "Fri", "value": 18}]');

-- Seed Insights
INSERT INTO insights (title, content)
VALUES 
('Capacity Warning', 'Engineering capacity is projected to bottleneck in Sprint 14 due to overlapping high-priority initiatives.'),
('Market Opportunity', 'Early data from APAC shows a 25% higher engagement rate than expected for the new service tier.'),
('Risk Detected', 'Dependency delay in Project Alpha is likely to impact the Beta launch timeline by 2 weeks.');

-- Create Tables for Founder Dashboard
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  trend TEXT,
  icon TEXT,
  is_positive BOOLEAN,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS operational_risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT, -- low, medium, high, critical
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Founder Data
INSERT INTO business_metrics (label, value, trend, icon, is_positive, category)
VALUES 
('Bank Balance', '$142,500', '+12%', 'DollarSign', true, 'founder'),
('Burn Rate', '$18,200', '-5%', 'Activity', true, 'founder'),
('Team Capacity', '84%', 'Stable', 'Users', NULL, 'founder'),
('Open Risks', '3', 'High', 'AlertCircle', false, 'founder');

-- Seed Tech Metrics
INSERT INTO business_metrics (label, value, trend, icon, is_positive, category)
VALUES 
('System Uptime', '99.99%', '+0.01%', 'Activity', true, 'tech'),
('Resource Efficiency', '92%', '+5%', 'Zap', true, 'tech'),
('Security Alerts', '0', '0', 'ShieldAlert', true, 'tech'),
('Monthly Tech Spend', '$4,250', '-2%', 'DollarSign', true, 'tech'),
('Global Uptime', '99.98%', 'Stable', 'Globe', true, 'tech'),
('Compliance Score', '98/100', '+2', 'ShieldAlert', true, 'tech'),
('Team Velocity', '+12%', '+3%', 'Zap', true, 'tech'),
('Active Incidents', '1', '-1', 'AlertTriangle', false, 'tech'),
('HIPAA Compliance', 'Passed', 'Verified', 'Lock', true, 'tech'),
('Audit Logs', 'Active', 'Live', 'ClipboardList', true, 'tech'),
('Patient Data Encrypted', '100%', 'Stable', 'ShieldAlert', true, 'tech'),
('Access Requests', '14', '+2', 'Users', true, 'tech'),
('Active Tasks', '8', '-2', 'Ticket', true, 'tech'),
('Security Score', '84/100', '+5', 'ShieldAlert', true, 'tech'),
('Auto-Resolved', '142', '+24', 'Zap', true, 'tech');

INSERT INTO checklist_items (label, is_urgent)
VALUES 
('Payroll Approval', true),
('VAT Return Submission', true),
('Investor Update', false),
('Team Performance Review', false);

INSERT INTO operational_risks (title, description, severity)
VALUES 
('Low Cash Runway', 'Runway estimated at 4.2 months. Action needed.', 'high'),
('Key Person Risk', 'Lead developer on leave for 2 weeks.', 'medium');

CREATE TABLE IF NOT EXISTS project_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Project Tasks
INSERT INTO project_tasks (project_id, title, completed)
SELECT id, 'Market Analysis Report', true FROM projects WHERE title = 'Market Expansion Q3' LIMIT 1;
INSERT INTO project_tasks (project_id, title, completed)
SELECT id, 'Competitor Benchmarking', false FROM projects WHERE title = 'Market Expansion Q3' LIMIT 1;
INSERT INTO project_tasks (project_id, title, completed)
SELECT id, 'Local Agency Selection', false FROM projects WHERE title = 'Market Expansion Q3' LIMIT 1;

INSERT INTO project_tasks (project_id, title, completed)
SELECT id, 'Server Procurement', true FROM projects WHERE title = 'Core Infrastructure Upgrade' LIMIT 1;
INSERT INTO project_tasks (project_id, title, completed)
SELECT id, 'Network Configuration', false FROM projects WHERE title = 'Core Infrastructure Upgrade' LIMIT 1;

-- Enable RLS for project_tasks
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for project_tasks" ON project_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public update for project_tasks" ON project_tasks FOR UPDATE USING (true);
CREATE POLICY "Allow public insert for project_tasks" ON project_tasks FOR INSERT WITH CHECK (true);

-- Enable RLS for other tables
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for business_metrics" ON business_metrics FOR SELECT USING (true);
CREATE POLICY "Allow public read for checklist_items" ON checklist_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for operational_risks" ON operational_risks FOR SELECT USING (true);
