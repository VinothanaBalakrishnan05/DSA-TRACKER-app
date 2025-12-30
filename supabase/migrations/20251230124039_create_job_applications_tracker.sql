/*
  # Job Applications Tracker

  1. New Tables
    - `job_applications`
      - `id` (uuid, primary key)
      - `company_name` (text) - Name of the company
      - `application_status` (text) - pending, accepted, rejected
      - `review` (text, nullable) - Notes/review for the application
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `interview_rounds`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key)
      - `round_name` (text) - Round 1, Round 2, etc.
      - `round_number` (integer) - For ordering
      - `status` (text) - pending, accepted, rejected
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  application_status text DEFAULT 'pending' CHECK (application_status IN ('pending', 'accepted', 'rejected')),
  review text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create interview_rounds table
CREATE TABLE IF NOT EXISTS interview_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  round_name text NOT NULL,
  round_number integer NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_rounds ENABLE ROW LEVEL SECURITY;

-- Policies for job_applications (allow all operations for now - demo mode)
CREATE POLICY "Allow all access to job_applications"
  ON job_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Policies for interview_rounds
CREATE POLICY "Allow all access to interview_rounds"
  ON interview_rounds
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_interview_rounds_application_id ON interview_rounds(application_id);
CREATE INDEX IF NOT EXISTS idx_interview_rounds_round_number ON interview_rounds(application_id, round_number);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interview_rounds_updated_at ON interview_rounds;
CREATE TRIGGER update_interview_rounds_updated_at
    BEFORE UPDATE ON interview_rounds
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
