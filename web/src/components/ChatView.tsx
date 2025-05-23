import { useRoute } from '@react-navigation/native'
import { useRealtimeMessages } from '../lib/useRealtimeMessages'
import MessageComposer from './MessageComposer'
import { useEffect, useState } from 'react'
import { useAuth } from '../lib/AuthProvider'
import { useAgentPresence } from '../lib/useAgentPresence'
import { useI18n } from '../i18n'
import { View, Text, ScrollView } from 'react-native'

interface Message {
  id: string
  sender: string
  content: string
}

export default function ChatView() {
  const route = useRoute<any>()
  const chatId = route.params?.chatId as string | undefined
  const { sendMessage } = useRealtimeMessages(chatId ?? null)
  const [messages, setMessages] = useState<Message[]>([])
  const { session } = useAuth()
  const { status, updateStatus } = useAgentPresence(session?.user.id || null)
  const { t } = useI18n()

  useEffect(() => {
    if (session) {
      updateStatus('online')
      return () => {
        updateStatus('away')
      }
    }
  }, [session])

  const handleSend = (content: string) => {
    setMessages((m) => [...m, { id: Date.now().toString(), sender: 'agent', content }])
    sendMessage(content)
  }

  if (!chatId) return null

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ padding: 10 }}>{t('status')} {status}</Text>
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {messages.map(m => (
          <View key={m.id} style={{ marginBottom: 8 }}>
            <Text>{m.sender}: {m.content}</Text>
          </View>
        ))}
      </ScrollView>
      <MessageComposer onSend={handleSend} />
    </View>
  )
}
