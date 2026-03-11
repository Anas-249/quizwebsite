const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const questions = require('../data/questions');

const topics = [
  { slug: 'science', name: 'Science', icon: '🔬', color: '#06B6D4', description: 'Explore physics, chemistry, biology and more', difficulty: 'Medium', questionCount: 10, image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80' },
  { slug: 'technology', name: 'Technology', icon: '💻', color: '#8B5CF6', description: 'Test your knowledge of computers and tech', difficulty: 'Medium', questionCount: 10, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
  { slug: 'history', name: 'History', icon: '📜', color: '#F59E0B', description: 'Journey through the annals of history', difficulty: 'Hard', questionCount: 10, image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80' },
  { slug: 'geography', name: 'Geography', icon: '🌍', color: '#10B981', description: 'Explore nations, capitals and landmarks', difficulty: 'Easy', questionCount: 10, image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?w=600&q=80' },
  { slug: 'mathematics', name: 'Mathematics', icon: '➗', color: '#EF4444', description: 'Challenge your mathematical skills', difficulty: 'Hard', questionCount: 10, image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80' },
  { slug: 'general', name: 'General Knowledge', icon: '🎯', color: '#EC4899', description: 'A mix of everything and anything', difficulty: 'Easy', questionCount: 10, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80' },
  { slug: 'sports', name: 'Sports', icon: '⚽', color: '#F97316', description: 'Test your knowledge of global sports', difficulty: 'Medium', questionCount: 10, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80' },
  { slug: 'movies', name: 'Movies & Cinema', icon: '🎬', color: '#6366F1', description: 'Lights, camera, action! Movie trivia', difficulty: 'Easy', questionCount: 10, image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80' },
];

// GET /api/quiz/topics
router.get('/topics', (req, res) => {
  res.json({ topics });
});

// GET /api/quiz/:topic - get questions for a topic (auth required)
router.get('/:topic', authMiddleware, (req, res) => {
  const { topic } = req.params;
  const topicQuestions = questions[topic];

  if (!topicQuestions) {
    return res.status(404).json({ message: 'Topic not found.' });
  }

  const topicInfo = topics.find((t) => t.slug === topic);

  // Shuffle and return questions (without revealing correct answers)
  const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
  const sanitized = shuffled.map(({ answer, ...rest }) => rest);

  res.json({
    topic: topicInfo,
    questions: sanitized,
    totalQuestions: sanitized.length,
  });
});

// POST /api/quiz/:topic/submit - submit answers and get results
router.post('/:topic/submit', authMiddleware, async (req, res) => {
  const { topic } = req.params;
  const { answers, timeTaken } = req.body;
  const topicQuestions = questions[topic];

  if (!topicQuestions) {
    return res.status(404).json({ message: 'Topic not found.' });
  }

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ message: 'Answers are required.' });
  }

  // Grade the answers
  const results = answers.map((ans) => {
    const question = topicQuestions.find((q) => q.id === ans.questionId);
    if (!question) return { ...ans, isCorrect: false, correctAnswer: null };
    return {
      ...ans,
      isCorrect: ans.selectedAnswer === question.answer,
      correctAnswer: question.answer,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const percentage = Math.round((correctCount / topicQuestions.length) * 100);

  res.json({
    score: correctCount,
    totalQuestions: topicQuestions.length,
    percentage,
    timeTaken,
    results,
    answers: topicQuestions.map((q) => ({ id: q.id, correctAnswer: q.answer })),
  });
});

module.exports = router;
