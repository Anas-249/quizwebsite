import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/profile', label: 'Profile' },
    ] : []),
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled
          ? 'rgba(8, 11, 20, 0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 0 20px var(--primary-glow)',
            }}>⚡</div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              background: 'linear-gradient(135deg, #fff, var(--primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>QBit</span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive(link.to) ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive(link.to) ? 'rgba(99,102,241,0.12)' : 'transparent',
                transition: 'all 0.2s',
                border: isActive(link.to) ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}}
              onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <div style={{
                  padding: '8px 14px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 8,
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}>
                  👋 {user.name.split(' ')[0]}
                </div>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                  Sign Up
                </Link>
              </>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '4px',
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(8,11,20,0.98)',
            borderTop: '1px solid var(--border)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '12px 16px',
                borderRadius: 8,
                color: isActive(link.to) ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive(link.to) ? 'rgba(99,102,241,0.1)' : 'transparent',
                fontWeight: 500,
              }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
              }}>Logout</button>
            ) : (
              <>
                <Link to="/login" style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Login</Link>
                <Link to="/signup" style={{ padding: '12px 16px', color: 'var(--primary)', fontWeight: 600 }}>Sign Up →</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
