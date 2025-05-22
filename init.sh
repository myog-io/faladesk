#!/bin/sh
set -e

# Copy example env files if real ones are missing
if [ ! -f .env ]; then
  echo "Copying root .env from example"
  cp .env.example .env
fi
if [ ! -f supabase/.env ]; then
  echo "Copying Supabase .env from example"
  cp supabase/.env.example supabase/.env
fi

# Apply schema if supabase CLI is available
if command -v supabase >/dev/null 2>&1; then
  echo "Applying database schema via supabase db push"
  (cd supabase && supabase db push)
else
  echo "Supabase CLI not found, skipping schema push"
fi
