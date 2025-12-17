import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../contact-form'

// Mock fetch
global.fetch = jest.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the contact form with all fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
  })

  it('renders the section title', () => {
    render(<ContactForm />)
    
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument()
  })

  it('submits form data successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    })

    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/your email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    expect(global.fetch).toHaveBeenCalledWith('/api/send-secure-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: '',
        subject: 'Test Subject',
        body: 'Test message',
        from: 'john@example.com',
        name: 'John Doe',
      }),
    })
  })

  it('displays error message when submission fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/your email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /send message/i })
    
    fireEvent.change(nameInput, { target: { value: 'Test' } })
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } })
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/there was an error/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows sending state during submission', async () => {
    let resolveSubmit: (value: any) => void
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => {
        resolveSubmit = resolve
      })
    )

    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /send message/i })
    const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/your email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    
    fireEvent.change(nameInput, { target: { value: 'Test' } })
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Subject' } })
    fireEvent.change(messageInput, { target: { value: 'Message' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument()
    })
    expect(submitButton).toBeDisabled()
  })

  it('resets form after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    render(<ContactForm />)
    
    const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/your email/i) as HTMLInputElement
    const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement
    const submitButton = screen.getByRole('button', { name: /send message/i })

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(subjectInput, { target: { value: 'Subject' } })
    fireEvent.change(messageInput, { target: { value: 'Message' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    // Form should be reset
    await waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(emailInput.value).toBe('')
    })
  })
})
