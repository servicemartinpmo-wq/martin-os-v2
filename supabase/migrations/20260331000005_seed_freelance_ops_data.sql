
-- Seed Freelance Metrics
INSERT INTO business_metrics (label, value, trend, icon, is_positive, category)
VALUES 
('Pipeline Value', '$42,500', '+15%', 'DollarSign', true, 'freelance'),
('Active Leads', '24', '+4', 'UserPlus', true, 'freelance'),
('Marketing ROI', '3.2x', '+0.4', 'TrendingUp', true, 'freelance'),
('Open Invoices', '6', '$8.2k', 'Mail', true, 'freelance');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  booking_time TEXT NOT NULL,
  booking_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed bookings
INSERT INTO bookings (client_name, booking_time, booking_type)
VALUES 
('Sarah Miller', '10:00 AM', 'Discovery Call'),
('Tech Corp', '2:30 PM', 'Design Review'),
('Mike Ross', '4:00 PM', 'Consultation');

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for bookings" ON bookings FOR SELECT USING (true);
