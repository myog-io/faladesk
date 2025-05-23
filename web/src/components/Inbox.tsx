import { useEffect, useState } from 'react'
import { Box, Button, Text, VStack } from '@gluestack-ui/themed'
import { useI18n } from '../i18n'

interface Message {
  id: string
  sender: string
  content: string
}

export function Inbox() {
  const [messages, setMessages] = useState<Message[]>([])
  const { t } = useI18n()

  useEffect(() => {
    // placeholder: fetch messages via Supabase
  }, [])

  return (
    <VStack space="md" p="$4">
      {messages.map((m) => (
        <Box key={m.id} bg="$backgroundLight0" p="$2" rounded="$md">
          <Text bold>{m.sender}</Text>
          <Text>{m.content}</Text>
        </Box>
      ))}
      <Button onPress={() => {}}><Text>{t('reply')}</Text></Button>
    </VStack>
  )
}

