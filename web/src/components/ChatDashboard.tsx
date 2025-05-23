import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import ChatView from './ChatView'
import SettingsModal from './SettingsModal'

interface Conversation {
  id: string
  customer_name: string
}

const conversations: Conversation[] = [
  { id: '1', customer_name: 'Alice' },
  { id: '2', customer_name: 'Bob' }
]

export default function ChatDashboard() {
  const [showSettings, setShowSettings] = useState(false)
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={() => setShowSettings(true)}
      >
        Settings
      </button>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        {conversations.map((c) => (
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
