import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/magic-link` }
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
      setEmail('')
      setPassword('')
    }
  }

  if (sent) {
    return (
      <VStack space="md" p="$4">
        <Text>Check your inbox to confirm your email.</Text>
      </VStack>
    )
  }

  return (
    <VStack as="form" space="md" p="$4" onSubmit={handleSubmit}>
      <Input>
        <InputField
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Input>
      <Input>
        <InputField
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button type="submit">
        <Text>Sign Up</Text>
      </Button>
    </VStack>
  )
}
