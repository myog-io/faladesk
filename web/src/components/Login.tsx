import { useState } from 'react'
import { Button, Input, InputField, VStack, Text } from '@gluestack-ui/themed'
import { useAuth } from '../lib/AuthProvider'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      await signIn(email)
      setEmail('')
    }
  }

  return (
    <VStack as="form" space="md" onSubmit={handleSubmit}>
      <Input>
        <InputField
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Input>
      <Button type="submit">
        <Text>Send Magic Link</Text>
      </Button>
    </VStack>
  )
}
