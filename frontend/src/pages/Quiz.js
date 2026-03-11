import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const QUIZ_TIME = 60 * 10; // 10 minutes

const Quiz = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({}); // { questionId: answer }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    document.title = `Quiz: ${topic} — QuizMaster Pro`;
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [topic]);

  useEffect(() => {
    if (!quizData || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [quizData, result]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/api/quiz/${topic}`);
      setQuizData(res.data);
      startTimeRef.current = Date.now();
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, answer) => {
    if (result) return;
    setSelected((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting || result) return;
    clearInterval(timerRef.current);
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setSubmitting(true);

    const answers = quizData.questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: selected[q.id] || null,
    }));

    try {
      const submitRes = await api.post(`/api/quiz/${topic}/submit`, { answers, timeTaken });
      const { score, totalQuestions, percentage, results, answers: correctAnswers } = submitRes.data;

      // Build correctAnswerMap
      const correctMap = {};
      correctAnswers.forEach((a) => { correctMap[a.id] = a.correctAnswer; });

      setResult({ score, totalQuestions, percentage, timeTaken, results, correctMap });

      // Save score
      await api.post('/api/scores', {
        topic: quizData.topic.name,
        topicSlug: topic,
        score,
        totalQuestions,
        percentage,
        timeTaken,
        answers: results,
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [quizData, selected, topic, submitting, result]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 120) return 'var(--success)';
    if (timeLeft > 60) return 'var(--warning)';
    return 'var(--accent)';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, paddingTop: 80 }}>
        <div className="loader" />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          LOADING QUIZ...
        </p>
      </div>
    );
  }

  if (!quizData) return null;

  // ========= RESULTS SCREEN =========
  if (result) {
    const grade = result.percentage >= 95 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 65 ? 'B' : result.percentage >= 50 ? 'C' : result.percentage >= 35 ? 'D' : 'F';
    const gradeColor = result.percentage >= 65 ? 'var(--success)' : result.percentage >= 40 ? 'var(--warning)' : 'var(--accent)';
    const msg = result.percentage >= 80 ? '🎉 Excellent Work!' : result.percentage >= 60 ? '👍 Good Job!' : result.percentage >= 40 ? '📚 Keep Practicing!' : '💪 Don\'t Give Up!';

    return (
      <div style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Result Card */}
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${gradeColor}18, transparent)`,
              borderBottom: '1px solid var(--border)',
              padding: '48px 40px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{msg.split(' ')[0]}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 24 }}>
                QUIZ COMPLETE — {quizData.topic.name.toUpperCase()}
              </h2>
              {/* Grade circle */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto 24px',
                border: `4px solid ${gradeColor}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: `${gradeColor}10`,
                boxShadow: `0 0 40px ${gradeColor}30`,
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: gradeColor }}>{grade}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, color: gradeColor }}>
                {result.percentage}%
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: 8 }}>{msg.slice(2)}</p>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              borderBottom: '1px solid var(--border)',
            }}>
              {[
                { label: 'Correct', value: `${result.score}/${result.totalQuestions}`, icon: '✅' },
                { label: 'Accuracy', value: `${result.percentage}%`, icon: '🎯' },
                { label: 'Time', value: formatTime(result.timeTaken), icon: '⏱️' },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '28px 20px', textAlign: 'center',
                  borderRight: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Review button */}
            <div style={{ padding: '24px 40px', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
              <button onClick={() => setRevealed(!revealed)} className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                {revealed ? '🙈 Hide Review' : '👁️ Review Answers'}
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                🏠 Back to Dashboard
              </button>
              <button onClick={() => { setResult(null); setSelected({}); setCurrentQ(0); setTimeLeft(QUIZ_TIME); fetchQuiz(); }} className="btn" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.875rem' }}>
                🔄 Retry Quiz
              </button>
            </div>

            {/* Answer review */}
            {revealed && (
              <div style={{ padding: '32px 40px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  ANSWER REVIEW
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {quizData.questions.map((q, i) => {
                    const userAns = selected[q.id];
                    const correctAns = result.correctMap[q.id];
                    const isCorrect = userAns === correctAns;
                    return (
                      <div key={q.id} style={{
                        background: isCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)',
                        border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'}`,
                        borderRadius: 12, padding: '16px 20px',
                      }}>
                        <p style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.95rem' }}>
                          <span style={{ color: 'var(--text-muted)', marginRight: 8 }}>Q{i + 1}.</span>
                          {q.question}
                        </p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {q.options.map((opt) => {
                            const isUserAns = opt === userAns;
                            const isCorrectAns = opt === correctAns;
                            let bg = 'var(--bg-primary)', border = 'var(--border)', color = 'var(--text-secondary)';
                            if (isCorrectAns) { bg = 'rgba(16,185,129,0.12)'; border = 'rgba(16,185,129,0.4)'; color = '#6EE7B7'; }
                            else if (isUserAns && !isCorrectAns) { bg = 'rgba(244,63,94,0.12)'; border = 'rgba(244,63,94,0.4)'; color = '#FDA4AF'; }
                            return (
                              <span key={opt} style={{
                                padding: '6px 14px', borderRadius: 999, fontSize: '0.82rem', fontWeight: 500,
                                background: bg, border: `1px solid ${border}`, color,
                              }}>
                                {isCorrectAns && '✓ '}{isUserAns && !isCorrectAns && '✗ '}{opt}
                              </span>
                            );
                          })}
                        </div>
                        {!userAns && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 8 }}>⚪ Not answered</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========= QUIZ SCREEN =========
  const question = quizData.questions[currentQ];
  const progress = ((currentQ + 1) / quizData.questions.length) * 100;
  const answeredCount = Object.keys(selected).length;

  return (
    <div style={{ minHeight: '100vh', padding: '90px 24px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 76, zIndex: 100,
          background: 'rgba(8,11,20,0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)', borderRadius: 14,
          padding: '14px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>{quizData.topic.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                {quizData.topic.name.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Question {currentQ + 1} of {quizData.questions.length}
              </div>
            </div>
          </div>
          {/* Timer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 999,
            background: `${getTimerColor()}15`, border: `1px solid ${getTimerColor()}40`,
          }}>
            <span style={{ fontSize: '1rem' }}>⏱️</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: getTimerColor() }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* Answered count */}
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{answeredCount}</span>/{quizData.questions.length} answered
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 999, height: 6, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 999,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Question card */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '40px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          marginBottom: 24,
        }}>
          {/* Question number */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999,
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
            marginBottom: 20, fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)',
            fontFamily: 'var(--font-display)', letterSpacing: '0.05em',
          }}>
            QUESTION {currentQ + 1}
          </div>

          <h2 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 600, lineHeight: 1.5, marginBottom: 32, color: 'var(--text-primary)' }}>
            {question.question}
          </h2>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {question.options.map((opt, idx) => {
              const isSelected = selected[question.id] === opt;
              const labels = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(question.id, opt)}
                  style={{
                    width: '100%', padding: '16px 20px',
                    border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border)',
                    borderRadius: 12,
                    background: isSelected ? 'rgba(99,102,241,0.12)' : 'var(--bg-primary)',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-body)', fontSize: '1rem',
                    boxShadow: isSelected ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                      e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-primary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <span style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    border: isSelected ? 'none' : '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700,
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}>
                    {labels[idx]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem' }}
          >
            ← Previous
          </button>

          {/* Question dots */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            {quizData.questions.map((q, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: i === currentQ
                    ? 'var(--primary)'
                    : selected[q.id]
                    ? 'rgba(16,185,129,0.5)'
                    : 'var(--bg-card)',
                  border: i === currentQ ? '2px solid var(--primary)' : '1px solid var(--border)',
                  color: i === currentQ ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.7rem', fontFamily: 'var(--font-display)',
                  transition: 'all 0.2s',
                  transform: i === currentQ ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQ === quizData.questions.length - 1 ? (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="btn btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              {submitting ? 'Submitting...' : '🏁 Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ((q) => Math.min(quizData.questions.length - 1, q + 1))}
              className="btn btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              Next →
            </button>
          )}
        </div>

        {/* Submit all button */}
        {answeredCount > 0 && currentQ !== quizData.questions.length - 1 && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline',
                fontFamily: 'var(--font-body)',
              }}
            >
              Submit early ({answeredCount}/{quizData.questions.length} answered)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
