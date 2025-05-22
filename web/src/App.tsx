import { VStack } from '@gluestack-ui/themed'
import { useAuth } from './lib/AuthProvider'
import Landing from './components/Landing'
import Login from './components/Login'
import SignUp from './components/SignUp'
import MagicLink from './components/MagicLink'
import CreateCompany from './components/CreateCompany'
import DashboardRedirect from './components/DashboardRedirect'
import { Inbox } from './components/Inbox'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return null
  }

  const path = window.location.pathname

  if (!session) {
    if (path === '/signup') return <SignUp />
    if (path === '/magic-link') return <MagicLink />
    return (
      <VStack space="md" p="$4">
        <Landing />
        <Login />
      </VStack>
    )
  }

  if (path === '/create-company') {
    return <CreateCompany />
  }

  if (path === '/dashboard') {
    return <Inbox />
  }

  return <DashboardRedirect />
}
