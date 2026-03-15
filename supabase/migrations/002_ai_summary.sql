-- Add AI summary column to blood_tests table
-- Stores cached AI-generated insights for each test
ALTER TABLE blood_tests ADD COLUMN ai_summary text;
