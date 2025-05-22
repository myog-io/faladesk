-- Organization and user management
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists memberships (
  user_id uuid references auth.users on delete cascade,
  organization_id uuid references organizations on delete cascade,
  primary key (user_id, organization_id)
);

-- Conversations and messages
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations,
  channel text not null, -- e.g. whatsapp, email
  status text not null default 'open',
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations on delete cascade,
  sender text not null, -- 'customer' or 'agent'
  content text,
  created_at timestamptz default now()
);

-- Workflows
create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations,
  name text not null,
  trigger jsonb, -- conditions for activation
  action jsonb   -- action to perform
);

