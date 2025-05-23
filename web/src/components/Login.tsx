import { useState } from 'react'
import { Button, Input, InputField, VStack, Text } from '@gluestack-ui/themed'
import { useAuth } from '../lib/AuthProvider'
import { useI18n } from '../i18n'

export default function Login() {
  const { signInWithMagicLink, signInWithPassword } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handlePasswordLogin = async () => {
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
      <Input>
        <InputField
          placeholder={t('email_placeholder')}
          value={email}
          onChangeText={setEmail}
        />
      </Input>
      <Input>
        <InputField
          placeholder={t('password_placeholder')}
          type="password"
          value={password}
          onChangeText={setPassword}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button onPress={handlePasswordLogin} disabled={!email || !password}>
        <Text>{t('login')}</Text>
      </Button>
      <Button onPress={handleMagicLink} disabled={!email}>
        <Text>{t('send_magic_link')}</Text>
      </Button>
    </VStack>
  )
}
