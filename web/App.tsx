import { VStack, Text, GluestackUIProvider } from '@gluestack-ui/themed'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, useAuth } from './src/lib/AuthProvider'
import { I18nProvider } from './src/i18n'
import Landing from './src/components/Landing'
import Login from './src/components/Login'
import SignUp from './src/components/SignUp'
import MagicLink from './src/components/MagicLink'
import CreateCompany from './src/components/CreateCompany'
import InviteTeammate from './src/components/InviteTeammate'
import DashboardRedirect from './src/components/DashboardRedirect'
import ChatDashboard from './src/components/ChatDashboard'
import ChatView from './src/components/ChatView'

const Stack = createNativeStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="MagicLink" component={MagicLink} />
    </Stack.Navigator>
  )
}

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatDashboard} />
      <Stack.Screen name="ChatView" component={ChatView} />
      <Stack.Screen name="CreateCompany" component={CreateCompany} />
      <Stack.Screen name="Invite" component={InviteTeammate} />
      <Stack.Screen name="DashboardRedirect" component={DashboardRedirect} />
    </Stack.Navigator>
  )
}

function Navigation() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <VStack p="$4">
        <Text>Loading...</Text>
      </VStack>
    )
  }

  return (
    <NavigationContainer>
      {session ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <GluestackUIProvider>
      <AuthProvider>
        <I18nProvider>
          <Navigation />
        </I18nProvider>
      </AuthProvider>
    </GluestackUIProvider>
  )
}
