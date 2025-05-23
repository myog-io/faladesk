import { useRef, useState } from 'react'

interface Props {
  onSend: (content: string, metadata?: any) => Promise<void> | void
}

const EMOJIS = ['😀', '😂', '😍', '👍', '🎉']

export default function MessageComposer({ onSend }: Props) {
  const [input, setInput] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])
  const [recording, setRecording] = useState(false)
  const mediaRef = useRef<MediaRecorder | null>(null)

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files))
    }
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []
    recorder.ondataavailable = (ev) => chunks.push(ev.data)
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
      setAttachments((prev) => [...prev, file])
    }
    recorder.start()
    mediaRef.current = recorder
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRef.current?.stop()
    setRecording(false)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() && attachments.length === 0) return

    const metadata: any = {}
    if (attachments.length) {
      metadata.attachments = await Promise.all(
        attachments.map(async (f) => ({ name: f.name, data: await fileToBase64(f) }))
      )
    }

    if (Object.keys(metadata).length) {
      await onSend(input.trim(), metadata)
    } else {
      await onSend(input.trim())
    }

    setInput('')
    setAttachments([])
    setShowEmoji(false)
  }

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji)
    setShowEmoji(false)
  }

  return (
    <footer style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <input
          data-testid="reply-box"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="button" onClick={() => setShowEmoji((v) => !v)}>
          🙂
        </button>
        {showEmoji && (
          <div style={{ position: 'absolute', bottom: '40px', background: '#fff', border: '1px solid #ccc', padding: '4px' }}>
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => addEmoji(e)} style={{ fontSize: '20px', padding: '2px' }}>
                {e}
              </button>
            ))}
          </div>
        )}
        <input data-testid="file-input" type="file" multiple onChange={handleFiles} />
        <button type="button" onClick={recording ? stopRecording : startRecording}>
          {recording ? 'Stop' : 'Record'}
        </button>
      </form>
    </footer>
  )
}
