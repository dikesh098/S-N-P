-- =====================================================================
--  SHARDA MAA NAVRATRI PLATFORM — Supabase schema (PostgreSQL)
--  Paste this whole file into: Supabase Dashboard -> SQL Editor -> New query -> Run
--  Safe to run more than once (uses "if not exists" / "drop policy if exists").
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. PROFILES (one row per login; role = 'admin' unlocks the dashboard)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'user' check (role in ('user','admin')),
  created_at  timestamptz not null default now()
);

-- Helper used by every policy below. SECURITY DEFINER so it can read profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Create a profile automatically for every new auth user (role = 'user').
-- You promote yourself to admin manually (see the bottom of this file).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 2. CONTENT TABLES
--    Text columns come in three languages: name, name_hi, name_mr.
--    English is the fallback if Hindi/Marathi is empty.
-- ---------------------------------------------------------------------
create table if not exists public.festival_years (
  id             uuid primary key default gen_random_uuid(),
  year           integer not null unique check (year between 2000 and 2100),
  title          text, title_hi text, title_mr text,
  description    text, description_hi text, description_mr text,
  cover_image    text,
  start_date     date,
  end_date       date,
  is_current     boolean not null default false,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.events (
  id               uuid primary key default gen_random_uuid(),
  festival_year_id uuid references public.festival_years(id) on delete cascade,
  title            text not null, title_hi text, title_mr text,
  category         text not null default 'community',
  description      text, description_hi text, description_mr text,
  event_date       date,
  event_time       text,
  location         text,
  image_url        text,
  sort_order       integer not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.daily_programs (
  id                 uuid primary key default gen_random_uuid(),
  festival_year_id   uuid not null references public.festival_years(id) on delete cascade,
  day_number         integer not null check (day_number between 1 and 12),
  program_date       date,
  title              text, title_hi text, title_mr text,
  description        text, description_hi text, description_mr text,
  location           text,
  image_url          text,          -- card image for the day
  darshan_image_url  text,          -- today's darshan photo
  items              jsonb not null default '[]'::jsonb,  -- [{time,title,title_hi,title_mr,kind}]
  published          boolean not null default true,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (festival_year_id, day_number)
);

create table if not exists public.announcements (
  id                uuid primary key default gen_random_uuid(),
  festival_year_id  uuid references public.festival_years(id) on delete set null,
  title             text not null, title_hi text, title_mr text,
  description       text, description_hi text, description_mr text,
  announcement_date date not null default current_date,
  event_time        text,
  location          text,
  priority          text not null default 'normal' check (priority in ('normal','high','urgent')),
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.gallery_albums (
  id                uuid primary key default gen_random_uuid(),
  festival_year_id  uuid references public.festival_years(id) on delete cascade,
  title             text not null, title_hi text, title_mr text,
  category          text,
  cover_image       text,
  sort_order        integer not null default 0,
  published         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id            uuid primary key default gen_random_uuid(),
  album_id      uuid references public.gallery_albums(id) on delete set null,
  year          integer not null check (year between 2000 and 2100),
  category      text not null default 'community',
  image_url     text not null,      -- optimised full image (WebP, <= ~1600px)
  thumb_url     text,               -- small thumbnail (WebP, ~480px)
  caption       text, caption_hi text, caption_mr text,
  is_featured   boolean not null default false,
  sort_order    integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.videos (
  id            uuid primary key default gen_random_uuid(),
  youtube_url   text not null,
  title         text not null, title_hi text, title_mr text,
  description   text, description_hi text, description_mr text,
  year          integer check (year between 2000 and 2100),
  category      text,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.committee_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null, name_hi text, name_mr text,
  role          text, role_hi text, role_mr text,
  group_key     text not null default 'organizing'
                check (group_key in ('office','organizing','cultural','volunteer','women','youth')),
  photo_url     text,
  description   text, description_hi text, description_mr text,
  sort_order    integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.community_activities (
  id             uuid primary key default gen_random_uuid(),
  title          text not null, title_hi text, title_mr text,
  category       text,
  description    text, description_hi text, description_mr text,
  activity_date  date,
  image_url      text,
  sort_order     integer not null default 0,
  published      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. PRIVATE TABLES (never readable by the public)
-- ---------------------------------------------------------------------
create table if not exists public.volunteers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null check (char_length(name) between 1 and 120),
  mobile           text not null check (char_length(mobile) between 5 and 20),
  email            text check (email is null or char_length(email) <= 200),
  area             text check (area is null or char_length(area) <= 200),
  activity         text check (activity is null or char_length(activity) <= 200),
  available_dates  text check (available_dates is null or char_length(available_dates) <= 300),
  message          text check (message is null or char_length(message) <= 2000),
  is_contacted     boolean not null default false,
  created_at       timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 120),
  mobile      text check (mobile is null or char_length(mobile) <= 20),
  email       text check (email is null or char_length(email) <= 200),
  message     text not null check (char_length(message) between 1 and 3000),
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. WEBSITE SETTINGS (simple key/value; edited from /admin -> Website Settings)
-- ---------------------------------------------------------------------
create table if not exists public.website_settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

insert into public.website_settings (key, value) values
  ('organizationName', '[ORGANIZATION NAME]'),
  ('festivalName',     'Shri Sharda Maa Navratri Mahotsav'),
  ('colonyName',       '[COLONY NAME]'),
  ('city',             '[CITY]'),
  ('state',            '[STATE]'),
  ('currentYear',      to_char(now(), 'YYYY')),
  ('venue',            '[VENUE]'),
  ('phone',            '[PHONE]'),
  ('email',            '[EMAIL]'),
  ('upiId',            '[UPI ID]'),
  ('bankDetails',      ''),
  ('instagram',        ''),
  ('facebook',         ''),
  ('youtube',          ''),
  ('whatsapp',         ''),
  ('logo',             ''),
  ('heroImage',        '')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------
-- 5. INDEXES
-- ---------------------------------------------------------------------
create index if not exists idx_events_year        on public.events (festival_year_id, event_date);
create index if not exists idx_programs_year_day  on public.daily_programs (festival_year_id, day_number);
create index if not exists idx_programs_date      on public.daily_programs (program_date);
create index if not exists idx_ann_date           on public.announcements (announcement_date desc);
create index if not exists idx_gallery_year_cat   on public.gallery_images (year, category, sort_order);
create index if not exists idx_gallery_album      on public.gallery_images (album_id);
create index if not exists idx_videos_year        on public.videos (year);
create index if not exists idx_committee_group    on public.committee_members (group_key, sort_order);
create index if not exists idx_activities_date    on public.community_activities (activity_date desc);
create index if not exists idx_volunteers_created on public.volunteers (created_at desc);
create index if not exists idx_messages_created   on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------
-- 6. updated_at triggers
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['festival_years','events','daily_programs','announcements','gallery_albums',
                           'committee_members','community_activities','website_settings']
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$I', t);
    execute format('create trigger trg_%1$s_updated before update on public.%1$I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles             enable row level security;
alter table public.festival_years       enable row level security;
alter table public.events               enable row level security;
alter table public.daily_programs       enable row level security;
alter table public.announcements        enable row level security;
alter table public.gallery_albums       enable row level security;
alter table public.gallery_images       enable row level security;
alter table public.videos               enable row level security;
alter table public.committee_members    enable row level security;
alter table public.community_activities enable row level security;
alter table public.volunteers           enable row level security;
alter table public.contact_messages     enable row level security;
alter table public.website_settings     enable row level security;

-- profiles: you can see your own row; admins see all. Nobody edits roles from the browser.
drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

-- Public content tables: visitors see PUBLISHED rows, admins do everything.
do $$
declare t text;
begin
  foreach t in array array['festival_years','events','daily_programs','announcements','gallery_albums',
                           'gallery_images','videos','committee_members','community_activities']
  loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I
                    for select to anon, authenticated using (published = true or public.is_admin())', t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format('create policy "admin insert" on public.%I
                    for insert to authenticated with check (public.is_admin())', t);

    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format('create policy "admin update" on public.%I
                    for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "admin delete" on public.%I
                    for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- Settings: public can read (they are shown on the website); only admins write.
drop policy if exists "settings public read" on public.website_settings;
create policy "settings public read" on public.website_settings
  for select to anon, authenticated using (true);
drop policy if exists "settings admin insert" on public.website_settings;
create policy "settings admin insert" on public.website_settings
  for insert to authenticated with check (public.is_admin());
drop policy if exists "settings admin update" on public.website_settings;
create policy "settings admin update" on public.website_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "settings admin delete" on public.website_settings;
create policy "settings admin delete" on public.website_settings
  for delete to authenticated using (public.is_admin());

-- Volunteers & contact messages: anyone may SUBMIT, only admins may READ / change / delete.
drop policy if exists "anyone can submit volunteer" on public.volunteers;
create policy "anyone can submit volunteer" on public.volunteers
  for insert to anon, authenticated with check (is_contacted = false);
drop policy if exists "admin read volunteers" on public.volunteers;
create policy "admin read volunteers" on public.volunteers
  for select to authenticated using (public.is_admin());
drop policy if exists "admin update volunteers" on public.volunteers;
create policy "admin update volunteers" on public.volunteers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete volunteers" on public.volunteers;
create policy "admin delete volunteers" on public.volunteers
  for delete to authenticated using (public.is_admin());

drop policy if exists "anyone can send message" on public.contact_messages;
create policy "anyone can send message" on public.contact_messages
  for insert to anon, authenticated with check (is_read = false);
drop policy if exists "admin read messages" on public.contact_messages;
create policy "admin read messages" on public.contact_messages
  for select to authenticated using (public.is_admin());
drop policy if exists "admin update messages" on public.contact_messages;
create policy "admin update messages" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete messages" on public.contact_messages;
create policy "admin delete messages" on public.contact_messages
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- 8. STORAGE (photos). One public bucket called "media", max 5 MB per file.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp','image/jpeg','image/png'])
on conflict (id) do update
  set public = true, file_size_limit = 5242880,
      allowed_mime_types = array['image/webp','image/jpeg','image/png'];

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------
-- 9. MAKE YOURSELF ADMIN  (run AFTER you create your user in Authentication -> Users)
--    Replace the email, then run just this one line:
-- ---------------------------------------------------------------------
-- update public.profiles set role = 'admin' where email = 'you@example.com';
