import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'My Profile — QuizMaster Pro';
    api.get('/api/scores/me')
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getGradeColor = (pct) => {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 50) return 'var(--warning)';
    return 'var(--accent)';
  };

  const formatTime = (s) => {
    if (!s) return '--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 80 }}>
        <div className="loader" />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          LOADING PROFILE...
        </p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const scores = data?.scores || [];
  const topicStats = stats.topicStats || {};

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '40px',
          display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32,
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: 90, height: 90, borderRadius: 22, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 0 30px var(--primary-glow)',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 6 }}>
              {user?.name?.toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
                { label: 'Total Quizzes', value: stats.totalAttempts || 0 },
                { label: 'Best Score', value: `${stats.bestScore || 0}%` },
              ].map((item, i) => (
                <div key={i} style={{ padding: '8px 16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.05em', fontFamily: 'var(--font-display)' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            🎯 Take a Quiz
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Overall Stats */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', gridColumn: 'span 2' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 24 }}>
              OVERALL PERFORMANCE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20 }}>
              {[
                { label: 'Total Attempts', value: stats.totalAttempts || 0, icon: '📋', color: 'var(--primary)' },
                { label: 'Average Score', value: `${stats.avgPercentage || 0}%`, icon: '📊', color: 'var(--secondary)' },
                { label: 'Best Score', value: `${stats.bestScore || 0}%`, icon: '🏆', color: 'var(--warning)' },
                { label: 'Topics Tried', value: Object.keys(topicStats).length, icon: '🗺️', color: 'var(--success)' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '20px 12px', background: 'var(--bg-primary)', borderRadius: 14, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        {Object.keys(topicStats).length > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 24 }}>
              TOPIC PERFORMANCE
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Object.entries(topicStats).map(([slug, ts]) => (
                <div key={slug}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>{ts.topic}</div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{ts.attempts} attempt{ts.attempts > 1 ? 's' : ''}</span>
                      <span style={{ color: getGradeColor(ts.best), fontWeight: 700 }}>Best: {ts.best}%</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Avg: {ts.avg}%</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 999, height: 8 }}>
                    <div style={{
                      height: '100%', borderRadius: 999,
                      width: `${ts.best}%`,
                      background: `linear-gradient(90deg, ${getGradeColor(ts.best)}, ${getGradeColor(ts.best)}88)`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent scores */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 24 }}>
            QUIZ HISTORY
          </h2>
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
              <p>No quizzes taken yet.</p>
              <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 20, fontSize: '0.875rem' }}>
                Take Your First Quiz →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scores.map((s) => (
                <div key={s._id} style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: `${getGradeColor(s.percentage)}18`,
                      border: `1px solid ${getGradeColor(s.percentage)}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700,
                      color: getGradeColor(s.percentage),
                    }}>
                      {s.grade}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.topic}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: getGradeColor(s.percentage), fontSize: '1.1rem' }}>
                      {s.percentage}%
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {s.score}/{s.totalQuestions} correct
                    </span>
                    {s.timeTaken > 0 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ⏱ {formatTime(s.timeTaken)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
