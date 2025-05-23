import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { AuthProvider } from './lib/AuthProvider'
import { I18nProvider } from './i18n'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GluestackUIProvider>
      <AuthProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </AuthProvider>
    </GluestackUIProvider>
  </React.StrictMode>
)
