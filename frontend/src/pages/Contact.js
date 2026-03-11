import React, { useState, useEffect } from 'react';

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'support@qbit.pro', color: 'var(--primary)' },
  { icon: '🐦', label: 'Twitter', value: '@QBit', color: 'var(--secondary)' },
  { icon: '💼', label: 'LinkedIn', value: 'QBit', color: '#0077B5' },
  { icon: '📍', label: 'Location', value: 'Chitkra University, Rajpura', color: 'var(--accent)' },
];

const faqs = [
  { q: 'Is QBit free?', a: 'Yes! Creating an account and taking quizzes is completely free. No credit card required.' },
  { q: 'How are scores stored?', a: 'All your quiz scores and performance data are securely stored in our MongoDB database, linked to your account.' },
  { q: 'Can I retake a quiz?', a: 'Absolutely! You can retake any quiz as many times as you want. Questions are shuffled each time.' },
  { q: 'How many questions per quiz?', a: 'Each topic has 10 carefully curated questions. You have 10 minutes to complete each quiz.' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => { document.title = 'Contact — QuizMaster Pro'; }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSent(true); setSending(false); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px',
            borderRadius: 999, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)',
            marginBottom: 24, fontSize: '0.8rem', fontWeight: 600, color: 'var(--secondary)',
            fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
          }}>
            GET IN TOUCH
          </div>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Contact Us</h1>
          <div className="divider" style={{ margin: '0 auto 20px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
            Have a question, suggestion, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32, marginBottom: 64 }}>

          {/* Left panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Contact info */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 24 }}>
                REACH US AT
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {contactInfo.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                      background: `${item.color}15`, border: `1px solid ${item.color}35`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                        {item.label.toUpperCase()}
                      </div>
                      <div style={{ color: item.color, fontWeight: 600, fontSize: '0.9rem', marginTop: 2 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.06))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 16, padding: '24px',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>⚡</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 8 }}>
                FAST RESPONSE
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                We typically respond within 24 hours. For urgent issues, reach out on Twitter for fastest response.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '40px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 12 }}>
                  MESSAGE SENT!
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
                  Thanks for reaching out! We'll get back to you within 24 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn btn-secondary">
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 28 }}>
                  SEND A MESSAGE
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your message..."
                      className="form-input"
                      rows={5}
                      style={{ resize: 'vertical', minHeight: 120 }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={sending} style={{ padding: '15px', fontSize: '1rem' }}>
                    {sending ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                        Sending...
                      </span>
                    ) : '📨 Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <div className="divider" style={{ margin: '12px auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: '28px 32px' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem', color: 'var(--primary)' }}>
                  {faq.q}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
