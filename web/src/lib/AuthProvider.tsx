import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextProps {
  session: Session | null
  loading: boolean
  signInWithMagicLink: (email: string) => Promise<void>
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signInWithMagicLink = async (email: string) => {
    await supabase.auth.signInWithOtp({ email })
  }

  const signInWithPassword = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string) => {
    await supabase.auth.signUp({ email, password })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signInWithMagicLink,
        signInWithPassword,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
