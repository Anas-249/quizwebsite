import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login — QuizMaster Pro';
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 40px', position: 'relative',
    }}>
      {/* BG blobs */}
      <div style={{
        position: 'fixed', top: '20%', left: '15%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '15%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          padding: '48px 40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', boxShadow: '0 0 30px var(--primary-glow)',
            }}>⚡</div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
              letterSpacing: '0.05em', marginBottom: 8,
            }}>WELCOME BACK</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Sign in to your QuizMaster account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: 8, padding: '16px', fontSize: '1rem', width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Signing In...
                </span>
              ) : '⚡ Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Demo credentials */}
          <div style={{
            background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.3)',
            borderRadius: 10, padding: '14px 16px', marginBottom: 24,
            fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.8,
          }}>
            <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: '0.75rem' }}>
              DEMO ACCOUNT
            </strong>
            <br />
            Email: demo@quizmaster.com<br />
            Password: demo123456
          </div>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
