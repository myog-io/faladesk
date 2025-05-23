import { useMemo } from 'react'
import { useRealtimeMessages, RealtimeMessage } from '../lib/useRealtimeMessages'

interface Props {
  conversationId: string | null
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function avatarFor(sender: string) {
  if (sender === 'agent' || sender === 'ai') {
    return 'https://via.placeholder.com/32/007bff/ffffff?text=A'
  }
  return 'https://via.placeholder.com/32/cccccc/000000?text=U'
}

function MessageBubble({ message }: { message: RealtimeMessage }) {
  const type = message.metadata?.type || 'text'
  const url = message.metadata?.url
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: message.sender === 'agent' || message.sender === 'ai' ? 'flex-end' : 'flex-start',
        marginBottom: '8px'
      }}
    >
      {message.sender !== 'agent' && message.sender !== 'ai' && (
        <img src={avatarFor(message.sender)} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
      )}
      <div
        style={{
          background: message.sender === 'agent' || message.sender === 'ai' ? '#dcf8c6' : '#fff',
          padding: '8px 12px',
          borderRadius: '8px',
          maxWidth: '70%'
        }}
      >
        {type === 'image' && url ? <img data-testid={`image-${message.id}`} src={url} alt="image" style={{ maxWidth: '100%' }} /> : null}
        {type === 'audio' && url ? <audio data-testid={`audio-${message.id}`} controls src={url} /> : null}
        {type === 'text' || !url ? <div>{message.content}</div> : null}
        <div style={{ fontSize: '10px', textAlign: 'right', color: '#999' }}>{formatTime(message.created_at)}</div>
      </div>
      {(message.sender === 'agent' || message.sender === 'ai') && (
        <img src={avatarFor(message.sender)} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }} />
      )}
    </div>
  )
}

export default function ConversationThread({ conversationId }: Props) {
  const { messages } = useRealtimeMessages(conversationId)

  const grouped = useMemo(() => {
    const groups: { date: string; items: RealtimeMessage[] }[] = []
    messages.forEach((m) => {
      const date = m.created_at.split('T')[0]
      const existing = groups.find((g) => g.date === date)
      if (existing) {
        existing.items.push(m)
      } else {
        groups.push({ date, items: [m] })
      }
    })
    return groups
  }, [messages])

  return (
    <div style={{ padding: '10px', overflowY: 'auto' }}>
      {grouped.map((g) => (
        <div key={g.date}>
          <div data-testid="date-separator" style={{ textAlign: 'center', color: '#666', margin: '10px 0' }}>
            {formatDate(g.date)}
          </div>
          {g.items.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      ))}
    </div>
  )
}
