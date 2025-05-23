import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export interface RealtimeMessage {
  id: string
  sender: string
  content: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([])

  useEffect(() => {
    if (!conversationId) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, sender, content, metadata, created_at')
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
          setMessages((msgs) => [...msgs, payload.new as RealtimeMessage])
        }
      )
      .subscribe()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = async (content: string) => {
    if (!conversationId) return
    await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender: 'agent',
      content
    })
  }

  return { messages, sendMessage }
}
