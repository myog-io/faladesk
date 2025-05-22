import { useEffect } from 'react'
import { useUserOrganization } from '../lib/useUserOrganization'

export default function DashboardRedirect() {
  const { user, loading } = useUserOrganization()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.pathname = '/create-company'
      } else {
        window.location.pathname = '/dashboard'
      }
    }
  }, [user, loading])

  return null
}
