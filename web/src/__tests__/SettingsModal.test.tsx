import { render, screen, fireEvent } from '@testing-library/react'
import ChatDashboard from '../components/ChatDashboard'
import { BrowserRouter } from 'react-router-dom'

describe('Settings modal', () => {
  it('opens and closes properly', () => {
    render(
      <BrowserRouter>
        <ChatDashboard />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Settings'))
    expect(screen.getByText('Agent Settings')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Agent Settings')).not.toBeInTheDocument()
  })
})
