import { useState } from 'react'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [name, setName] = useState('')
  const [available, setAvailable] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [profile, setProfile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Normally would persist settings here
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
        <h2>Agent Settings</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '8px' }}>
            <label>
              Profile Picture
              <input
                data-testid="profile-input"
                type="file"
                onChange={(e) => setProfile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <label>
              Name
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
              Available
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
              Notifications
              <input
                data-testid="notifications-input"
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
