import { render, screen } from '@testing-library/react'
import Landing from '../components/Landing'

// Basic sample test to ensure Vitest picks up tests in src/__tests__
describe('Sample component test', () => {
  it('renders landing title', () => {
    render(<Landing />)
    expect(screen.getByText('Faladesk')).toBeInTheDocument()
  })
})
