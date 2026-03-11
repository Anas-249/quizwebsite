import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard — QuizMaster Pro';
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicsRes, scoresRes] = await Promise.all([
        api.get('/api/quiz/topics'),
        api.get('/api/scores/me'),
      ]);
      setTopics(topicsRes.data.topics);
      setScores(scoresRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTopicBestScore = (slug) => {
    if (!scores?.stats?.topicStats?.[slug]) return null;
    return scores.stats.topicStats[slug];
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 80 }}>
        <div className="loader" />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>LOADING DASHBOARD...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', boxShadow: '0 0 20px var(--primary-glow)',
            }}>🎯</div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '0.03em' }}>
                QUIZ DASHBOARD
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 4 }}>
                Welcome back, <strong style={{ color: 'var(--primary)' }}>{user?.name}</strong> — pick a topic to begin
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {scores && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16, marginBottom: 48,
          }}>
            {[
              { label: 'Quizzes Taken', value: scores.stats.totalAttempts, icon: '📋', color: 'var(--primary)' },
              { label: 'Avg Score', value: `${scores.stats.avgPercentage}%`, icon: '📊', color: 'var(--secondary)' },
              { label: 'Best Score', value: `${scores.stats.bestScore}%`, icon: '🏆', color: 'var(--warning)' },
              { label: 'Topics Tried', value: Object.keys(scores.stats.topicStats).length, icon: '🗺️', color: 'var(--success)' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: '24px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Section title */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
            SELECT A TOPIC
          </h2>
          <div className="divider" style={{ marginTop: 8 }} />
        </div>

        {/* Topics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {topics.map((topic) => {
            const topicStat = getTopicBestScore(topic.slug);
            return (
              <div
                key={topic.slug}
                onClick={() => navigate(`/quiz/${topic.slug}`)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = topic.color + '80';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${topic.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Topic Image */}
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={topic.image}
                    alt={topic.name}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                    onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to top, var(--bg-card) 0%, transparent 60%)`,
                  }} />
                  {/* Icon badge */}
                  <div style={{
                    position: 'absolute', top: 14, left: 14,
                    width: 44, height: 44, borderRadius: 12,
                    background: `${topic.color}22`,
                    border: `1px solid ${topic.color}50`,
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>
                    {topic.icon}
                  </div>
                  {/* Difficulty badge */}
                  <div style={{ position: 'absolute', top: 14, right: 14 }}>
                    <span className={`badge badge-${topic.difficulty.toLowerCase()}`}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '20px 24px 24px' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700,
                    letterSpacing: '0.04em', marginBottom: 8, color: 'var(--text-primary)',
                  }}>{topic.name.toUpperCase()}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: 16 }}>
                    {topic.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        ❓ {topic.questionCount} Questions
                      </span>
                    </div>
                    {topicStat ? (
                      <div style={{
                        padding: '4px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
                        background: `${topic.color}18`, color: topic.color, border: `1px solid ${topic.color}40`,
                      }}>
                        Best: {topicStat.best}%
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not attempted</span>
                    )}
                  </div>

                  {/* Progress bar if attempted */}
                  {topicStat && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ background: 'var(--bg-primary)', borderRadius: 999, height: 4 }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          width: `${topicStat.best}%`,
                          background: `linear-gradient(90deg, ${topic.color}, ${topic.color}aa)`,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div style={{
                    marginTop: 18, padding: '10px 0 0',
                    borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ color: topic.color, fontSize: '0.875rem', fontWeight: 600 }}>
                      {topicStat ? 'Retry Quiz' : 'Start Quiz'}
                    </span>
                    <span style={{ color: topic.color, fontSize: '1.1rem' }}>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Scores */}
        {scores?.scores?.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 16 }}>
              RECENT ATTEMPTS
            </h2>
            <div className="divider" style={{ marginBottom: 24 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scores.scores.slice(0, 5).map((s) => (
                <div key={s._id} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: s.percentage >= 70 ? 'rgba(16,185,129,0.12)' : s.percentage >= 40 ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)',
                      border: `1px solid ${s.percentage >= 70 ? 'rgba(16,185,129,0.3)' : s.percentage >= 40 ? 'rgba(245,158,11,0.3)' : 'rgba(244,63,94,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700,
                      color: s.percentage >= 70 ? 'var(--success)' : s.percentage >= 40 ? 'var(--warning)' : 'var(--accent)',
                    }}>
                      {s.grade}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.topic}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{s.percentage}%</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Score</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>{s.score}/{s.totalQuestions}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Correct</div>
                    </div>
                    {s.timeTaken > 0 && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>
                          {Math.floor(s.timeTaken / 60)}:{String(s.timeTaken % 60).padStart(2, '0')}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Time</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link to="/profile" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                View Full History →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
