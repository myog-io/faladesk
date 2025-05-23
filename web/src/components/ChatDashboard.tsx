import { useEffect, useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ChatView from './ChatView'

interface Conversation {
  id: string
  customer_name: string
}

export default function ChatDashboard() {
  const [conversations, setConversations] = useState<Conversation[]>([])

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

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
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
