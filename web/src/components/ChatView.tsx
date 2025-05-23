import { useParams } from 'react-router-dom'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'
import MessageComposer from './MessageComposer'

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>()
  const { messages, sendMessage } = useRealtimeMessages(chatId || null)

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
      <MessageComposer onSend={sendMessage} />
    </>
  )
}
