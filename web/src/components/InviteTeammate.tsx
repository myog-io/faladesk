import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { supabase } from '../lib/supabase'
import { useUserOrganization } from '../lib/useUserOrganization'

export default function InviteTeammate() {
  const { user } = useUserOrganization()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
        <Text>Invite sent!</Text>
      </VStack>
    )
  }

  return (
    <VStack as="form" space="md" p="$4" onSubmit={handleSubmit}>
      <Input>
        <InputField
          placeholder="team@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button type="submit">
        <Text>Send Invite</Text>
      </Button>
    </VStack>
  )
}
