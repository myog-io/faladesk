import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import ChatView from './ChatView'
import SettingsModal from './SettingsModal'
import { useI18n } from '../i18n'

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
  const { t } = useI18n()
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      <button
        style={{ position: 'absolute', top: '10px', right: '10px' }}
        onClick={() => setShowSettings(true)}
      >
        {t('settings')}
      </button>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <aside style={{ width: '30%', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          <Link to="/invite">{t('invite_teammate')}</Link>
        </div>
        {conversations.map((c) => (
          <div key={c.id} style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
            <Link to={`/chat/${c.id}`}>{c.customer_name}</Link>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/chat/:chatId" element={<ChatView />} />
          <Route path="/" element={<div style={{ padding: '10px' }}>{t('select_chat')}</div>} />
        </Routes>
      </main>
    </div>
  )
}
