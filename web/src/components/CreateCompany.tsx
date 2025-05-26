import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthProvider'
import { useI18n } from '../i18n'

export default function CreateCompany() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [userName, setUserName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  const handleSubmit = async () => {
    if (!session) return
    setError(null)
    const orgSlug = slug || name.toLowerCase().replace(/\s+/g, '-')
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({ name, slug: orgSlug })
      .select()
      .single()
    if (orgError) {
      setError(orgError.message)
      return
    }

    const { error: userError } = await supabase.from('users').insert({
      supabase_uid: session.user.id,
      email: session.user.email,
      organization_id: org.id,
      role: 'admin',
      name: userName,
    })

    if (userError) {
      setError(userError.message)
    } else {
      navigate('/chat')
    }
  }

  return (
    <VStack space="md" p="$4">
      <Input>
        <InputField
          placeholder={t('your_name')}
          value={userName}
          onChangeText={setUserName}
        />
      </Input>
      <Input>
        <InputField
          placeholder={t('company_name')}
          value={name}
          onChangeText={setName}
        />
      </Input>
      <Input>
        <InputField
          placeholder={t('slug')}
          value={slug}
          onChangeText={setSlug}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button onPress={handleSubmit}>
        <Text>{t('create_company')}</Text>
      </Button>
    </VStack>
  )
}
