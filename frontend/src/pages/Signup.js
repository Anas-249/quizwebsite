import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Sign Up — QuizMaster Pro';
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too Short', color: '#EF4444', width: '20%' };
    if (p.length < 8) return { label: 'Weak', color: '#F97316', width: '40%' };
    if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#F59E0B', width: '65%' };
    return { label: 'Strong', color: '#10B981', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 40px', position: 'relative',
    }}>
      <div style={{
        position: 'fixed', top: '10%', right: '10%', width: 450, height: 450,
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '48px 40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
              background: 'linear-gradient(135deg, var(--accent), #F97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', boxShadow: '0 0 30px var(--accent-glow)',
            }}>🚀</div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
              letterSpacing: '0.05em', marginBottom: 8,
            }}>CREATE ACCOUNT</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Join thousands of quiz enthusiasts
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 24 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="form-input"
                autoComplete="name"
              />
            </div>

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
                placeholder="At least 6 characters"
                className="form-input"
                autoComplete="new-password"
              />
              {/* Strength meter */}
              {strength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 999, height: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      width: strength.width, background: strength.color,
                      transition: 'all 0.3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: strength.color, marginTop: 4, display: 'block' }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="form-input"
                autoComplete="new-password"
                style={{
                  borderColor: form.confirm && form.confirm !== form.password
                    ? 'var(--accent)'
                    : form.confirm && form.confirm === form.password
                    ? 'var(--success)'
                    : undefined,
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-accent"
              disabled={loading}
              style={{ marginTop: 8, padding: '16px', fontSize: '1rem', width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Creating Account...
                </span>
              ) : '🚀 Create Account — It\'s Free!'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 28 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign in →
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

export default Signup;
