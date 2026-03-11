const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Score = require('../models/Score');
const User = require('../models/User');

// POST /api/scores - save a score
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { topic, topicSlug, score, totalQuestions, percentage, timeTaken, answers } = req.body;

    const newScore = new Score({
      userId: req.user.id,
      topic,
      topicSlug,
      score,
      totalQuestions,
      percentage,
      timeTaken,
      answers,
    });

    await newScore.save();

    // Update user stats
    const user = await User.findById(req.user.id);
    user.totalQuizzes += 1;
    user.totalScore += score;
    if (percentage > user.bestScore) user.bestScore = percentage;
    await user.save();

    res.status(201).json({ message: 'Score saved!', score: newScore });
  } catch (err) {
    console.error('Save score error:', err);
    res.status(500).json({ message: 'Failed to save score.' });
  }
});

// GET /api/scores/me - get current user's scores
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Compute stats
    const totalAttempts = scores.length;
    const avgPercentage =
      totalAttempts > 0
        ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / totalAttempts)
        : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...scores.map((s) => s.percentage)) : 0;

    // Topic breakdown
    const topicStats = {};
    scores.forEach((s) => {
      if (!topicStats[s.topicSlug]) {
        topicStats[s.topicSlug] = { topic: s.topic, attempts: 0, totalPercentage: 0, best: 0 };
      }
      topicStats[s.topicSlug].attempts += 1;
      topicStats[s.topicSlug].totalPercentage += s.percentage;
      if (s.percentage > topicStats[s.topicSlug].best) {
        topicStats[s.topicSlug].best = s.percentage;
      }
    });

    Object.keys(topicStats).forEach((key) => {
      topicStats[key].avg = Math.round(
        topicStats[key].totalPercentage / topicStats[key].attempts
      );
    });

    res.json({
      scores,
      stats: { totalAttempts, avgPercentage, bestScore, topicStats },
    });
  } catch (err) {
    console.error('Get scores error:', err);
    res.status(500).json({ message: 'Failed to fetch scores.' });
  }
});

// GET /api/scores/leaderboard/:topic - top scores per topic
router.get('/leaderboard/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const leaderboard = await Score.find({ topicSlug: topic })
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(10)
      .populate('userId', 'name');

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leaderboard.' });
  }
});

module.exports = router;
