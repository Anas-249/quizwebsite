import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const team = [
  { name: 'Alex Chen', role: 'Founder & Lead Developer', emoji: '👨‍💻', bg: 'var(--primary)' },
  { name: 'Priya Sharma', role: 'Content & Questions Lead', emoji: '📚', bg: '#10B981' },
  { name: 'Marcus Webb', role: 'UX & Design', emoji: '🎨', bg: '#F59E0B' },
];

const techStack = [
  { name: 'MongoDB', desc: 'NoSQL database for scores & users', icon: '🍃', color: '#10B981' },
  { name: 'Express.js', desc: 'Fast, minimalist web framework', icon: '⚡', color: '#F59E0B' },
  { name: 'React', desc: 'Dynamic, component-based UI', icon: '⚛️', color: '#06B6D4' },
  { name: 'Node.js', desc: 'JavaScript runtime for the backend', icon: '🟢', color: '#84CC16' },
  { name: 'JWT Auth', desc: 'Secure token-based authentication', icon: '🔐', color: '#8B5CF6' },
  { name: 'Mongoose', desc: 'Elegant MongoDB object modeling', icon: '🗄️', color: '#EF4444' },
];

const About = () => {
  useEffect(() => { document.title = 'About — QuizMaster Pro'; }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px',
            borderRadius: 999, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            marginBottom: 24, fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)',
            fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
          }}>
            ABOUT US
          </div>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Built for Knowledge Seekers</h1>
          <div className="divider" style={{ margin: '0 auto 20px' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            QuizMaster Pro is a full-stack MERN application designed to make learning engaging, competitive, and trackable. We believe knowledge grows best when it's tested.
          </p>
        </div>

        {/* Mission */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 24, padding: '48px 40px', marginBottom: 60,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40,
        }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 16 }}>
              OUR MISSION
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              We set out to build the quiz platform we always wished existed — one that combines beautiful design with real learning outcomes. Every question is carefully crafted to challenge and educate.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 16 }}>
              OUR VISION
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              A world where anyone can measure, track, and grow their knowledge — across every domain from science to sports. Learning should be a journey you can see progress on.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">Tech Stack</h2>
            <div className="divider" style={{ margin: '12px auto' }} />
            <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>Powered by the MERN stack — modern, scalable, and fast.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {techStack.map((tech, i) => (
              <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                  background: `${tech.color}18`, border: `1px solid ${tech.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                }}>
                  {tech.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 6, color: tech.color }}>
                    {tech.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="section-title">The Team</h2>
            <div className="divider" style={{ margin: '12px auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {team.map((member, i) => (
              <div key={i} className="card" style={{ padding: '36px', textAlign: 'center' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 18, margin: '0 auto 16px',
                  background: `${member.bg}20`, border: `2px solid ${member.bg}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
                }}>
                  {member.emoji}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>
                  {member.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">
            🚀 Join QuizMaster Pro Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
