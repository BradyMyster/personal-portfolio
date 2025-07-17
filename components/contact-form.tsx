'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = {
      to: process.env.NEXT_PUBLIC_CONTACT_TO_EMAIL || '', // Set in .env.local
      subject: form.subject.value,
      body: form.message.value,
      from: form.email.value,
      name: form.toName.value,
    };
    try {
      const res = await fetch('/api/send-secure-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact">
      <h2 className="section-title">Get In Touch</h2>
      <p style={{ color: "#cccccc", marginBottom: 30 }}>
        Have a project in mind or want to discuss potential opportunities? Reach out!
      </p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toName">Your Name</label>
          <input type="text" id="toName" name="name" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" name="email" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" className="form-control" required></textarea>
        </div>
        <button type="submit" className="submit-btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'sent' && <div style={{ color: '#00ffcc', marginTop: 10 }}>Message sent! Thanks for reaching out.</div>}
        {status === 'error' && <div style={{ color: 'red', marginTop: 10 }}>There was an error sending your message.</div>}
      </form>
    </section>
  );
}