import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stats = [
  { label: 'Quiz Topics', value: '8+', icon: '🎯' },
  { label: 'Questions', value: '80+', icon: '❓' },
  { label: 'Active Users', value: '10K+', icon: '👥' },
  { label: 'Quizzes Taken', value: '50K+', icon: '🏆' },
];

const features = [
  { icon: '⚡', title: 'Instant Results', desc: 'Get your score and detailed feedback the moment you submit your answers.' },
  { icon: '📊', title: 'Track Progress', desc: 'Visualize your performance history and watch yourself improve over time.' },
  { icon: '🎯', title: '8 Quiz Topics', desc: 'From Science to Sports, History to Tech — find your area of expertise.' },
  { icon: '⏱️', title: 'Timed Challenges', desc: 'Race against the clock to test not just knowledge but quick thinking.' },
  { icon: '🏅', title: 'Graded Performance', desc: 'Earn grades A+ through F based on your accuracy and speed.' },
  { icon: '🔒', title: 'Secure Accounts', desc: 'Your data and scores are stored safely with JWT authentication.' },
];

const topics = [
  { slug: 'science', name: 'Science', icon: '🔬', color: '#06B6D4' },
  { slug: 'technology', name: 'Tech', icon: '💻', color: '#8B5CF6' },
  { slug: 'history', name: 'History', icon: '📜', color: '#F59E0B' },
  { slug: 'geography', name: 'Geography', icon: '🌍', color: '#10B981' },
  { slug: 'mathematics', name: 'Maths', icon: '➗', color: '#EF4444' },
  { slug: 'sports', name: 'Sports', icon: '⚽', color: '#F97316' },
  { slug: 'movies', name: 'Movies', icon: '🎬', color: '#6366F1' },
  { slug: 'general', name: 'General', icon: '🎯', color: '#EC4899' },
];

const Home = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.title = 'QuizMaster Pro - Challenge Your Mind';
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 0 }}>
      {/* ========== HERO ========== */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG Blobs */}
        <div style={{
          position: 'absolute', top: '15%', left: '10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 999,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 32,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.1s',
          }}>
            <span style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              ⚡ THE ULTIMATE QUIZ PLATFORM
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            marginBottom: 24,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.2s',
          }}>
            <span style={{ color: 'var(--text-primary)' }}>CHALLENGE</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>YOUR MIND</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>MASTER EVERY</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), #F97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>TOPIC</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 auto 48px',
            lineHeight: 1.7,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.3s',
          }}>
            Test your knowledge across Science, History, Technology, Sports and more.
            Track your performance, climb the ranks, and prove your expertise.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.4s',
          }}>
            <Link to={user ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg">
              {user ? '🎯 Go to Dashboard' : '🚀 Start Free — No Card Needed'}
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              Learn More
            </Link>
          </div>

          {/* Topic Pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 60,
            opacity: visible ? 1 : 0, transition: 'all 0.6s ease 0.5s',
          }}>
            {topics.map(t => (
              <div key={t.slug} style={{
                padding: '8px 16px', borderRadius: 999,
                background: `${t.color}18`,
                border: `1px solid ${t.color}40`,
                fontSize: '0.85rem', fontWeight: 600, color: t.color,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {t.icon} {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(99,102,241,0.03)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 className="section-title">Why QuizMaster Pro?</h2>
            <div className="divider" style={{ margin: '12px auto' }} />
            <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
              Built for knowledge seekers who take their learning seriously.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.03em' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.08))',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 28, padding: '60px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -50, right: -50, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: 16, letterSpacing: '0.02em' }}>
            READY TO TEST YOUR KNOWLEDGE?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 36, maxWidth: 500, margin: '0 auto 36px' }}>
            Join thousands of learners. Sign up free and start your first quiz in under 60 seconds.
          </p>
          <Link to={user ? '/dashboard' : '/signup'} className="btn btn-primary btn-lg">
            {user ? '🎯 Browse Quiz Topics' : '⚡ Create Free Account'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>QUIZMASTER PRO</span>
        {' — '}Built with MERN Stack · {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Home;
