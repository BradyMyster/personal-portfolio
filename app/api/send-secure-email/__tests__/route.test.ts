/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST } from '../route'

// Mock fetch
global.fetch = jest.fn()

describe('/api/send-secure-email API Route', () => {
  const mockEnvVars = {
    AZURE_SEND_SECURE_EMAIL_API_FUNCTION_KEY: 'test-function-key',
    AZURE_SEND_SECURE_EMAIL_API_KEY: 'test-api-key',
    AZURE_SEND_SECURE_EMAIL_URL: 'https://test-function.azurewebsites.net/api/SendEmail',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Set environment variables
    Object.assign(process.env, mockEnvVars)
  })

  afterEach(() => {
    // Clean up environment variables
    Object.keys(mockEnvVars).forEach(key => {
      delete process.env[key]
    })
  })

  it('successfully sends email when Azure Function responds with ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    const requestBody = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'Test message body',
      from: 'sender@example.com',
      name: 'Test Sender',
    }

    const request = new NextRequest('http://localhost:3000/api/send-secure-email', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ ok: true })
    expect(global.fetch).toHaveBeenCalledWith(
      mockEnvVars.AZURE_SEND_SECURE_EMAIL_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-functions-key': mockEnvVars.AZURE_SEND_SECURE_EMAIL_API_FUNCTION_KEY,
        },
        body: JSON.stringify({
          to: requestBody.to,
          subject: requestBody.subject,
          body: `From: ${requestBody.name} <${requestBody.from}>\n\n${requestBody.body}`,
          from: requestBody.from,
          apiKey: mockEnvVars.AZURE_SEND_SECURE_EMAIL_API_KEY,
        }),
      }
    )
  })

  it('returns 500 error when API key is not configured', async () => {
    delete process.env.AZURE_SEND_SECURE_EMAIL_API_KEY

    const request = new NextRequest('http://localhost:3000/api/send-secure-email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
        from: 'sender@example.com',
        name: 'Sender',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Server not configured' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 500 error when Azure Function URL is not configured', async () => {
    delete process.env.AZURE_SEND_SECURE_EMAIL_URL

    const request = new NextRequest('http://localhost:3000/api/send-secure-email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
        from: 'sender@example.com',
        name: 'Sender',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Server not configured' })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns 500 error when Azure Function fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    const request = new NextRequest('http://localhost:3000/api/send-secure-email', {
      method: 'POST',
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
        from: 'sender@example.com',
        name: 'Sender',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Failed to send email' })
  })

  it('formats email body with sender information', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
    })

    const requestBody = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      body: 'Original message',
      from: 'sender@example.com',
      name: 'John Doe',
    }

    const request = new NextRequest('http://localhost:3000/api/send-secure-email', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })

    await POST(request)

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
    const sentPayload = JSON.parse(fetchCall[1].body)

    expect(sentPayload.body).toBe('From: John Doe <sender@example.com>\n\nOriginal message')
  })
})
