import { render, screen } from '@testing-library/react'
import Portfolio from '../portfolio'

// Mock the ContactForm component
jest.mock('../contact-form', () => {
  return function MockContactForm() {
    return <div data-testid="contact-form">Contact Form</div>
  }
})

// Mock particlesJS script loading
const mockParticlesJS = jest.fn()
;(global as any).particlesJS = mockParticlesJS

describe('Portfolio Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the header with navigation', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/DEV/)).toBeInTheDocument()
    expect(screen.getByText(/ROCKSTAR/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })

  it('renders the hero section with name and title', () => {
    render(<Portfolio />)
    
    // Name appears in hero and footer, so use getByRole to get the h1
    const heroTitle = screen.getByRole('heading', { level: 1, name: /quinten brady/i })
    expect(heroTitle).toBeInTheDocument()
    expect(screen.getByText(/full stack developer/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /see my work/i })).toBeInTheDocument()
  })

  it('renders statistics boxes', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/19\+/)).toBeInTheDocument()
    expect(screen.getByText(/years experience/i)).toBeInTheDocument()
    expect(screen.getByText(/50\+/)).toBeInTheDocument()
    expect(screen.getByText(/projects completed/i)).toBeInTheDocument()
    expect(screen.getByText(/25\+/)).toBeInTheDocument()
    expect(screen.getByText(/happy clients/i)).toBeInTheDocument()
  })

  it('renders skill categories', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/frontend development/i)).toBeInTheDocument()
    expect(screen.getByText(/backend development/i)).toBeInTheDocument()
    expect(screen.getByText(/database systems/i)).toBeInTheDocument()
    expect(screen.getByText(/devops & cloud/i)).toBeInTheDocument()
    expect(screen.getByText(/mobile development/i)).toBeInTheDocument()
    expect(screen.getByText(/machine learning & ai/i)).toBeInTheDocument()
  })

  it('renders project section', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/featured projects/i)).toBeInTheDocument()
    
    // Projects are rendered as headings
    const projectTitles = screen.getAllByRole('heading', { level: 3 })
    const projectNames = projectTitles.map(h => h.textContent)
    
    expect(projectNames).toContain('Portfolio Website')
    expect(projectNames).toContain('Send Secure Email')
    expect(projectNames).toContain('Task Manager Application')
  })

  it('renders experience timeline', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/professional journey/i)).toBeInTheDocument()
    expect(screen.getByText(/modere/i)).toBeInTheDocument()
    expect(screen.getByText(/ipayables/i)).toBeInTheDocument()
    expect(screen.getByText(/university of california of riverside/i)).toBeInTheDocument()
  })

  it('renders footer with social links', () => {
    render(<Portfolio />)
    
    expect(screen.getByText(/2025 quinten brady/i)).toBeInTheDocument()
    
    const links = screen.getAllByRole('link')
    const socialLinks = links.filter(link => 
      link.getAttribute('href')?.includes('linkedin') || 
      link.getAttribute('href')?.includes('github')
    )
    expect(socialLinks.length).toBeGreaterThan(0)
  })

  it('renders the contact form component', () => {
    render(<Portfolio />)
    
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
  })

  it('includes particles.js container', () => {
    const { container } = render(<Portfolio />)
    
    const particlesContainer = container.querySelector('#particles-js')
    expect(particlesContainer).toBeInTheDocument()
  })

  it('renders mobile menu hamburger', () => {
    const { container } = render(<Portfolio />)
    
    const hamburgerMenu = container.querySelector('#hamb-menu')
    expect(hamburgerMenu).toBeInTheDocument()
    
    const bars = container.querySelectorAll('.bar')
    expect(bars.length).toBe(3)
  })
})
