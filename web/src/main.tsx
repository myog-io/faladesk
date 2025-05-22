import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { AuthProvider } from './lib/AuthProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GluestackUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GluestackUIProvider>
  </React.StrictMode>
)
