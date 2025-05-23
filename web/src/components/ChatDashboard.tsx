import { Link, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import ChatView from './ChatView'

interface Conversation {
  id: string
  customer_name: string
  last_message: string
}

const conversations: Conversation[] = [
  { id: '1', customer_name: 'Alice', last_message: 'Hello Alice' },
  { id: '2', customer_name: 'Bob', last_message: 'Hello Bob' }
]

export default function ChatDashboard() {
  const [search, setSearch] = useState('')
  const filtered = conversations.filter((c) =>
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    c.last_message.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderBottom: '1px solid #ddd' }}
        />
        {filtered.map((c) => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
            <Link to={`/chat/${c.id}`}>{c.customer_name}</Link>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/chat/:chatId" element={<ChatView />} />
          <Route path="/" element={<div style={{ padding: '10px' }}>Select a chat</div>} />
        </Routes>
      </main>
    </div>
  )
}
