import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'
import MessageComposer from './MessageComposer'

interface Conversation {
  id: string
  customer_name: string
}

export default function ChatDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select('id, customer_name')
        .order('updated_at', { ascending: false })
      if (data) setConversations(data as Conversation[])
    }
    fetchConversations()
  }, [])

  const { messages, sendMessage } = useRealtimeMessages(selectedId)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        {conversations.map((c) => (
          <div
            data-testid="conversation-row"
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            style={{
              padding: '10px',
              borderBottom: '1px solid #f0f0f0',
              background: selectedId === c.id ? '#eee' : undefined,
              cursor: 'pointer'
            }}
          >
            {c.customer_name}
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#f5f5f5' }}>
          {messages.map((m) => (
            <div
              data-testid="message-row"
              key={m.id}
              style={{
                display: 'flex',
                justifyContent: m.sender === 'agent' ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}
            >
              <div
                style={{
                  background: m.sender === 'agent' ? '#dcf8c6' : '#fff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  maxWidth: '70%'
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        {selectedId && <MessageComposer onSend={sendMessage} />}
      </main>
    </div>
  )
}
