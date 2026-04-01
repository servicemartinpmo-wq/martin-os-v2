
-- Seed Office Metrics
INSERT INTO business_metrics (label, value, trend, icon, is_positive, category)
VALUES 
('Office Budget', '$8,400', '72% used', 'DollarSign', false, 'office'),
('Supply Level', 'Good', '2 low items', 'Package', true, 'office'),
('Team Presence', '12/15', '3 remote', 'Users', NULL, 'office'),
('Open Tasks', '8', '2 urgent', 'ClipboardList', false, 'office');

-- Create operations_log table
CREATE TABLE IF NOT EXISTS operations_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  time_label TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed operations_log
INSERT INTO operations_log (title, category, status, time_label)
VALUES 
('Monthly Rent Payment', 'Finance', 'Completed', '09:00 AM'),
('Kitchen Supply Restock', 'Inventory', 'In Progress', '10:30 AM'),
('New Employee Onboarding', 'Team', 'Pending', '01:00 PM'),
('IT Infrastructure Maintenance', 'Operations', 'Scheduled', '04:00 PM');

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  level_percent INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed inventory_items
INSERT INTO inventory_items (item_name, level_percent)
VALUES 
('Printer Paper', 15),
('Coffee Beans', 5),
('Cleaning Supplies', 20);

-- Create office_alerts table
CREATE TABLE IF NOT EXISTS office_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'normal', -- normal, urgent
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed office_alerts
INSERT INTO office_alerts (title, description, type)
VALUES 
('HVAC System Error', 'Maintenance requested for 2nd floor.', 'urgent'),
('Visitor Arriving', 'Mr. Henderson arriving in 15 mins.', 'normal');

-- Enable RLS
ALTER TABLE operations_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for operations_log" ON operations_log FOR SELECT USING (true);
CREATE POLICY "Allow public read for inventory_items" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Allow public read for office_alerts" ON office_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public update for office_alerts" ON office_alerts FOR UPDATE USING (true);
