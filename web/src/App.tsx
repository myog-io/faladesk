import { VStack, Text } from '@gluestack-ui/themed'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './lib/AuthProvider'
import Landing from './components/Landing'
import Login from './components/Login'
import SignUp from './components/SignUp'
import MagicLink from './components/MagicLink'
import CreateCompany from './components/CreateCompany'
import InviteTeammate from './components/InviteTeammate'
import DashboardRedirect from './components/DashboardRedirect'
import ChatDashboard from './components/ChatDashboard'

export default function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <VStack p="$4">
        <Text>Loading...</Text>
      </VStack>
    )
  }

  if (!session) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/magic-link" element={<MagicLink />} />
          <Route
            path="*"
            element={(
              <VStack space="md" p="$4">
                <Landing />
                <Login />
              </VStack>
            )}
          />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/invite" element={<InviteTeammate />} />
        <Route path="/chat/*" element={<ChatDashboard />} />
        <Route path="*" element={<DashboardRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
