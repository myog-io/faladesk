import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export interface RealtimeMessage {
  id: string
  sender: string
  content: string
  created_at: string
  metadata?: any
}

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([])

  useEffect(() => {
    if (!conversationId) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, sender, content, created_at, metadata')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data as RealtimeMessage[])
    }

    fetchMessages()

    channel = supabase
      .channel('messages:' + conversationId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages((msgs) => {
            const exists = msgs.find((m) => m.id === (payload.new as any).id)
            if (exists) return msgs
            return [...msgs, payload.new as RealtimeMessage]
          })
        }
      )
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = async (content: string, metadata?: any) => {
    if (!conversationId) return
    const optimistic: RealtimeMessage = {
      id: 'local-' + Date.now(),
      sender: 'agent',
      content,
      created_at: new Date().toISOString(),
      metadata
    }
    setMessages((msgs) => [...msgs, optimistic])
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender: 'agent',
      content,
      metadata
    })
  }

  return { messages, sendMessage }
}
