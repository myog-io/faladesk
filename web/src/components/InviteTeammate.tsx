import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { supabase } from '../lib/supabase'
import { useUserOrganization } from '../lib/useUserOrganization'
import { useI18n } from '../i18n'

export default function InviteTeammate() {
  const { user } = useUserOrganization()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const handleSubmit = async () => {
    if (!user) return
    setError(null)
    const { error } = await supabase.functions.invoke('invite-user', {
      body: { email, organization_id: user.organization_id }
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
      setEmail('')
    }
  }

  if (sent) {
    return (
      <VStack space="md" p="$4">
        <Text>{t('invite_sent')}</Text>
      </VStack>
    )
  }

  return (
    <VStack space="md" p="$4">
      <Input>
        <InputField
          placeholder={t('team_email_placeholder')}
          value={email}
          onChangeText={setEmail}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button onPress={handleSubmit}>
        <Text>{t('send_invite')}</Text>
      </Button>
    </VStack>
  )
}
