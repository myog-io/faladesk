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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <VStack as="form" space="md" p="$4" onSubmit={handleSubmit}>
      <Input>
        <InputField
          placeholder={t('team_email_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button type="submit">
        <Text>{t('send_invite')}</Text>
      </Button>
    </VStack>
  )
}
