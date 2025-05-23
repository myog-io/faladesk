import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Message {
  id: string
  sender: string
  content: string
}

const initialMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'customer', content: 'Hi' },
    { id: 'm2', sender: 'agent', content: 'Hello Alice' }
  ],
  '2': [
    { id: 'm3', sender: 'customer', content: 'Hey' },
    { id: 'm4', sender: 'agent', content: 'Hello Bob' }
  ]
}

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (chatId) {
      setMessages(initialMessages[chatId] || [])
    }
  }, [chatId])

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((m) => [
      ...m,
      { id: Date.now().toString(), sender: 'agent', content: input.trim() }
    ])
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
