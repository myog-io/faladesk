import { useState } from 'react'
import { VStack, Input, InputField, Button, Text } from '@gluestack-ui/themed'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthProvider'

export default function CreateCompany() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    })

    if (userError) {
      setError(userError.message)
    } else {
      navigate('/')
    }
  }

  return (
    <VStack as="form" space="md" p="$4" onSubmit={handleSubmit}>
      <Input>
        <InputField
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Input>
      <Input>
        <InputField
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </Input>
      {error && <Text color="$error500">{error}</Text>}
      <Button type="submit">
        <Text>Create Company</Text>
      </Button>
    </VStack>
  )
}
