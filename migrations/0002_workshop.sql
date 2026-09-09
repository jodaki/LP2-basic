-- Workshop shared state, role profiles, notifications and audit.

create table if not exists profiles (
  user_id      text primary key,
  username     text unique not null,
  display_name text not null,
  role         text not null,
  employee_id  text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists profiles_role_idx on profiles (role);

create table if not exists workshop_state (
  id         text primary key,
  payload    jsonb not null,
  version    integer not null default 1,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists notifications (
  id         text primary key,
  user_id    text not null,
  title      text not null,
  body       text not null,
  kind       text not null,
  href       text,
  record_id  text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on notifications (user_id, read, created_at desc);

create table if not exists audit_log (
  id         text primary key,
  at         timestamptz not null default now(),
  user_id    text not null,
  user_name  text not null,
  action     text not null,
  collection text not null,
  record_id  text,
  summary    text not null
);
create index if not exists audit_log_at_idx on audit_log (at desc);
