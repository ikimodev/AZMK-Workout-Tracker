-- Run this in the Supabase SQL Editor

-- 1. Create the table to store shared programs
CREATE TABLE IF NOT EXISTS public.shared_programs (
    id TEXT PRIMARY KEY,
    program_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.shared_programs ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to insert a new program
CREATE POLICY "Allow public insert" ON public.shared_programs
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- 4. Create a policy to allow anyone to read programs
CREATE POLICY "Allow public read" ON public.shared_programs
    FOR SELECT
    TO public
    USING (true);
