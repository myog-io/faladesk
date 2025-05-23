import { useParams } from 'react-router-dom'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'
import ConversationThread from './ConversationThread'
import MessageComposer from './MessageComposer'

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>()

  const { sendMessage } = useRealtimeMessages(chatId ?? null)

  if (!chatId) return null

  return (
    <>
      <ConversationThread conversationId={chatId} />
      <MessageComposer onSend={sendMessage} />
    </>
  )
}
