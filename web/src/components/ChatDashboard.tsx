import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'

interface Conversation {
  id: string
  customer_name: string
  last_message?: string
  last_time?: string
  unread?: boolean
}

export default function ChatDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('conversations')
        .select(
          'id, customer_name, messages(content, sender, created_at)'
        )
        .order('updated_at', { ascending: false })
        .limit(1, { foreignTable: 'messages' })

      if (data) {
        const convs = (data as any[]).map((c) => {
          const last = c.messages?.[0]
          return {
            id: c.id,
            customer_name: c.customer_name,
            last_message: last?.content,
            last_time: last?.created_at,
            unread: last?.sender === 'customer'
          }
        })
        setConversations(convs)
      }
    }
    fetchConversations()
  }, [])

  const { messages, sendMessage } = useRealtimeMessages(selectedId)

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input.trim())
    setInput('')
  }

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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div>{c.customer_name}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>
                  {c.last_message}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px' }}>
                <div>{c.last_time && new Date(c.last_time).toLocaleTimeString()}</div>
                {c.unread && (
                  <span data-testid="unread-indicator" style={{ color: 'red' }}>
                    •
                  </span>
                )}
              </div>
            </div>
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
        {selectedId && (
          <footer style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
            >
              <input
                data-testid="reply-box"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </form>
          </footer>
        )}
      </main>
    </div>
  )
}
