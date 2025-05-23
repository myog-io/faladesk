import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserOrganization } from '../lib/useUserOrganization'

export default function DashboardRedirect() {
  const { user, loading } = useUserOrganization()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/create-company')
      } else {
        navigate('/')
      }
    }
  }, [user, loading])

  return null
}
