import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'

export default function ChatView({
  clearUnread,
}: {
  clearUnread: (id: string) => void
}) {
  const { chatId } = useParams<{ chatId: string }>()
  const { messages, sendMessage } = useRealtimeMessages(chatId || null)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (chatId) clearUnread(chatId)
  }, [chatId, clearUnread])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  if (!chatId) return null

  return (
    <>
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#f5f5f5' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'agent' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
            <div style={{ background: m.sender === 'agent' ? '#dcf8c6' : '#fff', padding: '8px 12px', borderRadius: '8px', maxWidth: '70%' }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <footer style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSend() }}>
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
    </>
  )
}
