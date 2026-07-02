-- Zaya's Ananda — Supabase (Postgres) schema
create extension if not exists "pgcrypto";

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text unique,
  phone         text,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create table if not exists cms_items (
  id         uuid primary key default gen_random_uuid(),
  kind       text not null check (kind in ('service','course','product','resource')),
  title      text not null,
  summary    text default '',
  body       text,
  price      integer,
  category   text,
  mode       text check (mode in ('online','tankhim','both')),
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users(id) on delete set null,
  customer   jsonb not null,
  items      jsonb not null,
  total      integer not null default 0,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists cms_items_kind_idx on cms_items(kind);
create index if not exists orders_user_idx on orders(user_id);

-- Rich content fields (image, counts, teacher) — run these in Supabase SQL Editor:
alter table cms_items add column if not exists image         text;
alter table cms_items add column if not exists video_lessons integer;
alter table cms_items add column if not exists students      integer;
alter table cms_items add column if not exists views         integer;
alter table cms_items add column if not exists teacher_name  text;
alter table cms_items add column if not exists teacher_image text;
alter table cms_items add column if not exists teacher_info  text;

alter table cms_items add column if not exists lessons jsonb;

create table if not exists site_settings (
  id text primary key,
  logo text,
  about_title text,
  about_body text,
  facebook text,
  instagram text,
  youtube text,
  updated_at timestamptz default now()
);

alter table cms_items add column if not exists link text;
