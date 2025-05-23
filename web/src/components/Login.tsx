import { useState } from 'react'
import { Button, Input, InputField, VStack, Text } from '@gluestack-ui/themed'
import { useAuth } from '../lib/AuthProvider'

export default function Login() {
  const { signInWithMagicLink, signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (email && password) {
      try {
        await signInWithPassword(email, password)
        setEmail('')
        setPassword('')
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  const handleMagicLink = async () => {
    setError(null)
    if (email) {
      try {
        await signInWithMagicLink(email)
        setEmail('')
      } catch (err: any) {
        setError(err.message)
      }
    }
  }

  return (
    <VStack space="md" p="$4">
      <VStack as="form" space="md" onSubmit={handlePasswordLogin} data-testid="login-form">
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
          <Text>Login</Text>
        </Button>
      </VStack>
      <Button onPress={handleMagicLink} disabled={!email}>
        <Text>Send Magic Link</Text>
      </Button>
    </VStack>
  )
}
