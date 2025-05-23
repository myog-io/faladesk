import { useState, useEffect } from 'react'
import { useI18n, Lang } from '../i18n'
import { useUserOrganization } from '../lib/useUserOrganization'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { t, lang, setLang } = useI18n()
  const { user, updateLanguage } = useUserOrganization()
  const [name, setName] = useState('')
  const [available, setAvailable] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [profile, setProfile] = useState<File | null>(null)
  const [language, setLanguage] = useState<Lang>(lang)

  useEffect(() => {
    if (user?.language) setLanguage(user.language as Lang)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateLanguage(language)
    setLang(language)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
        <h2>{t('agent_settings')}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '8px' }}>
            <label>
              {t('profile_picture')}
              <input
                data-testid="profile-input"
                type="file"
                onChange={(e) => setProfile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label>
              {t('name')}
              <input
                data-testid="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label>
              {t('available')}
              <input
                data-testid="available-input"
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
            </label>
          </div>
          <div style={{ marginBottom: '8px' }}>
          <label>
            {t('notifications')}
            <input
              data-testid="notifications-input"
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </label>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <label>
            {t('language') || 'Language'}
            <select
              data-testid="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Lang)}
            >
              <option value="en">English</option>
              <option value="pt-BR">Português (Brasil)</option>
              <option value="es">Español</option>
            </select>
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" onClick={onClose}>
            {t('cancel')}
          </button>
          <button type="submit">{t('save')}</button>
        </div>
        </form>
      </div>
    </div>
  )
}
