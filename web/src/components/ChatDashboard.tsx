import { useState } from 'react'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
}

interface Message {
  id: string
  sender: 'agent' | 'customer'
  content: string
  timestamp: string
}

export default function ChatDashboard() {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Maria Silva',
      lastMessage: 'Obrigado!',
      timestamp: '09:30',
      unread: true
    },
    {
      id: '2',
      name: 'João Santos',
      lastMessage: 'Preciso de ajuda',
      timestamp: 'Ontem',
      unread: false
    }
  ])

  const [messages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'customer',
      content: 'Olá, tudo bem?',
      timestamp: '09:00'
    },
    {
      id: 'm2',
      sender: 'agent',
      content: 'Posso ajudar?',
      timestamp: '09:05'
    }
  ])

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
          <input
            type="text"
            placeholder="Ask Meta AI or Search"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        {chats.map((c) => (
          <div
            key={c.id}
            style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', background: c.unread ? '#e6f7ff' : undefined }}
          >
            <div style={{ fontWeight: 'bold' }}>{c.name}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{c.lastMessage}</div>
            <div style={{ fontSize: '12px', textAlign: 'right', color: '#999' }}>{c.timestamp}</div>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
          <strong>Maria Silva</strong>
        </header>
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto', background: '#f5f5f5' }}>
          {messages.map((m) => (
            <div
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
                <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '2px', color: '#666' }}>{m.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
        <footer style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
          <input
            type="text"
            placeholder="Type a message..."
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </footer>
      </main>
    </div>
  )
}
