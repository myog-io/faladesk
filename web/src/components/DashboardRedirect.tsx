import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useUserOrganization } from '../lib/useUserOrganization'

export default function DashboardRedirect() {
  const { user, loading } = useUserOrganization()
  const navigation = useNavigation()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigation.navigate('CreateCompany' as never)
      } else {
        navigation.navigate('Chat' as never)
      }
    }
  }, [user, loading])

  return null
}
