# Personal Portfolio - AI Agent Instructions

## Architecture Overview
This is a Next.js 15 App Router portfolio site with a single-page application structure. The main component is [`portfolio.tsx`](../components/portfolio.tsx) which contains all portfolio sections rendered client-side. The app uses external CDN scripts (GSAP, particles.js) loaded via Next.js Script component in [`layout.tsx`](../app/layout.tsx).

**Data Flow**: Contact form → [`contact-form.tsx`](../components/contact-form.tsx) → Next.js API route [`/api/send-secure-email/route.ts`](../app/api/send-secure-email/route.ts) → Azure Function (external)

## Critical Patterns

### Client-Side Script Loading
External libraries (particles.js, GSAP, ScrollTrigger) are loaded via CDN. Use the dynamic loading pattern from [`portfolio.tsx`](../components/portfolio.tsx#L6-L19):
```typescript
function loadParticlesScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if ((window as any).particlesJS) return resolve();
    // ... creates and loads script
  });
}
```

### TypeScript for External Libraries
Custom `.d.ts` files provide type safety for CDN scripts:
- [`particles.d.ts`](../particles.d.ts) - declares `particlesJS` global function
- When adding new external scripts, create similar declaration files

### Client Components
All interactive components use `"use client"` directive ([`portfolio.tsx`](../components/portfolio.tsx#L1), [`contact-form.tsx`](../components/contact-form.tsx#L1)). The app doesn't use server components for rendering.

### Security Configuration
[`next.config.js`](../next.config.js) enforces strict security headers:
- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy: frame-ancestors 'self'`
- Disabled ESLint during builds (`ignoreDuringBuilds: true`)

## Environment Configuration

### Required Environment Variables
Set in `local.settings.json` and `.env.local`:
- `NEXT_PUBLIC_CONTACT_TO_EMAIL` - Recipient email for contact form
- `AZURE_SEND_SECURE_EMAIL_URL` - Azure Function endpoint
- `AZURE_SEND_SECURE_EMAIL_API_KEY` - API key for email service
- `AZURE_SEND_SECURE_EMAIL_API_FUNCTION_KEY` - Azure Function authentication

### Azure Functions Integration
The `host.json` indicates this project may deploy to Azure. The contact form routes through an Azure Function for secure email sending ([`route.ts`](../app/api/send-secure-email/route.ts#L4-L27)).

## Developer Workflows

### Package Manager
**Always use `pnpm`** - enforced in [`package.json`](../package.json#L12) with `packageManager: "pnpm@10.12.1"`

### Development Commands
```bash
pnpm dev      # Start dev server (default: localhost:3000)
pnpm build    # Production build
pnpm start    # Serve production build
```

### No Testing Framework
Tests are not configured (`test` script exits with error). If adding tests, integrate with Next.js testing conventions.

## Component Structure

### Single Component Architecture
[`portfolio.tsx`](../components/portfolio.tsx) is a 417-line monolithic component containing all portfolio sections:
- Hero with particles.js background
- Skills with animated progress bars
- Projects gallery
- Contact form integration

When modifying, be aware of:
- `useEffect` hooks for DOM manipulation (particles, smooth scroll, observers)
- Event listeners for mobile menu and animations
- IntersectionObserver for fade-in effects

### Form Handling
[`contact-form.tsx`](../components/contact-form.tsx) manages its own state with React hooks:
- Status states: `'idle' | 'sending' | 'sent' | 'error'`
- Async POST to `/api/send-secure-email`
- Form reset on success

## Styling
All styles in [`styles/global.css`](../styles/global.css). No CSS modules or Tailwind. The design uses:
- Dark theme with purple/blue gradients
- Cyan accent color (`#00ffcc`)
- Custom fade-in animations
- Mobile-responsive with hamburger menu

## Key Constraints
- TypeScript strict mode is **disabled** ([`tsconfig.json`](../tsconfig.json#L13))
- No ESLint checks during build
- Empty `lib/` directory - utility functions not centralized
- No test suite - manual testing only
