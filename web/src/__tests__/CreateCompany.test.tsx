import { render, screen } from '@testing-library/react'
import CreateCompany from '../components/CreateCompany'
import { vi } from 'vitest'

vi.mock('@gluestack-ui/themed', () => {
  const React = require('react')
  return {
    VStack: (props: any) => <div {...props} />,
    Input: (props: any) => <div {...props} />,
    InputField: (props: any) => <input {...props} />,
    Button: (props: any) => <button {...props} />,
    Text: (props: any) => <span {...props} />,
  }
})

vi.mock('../lib/AuthProvider', () => ({
  useAuth: () => ({ session: { user: { id: '1', email: 'test@example.com' } } })
}))

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: { id: '1' } })) })) }))
    }))
  }
}))

describe('CreateCompany form', () => {
  it('renders name and company fields', () => {
    render(<CreateCompany />)
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('slug')).toBeInTheDocument()
  })
})
