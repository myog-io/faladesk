import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const handleSubmit = async () => {
    setError(null)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: 'magic-link' }
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
        <Text>{t('check_confirm_email')}</Text>
      </VStack>
    )
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
      <Button onPress={handleSubmit} disabled={!email || !password}>
        <Text>{t('sign_up')}</Text>
      </Button>
    </VStack>
  )
}
