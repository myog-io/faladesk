-- Organization and user management
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);


create table if not exists users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  organization_id uuid references organizations on delete cascade,
  role text not null check (role in ('admin','agent')),
  created_at timestamptz default now()
);

-- Conversations and messages
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations,
  customer_name text,
  channel text not null, -- e.g. whatsapp, email
  status text not null default 'open',
  assigned_user_id uuid references users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations on delete cascade,
  sender text not null check (sender in ('user','customer','agent','ai')),
  content text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Workflows
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations,
  name text not null,
  trigger_type text not null,
  conditions jsonb,
  actions jsonb,
  is_active boolean not null default true
);

