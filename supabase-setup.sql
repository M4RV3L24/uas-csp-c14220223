-- Create announcements table
CREATE TABLE announcements (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert dummy data
INSERT INTO announcements (title, content) VALUES
('Welcome to the Employee Portal', 'We are excited to launch our new employee portal. Please explore the features and let us know your feedback.'),
('Company Meeting - January 2025', 'All employees are invited to attend the monthly company meeting on January 15th, 2025 at 10:00 AM in the main conference room.'),
('New Health Benefits Available', 'We have updated our health benefits package. Please review the new options and make your selections by the end of this month.');

-- Enable Row Level Security (optional but recommended)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read announcements
CREATE POLICY "Allow authenticated users to read announcements" ON announcements
FOR SELECT TO authenticated USING (true);