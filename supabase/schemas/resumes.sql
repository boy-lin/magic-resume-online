
/** 
* resumes
* Note: products are created and managed in Stripe and synced to our DB via Stripe webhooks.
*/
create table resumes (
  -- Subscription ID from Stripe, e.g. sub_1234.
  id text primary key,
  user_id uuid references auth.users not null,
  template_id text,
  title text,
  basic text,
  custom_data text,
  education text, 
  experience text,
  global_settings text,
  menu_sections text,
  projects text,
  skill_content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create policy "Allow public read-only access." on resumes for select using (true);
