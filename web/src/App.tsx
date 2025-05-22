import { VStack } from 'gluestack-ui'
import { useAuth } from './lib/AuthProvider'
import Landing from './components/Landing'
import Login from './components/Login'
import { Inbox } from './components/Inbox'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!session) {
    return (
      <VStack space="md" p="$4">
        <Landing />
        <Login />
      </VStack>
    )
  }

  return <Inbox />
}
