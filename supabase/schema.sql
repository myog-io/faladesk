-- Organization and user management
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);


create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  supabase_uid uuid not null references auth.users on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  language text default 'en',
  organization_id uuid references organizations on delete cascade,
  role text not null check (role in ('admin','agent')),
  created_at timestamptz default now()
);

-- Agent presence status
alter table users
  add column if not exists status text
    check (status in ('online','away','offline'))
    not null default 'offline';

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

-- Pending invitations for new users
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  organization_id uuid references organizations on delete cascade,
  role text not null default 'agent',
  created_at timestamptz default now(),
  accepted_at timestamptz
);

create or replace function handle_new_auth_user()
returns trigger as $$
declare
  inv invites%rowtype;
begin
  select * into inv from invites where email = new.email order by created_at desc limit 1;
  if inv.organization_id is not null then
    insert into users (supabase_uid, email, organization_id, role)
      values (new.id, new.email, inv.organization_id, inv.role);
    update invites set accepted_at = now() where id = inv.id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_auth_user();

