import { useState } from 'react'
import { View, TextInput, Button } from 'react-native'

interface Props {
  onSend: (content: string) => Promise<void> | void
}

export default function MessageComposer({ onSend }: Props) {
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await onSend(input.trim())
    setInput('')
  }

  return (
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <TextInput
        style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
        value={input}
        onChangeText={setInput}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  )
}
