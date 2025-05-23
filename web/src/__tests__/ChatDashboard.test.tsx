import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'

describe('ChatDashboard routing', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('shows placeholder on root path', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    expect(screen.getByText('Select a chat')).toBeInTheDocument()
  })

  it('navigates to chat when clicking conversation', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Alice'))
    expect(screen.queryByText('Select a chat')).not.toBeInTheDocument()
    expect(screen.getByText('Hello Alice')).toBeInTheDocument()
    // left column still shows other conversation
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
