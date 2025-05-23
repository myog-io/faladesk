import { Link, Routes, Route, useMatch } from 'react-router-dom'
import ChatView from './ChatView'
import { useConversations } from '../lib/useConversations'


export default function ChatDashboard() {
  const match = useMatch('/chat/:chatId')
  const activeId = (match && match.params.chatId) || null
  const { conversations, clearUnread } = useConversations(activeId)

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        {conversations.map((c) => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
            <Link to={`/chat/${c.id}`} onClick={() => clearUnread(c.id)}>
              {c.customer_name}
              {c.unread > 0 && (
                <span data-testid="unread-count" style={{ marginLeft: 4 }}>
                  ({c.unread})
                </span>
              )}
            </Link>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/chat/:chatId" element={<ChatView clearUnread={clearUnread} />} />
          <Route path="/" element={<div style={{ padding: '10px' }}>Select a chat</div>} />
        </Routes>
      </main>
    </div>
  )
}
