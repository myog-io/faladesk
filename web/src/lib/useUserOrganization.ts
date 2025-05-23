import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthProvider'

interface UserRow {
  id: string
  email: string
  organization_id: string
  role: string
  language?: string
  organization?: {
    id: string
    name: string
    slug: string
  }
}

export function useUserOrganization() {
  const { session } = useAuth()
  const [user, setUser] = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select(
          'id, email, organization_id, role, language, organization:organizations(id, name, slug)'
        )
        .eq('supabase_uid', session.user.id)
        .maybeSingle()

      if (error) {
        setUser(null)
      } else {
        setUser(data as UserRow)
      }
      setLoading(false)
    }
    fetchData()
  }, [session])

  const updateLanguage = async (lang: string) => {
    if (!user) return
    await supabase.from('users').update({ language: lang }).eq('id', user.id)
    setUser({ ...user, language: lang })
  }

  return { user, loading, updateLanguage }
}
