const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    topicSlug: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    answers: [
      {
        questionId: String,
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],
    grade: {
      type: String,
      enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
      default: 'F',
    },
  },
  { timestamps: true }
);

// Compute grade before saving
scoreSchema.pre('save', function (next) {
  if (this.percentage >= 95) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 65) this.grade = 'B';
  else if (this.percentage >= 50) this.grade = 'C';
  else if (this.percentage >= 35) this.grade = 'D';
  else this.grade = 'F';
  next();
});

module.exports = mongoose.model('Score', scoreSchema);
