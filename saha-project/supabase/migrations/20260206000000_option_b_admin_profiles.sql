-- Option B: DB-backed admin flag.
--
-- This creates a `profiles` table keyed by the Supabase Auth user id.
-- Admin access is controlled through `profiles.is_admin`.
--
-- Apply with Supabase CLI (linked project):
--   npx supabase db push
-- or via Dashboard SQL editor.

-- 1) Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2) Enable RLS
alter table public.profiles enable row level security;

-- 3) Policies
-- Users can read their own profile row.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Profiles: select own'
  ) then
    create policy "Profiles: select own"
      on public.profiles
      for select
      to authenticated
      using (id = auth.uid());
  end if;
end $$;

-- Users can insert their own profile row (optional, but convenient).
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Profiles: insert own'
  ) then
    create policy "Profiles: insert own"
      on public.profiles
      for insert
      to authenticated
      with check (id = auth.uid());
  end if;
end $$;

-- No update policy by default (prevents users toggling is_admin).

-- Allow admins to update profiles (used by admin tools / RPC).
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'Profiles: admin update'
  ) then
    create policy "Profiles: admin update"
      on public.profiles
      for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- Admin-only function to grant/revoke admin for another user.
-- SECURITY DEFINER runs with the function owner's privileges, but we still
-- explicitly verify the caller is an admin.
create or replace function public.set_admin(target_user_id uuid, make_admin boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  insert into public.profiles (id, is_admin)
  values (target_user_id, make_admin)
  on conflict (id) do update set is_admin = excluded.is_admin;
end;
$$;

revoke all on function public.set_admin(uuid, boolean) from public;
grant execute on function public.set_admin(uuid, boolean) to authenticated;

-- 4) Helper function for admin checks in RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- 5) Moderation table policies (service_submissions)
-- NOTE: Adjust column names/types if your `service_submissions` differs.
alter table public.service_submissions enable row level security;

-- Anyone authenticated can insert a pending submission.
-- If you track submitter, you can tighten this. For now, allow insert.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'service_submissions' and policyname = 'Submissions: insert'
  ) then
    create policy "Submissions: insert"
      on public.service_submissions
      for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Only admins can select submissions (admin dashboard)
-- If you'd like users to view their own submissions later, add a policy for that.
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'service_submissions' and policyname = 'Submissions: admin select'
  ) then
    create policy "Submissions: admin select"
      on public.service_submissions
      for select
      to authenticated
      using (public.is_admin());
  end if;
end $$;

-- Only admins can update submissions (approve/deny)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'service_submissions' and policyname = 'Submissions: admin update'
  ) then
    create policy "Submissions: admin update"
      on public.service_submissions
      for update
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;
end $$;

-- 6) Give yourself admin (replace with your actual user id)
-- You can run this after you know your auth uid:
--   insert into public.profiles (id, is_admin) values ('<YOUR-UID>', true)
--   on conflict (id) do update set is_admin = true;
