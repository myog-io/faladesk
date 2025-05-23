import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export type PresenceStatus = 'online' | 'away' | 'offline'

export function useAgentPresence(agentId: string | null) {
  const [status, setStatus] = useState<PresenceStatus>('offline')

  useEffect(() => {
    if (!agentId) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchStatus = async () => {
      const { data } = await supabase
        .from('users')
        .select('status')
        .eq('id', agentId)
        .single()

      if (data) setStatus(data.status as PresenceStatus)
    }

    fetchStatus()

    channel = supabase
      .channel('users_status:' + agentId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${agentId}`
        },
        (payload) => setStatus((payload.new as any).status as PresenceStatus)
      )
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [agentId])

  const updateStatus = async (newStatus: PresenceStatus) => {
    if (!agentId) return
    await supabase.from('users').update({ status: newStatus }).eq('id', agentId)
  }

  return { status, updateStatus }
}
