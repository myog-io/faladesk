import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Button } from 'react-native'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SettingsModal from './SettingsModal'
import { useI18n } from '../i18n'

interface Conversation {
  id: string
  customer_name: string
}

export default function ChatDashboard() {
  const [showSettings, setShowSettings] = useState(false)
  const { t } = useI18n()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const navigate = useNavigate()

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
    <View style={{ flex: 1 }}>
      <Button title={t('settings')} onPress={() => setShowSettings(true)} />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigate('/invite')} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
          <Text>{t('invite_teammate')}</Text>
        </TouchableOpacity>
        {conversations.map(c => (
          <TouchableOpacity key={c.id} onPress={() => navigate(`/chat/${c.id}`)} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#f0f0f0' }}>
            <Text>{c.customer_name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}
