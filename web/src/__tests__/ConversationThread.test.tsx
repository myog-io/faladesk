import { render, screen } from '@testing-library/react'
import ConversationThread from '../components/ConversationThread'
import { vi } from 'vitest'

const sampleMessages = [
  {
    id: '1',
    sender: 'customer',
    content: 'hi',
    metadata: { type: 'text' },
    created_at: '2023-01-01T10:00:00Z'
  },
  {
    id: '2',
    sender: 'agent',
    content: 'hello',
    metadata: { type: 'text' },
    created_at: '2023-01-01T10:05:00Z'
  },
  {
    id: '3',
    sender: 'customer',
    content: null,
    metadata: { type: 'image', url: 'img.jpg' },
    created_at: '2023-01-02T12:00:00Z'
  },
  {
    id: '4',
    sender: 'agent',
    content: null,
    metadata: { type: 'audio', url: 'audio.mp3' },
    created_at: '2023-01-02T13:00:00Z'
  }
]

vi.mock('../lib/useRealtimeMessages', () => ({
  useRealtimeMessages: () => ({
    messages: sampleMessages,
    sendMessage: vi.fn()
  })
}))

describe('ConversationThread', () => {
  it('renders date separators and different message types', () => {
    render(<ConversationThread conversationId="1" />)
    const separators = screen.getAllByTestId('date-separator')
    expect(separators.length).toBe(2)
    expect(screen.getByTestId('image-3')).toHaveAttribute('src', 'img.jpg')
    expect(screen.getByTestId('audio-4')).toHaveAttribute('src', 'audio.mp3')
  })
})
