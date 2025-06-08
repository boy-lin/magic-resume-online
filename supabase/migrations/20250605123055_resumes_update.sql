alter table if exists public.resumes
add column is_public boolean default false;
add column public_password text;