import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export interface ConversationRow {
  id: string
  customer_name: string | null
}

export interface ConversationWithUnread extends ConversationRow {
  unread: number
}

export function useConversations(activeId: string | null) {
  const [conversations, setConversations] = useState<ConversationWithUnread[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, customer_name')
        .order('created_at', { ascending: true })

      if (data) {
        setConversations((data as ConversationRow[]).map(c => ({ ...c, unread: 0 })))
      }
    }

    fetchConversations()

    const channel = supabase
      .channel('messages-all')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          const convId = payload.new.conversation_id as string
          setConversations(prev => {
            const idx = prev.findIndex(c => c.id === convId)
            if (idx === -1) return prev
            const updated = [...prev]
            if (convId !== activeId) {
              updated[idx] = { ...updated[idx], unread: updated[idx].unread + 1 }
            }
            return updated
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeId])

  const clearUnread = (id: string) => {
    setConversations(prev => prev.map(c => (c.id === id ? { ...c, unread: 0 } : c)))
  }

  return { conversations, clearUnread }
}
