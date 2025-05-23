import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Payload {
  email: string
  organization_id: string
  role?: string
}

export async function handleInviteUser(
  payload: Payload,
  opts: { supabase?: any } = {}
) {
  const supabase =
    opts.supabase ??
    createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

  const { email, organization_id, role = 'agent' } = payload

  if (!email || !organization_id) {
    throw new Error('invalid payload')
  }

  const { error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(email)
  if (inviteErr) {
    throw new Error(inviteErr.message)
  }

  const { error } = await supabase.from('invites').insert({
    email,
    organization_id,
    role
  })
  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

serve(async (req) => {
  try {
    const payload: Payload = await req.json()
    const result = await handleInviteUser(payload)
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    const status = err.message === 'invalid payload' ? 400 : 500
    return new Response(err.message, { status })
  }
})
