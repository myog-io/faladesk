import { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, Switch, Button } from 'react-native'
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
  const [language, setLanguage] = useState<Lang>(lang)

  useEffect(() => {
    if (user?.language) setLanguage(user.language as Lang)
  }, [user])

  const handleSubmit = async () => {
    await updateLanguage(language)
    setLang(language)
    onClose()
  }

  return (
    <Modal transparent visible>
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor:'#fff', padding:20, borderRadius:8, minWidth:300 }}>
          <Text style={{fontSize:18, marginBottom:8}}>{t('agent_settings')}</Text>
          <TextInput
            placeholder={t('name')}
            value={name}
            onChangeText={setName}
            style={{ borderWidth:1, borderColor:'#ccc', marginBottom:8, padding:4 }}
          />
          <View style={{flexDirection:'row', alignItems:'center', marginBottom:8}}>
            <Text style={{marginRight:8}}>{t('available')}</Text>
            <Switch value={available} onValueChange={setAvailable} />
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom:8}}>
            <Text style={{marginRight:8}}>{t('notifications')}</Text>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom:8}}>
            <Text style={{marginRight:8}}>{t('language')}</Text>
            <TextInput value={language} onChangeText={l => setLanguage(l as Lang)} style={{borderWidth:1,borderColor:'#ccc',flex:1,padding:4}} />
          </View>
          <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <Button title={t('cancel')} onPress={onClose} />
            <View style={{ width:8 }} />
            <Button title={t('save')} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  )
}
