import { createContext, useContext, useEffect, useState } from 'react'
import en from './locales/en.json'
import ptBR from './locales/pt-BR.json'
import es from './locales/es.json'
import { supabase } from './lib/supabase'
import { useUserOrganization } from './lib/useUserOrganization'

export type Lang = 'en' | 'pt-BR' | 'es'

const resources: Record<Lang, Record<string, string>> = { en, 'pt-BR': ptBR, es }

interface I18nContextProps {
  lang: Lang
  t: (key: string) => string
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined)

export function I18nProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const { user } = useUserOrganization()
  const [lang, setLangState] = useState<Lang>(initialLang || 'en')

  useEffect(() => {
    if (initialLang) return
    if (user && user.language) {
      setLangState(user.language as Lang)
    } else {
      const nav = navigator.language
      const l = nav === 'pt-BR' ? 'pt-BR' : nav.startsWith('es') ? 'es' : 'en'
      setLangState(l as Lang)
    }
  }, [user, initialLang])

  const setLang = async (l: Lang) => {
    setLangState(l)
    if (!initialLang && user) {
      await supabase.from('users').update({ language: l }).eq('id', user.id)
    }
  }

  const t = (key: string) => resources[lang][key] || key

  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
