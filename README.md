# ⚡ QuizMaster Pro — Full-Stack MERN Quiz App

A production-grade quiz platform built with MongoDB, Express, React, and Node.js.

---

## 📸 Features

- **Authentication** — Secure JWT-based login/signup with bcrypt password hashing
- **8 Quiz Topics** — Science, Technology, History, Geography, Mathematics, General Knowledge, Sports, Movies
- **Timed Quizzes** — 10-minute countdown timer per quiz
- **Score Storage** — All results saved to MongoDB Atlas
- **Performance Tracking** — Per-topic stats, averages, best scores, grade history
- **Beautiful UI** — Dark cyberpunk aesthetic with Orbitron + DM Sans fonts, smooth animations
- **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas (Free Tier)         |
| Auth       | JWT + bcryptjs                    |
| Styling    | Custom CSS with Google Fonts      |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (free tier)

---

### Step 1 — MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a **Free Cluster** (M0 tier)
4. Under **Database Access** → Add user (username + password)
5. Under **Network Access** → Add IP: `0.0.0.0/0` (allow all)
6. Click **Connect** → **Drivers** → Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/quizmaster?retryWrites=true&w=majority
JWT_SECRET=make_this_a_very_long_random_string_123456789abcdef
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**

> The frontend proxies API requests to `http://localhost:5000` via the `"proxy"` field in `package.json`

---

## 📁 Project Structure

```
quizapp/
├── backend/
│   ├── server.js           ← Express app entry point
│   ├── .env.example        ← Environment variables template
│   ├── middleware/
│   │   └── auth.js         ← JWT verification middleware
│   ├── models/
│   │   ├── User.js         ← User schema (name, email, password, stats)
│   │   └── Score.js        ← Score schema (userId, topic, score, grade)
│   ├── routes/
│   │   ├── auth.js         ← POST /signup, POST /login, GET /me
│   │   ├── quiz.js         ← GET /topics, GET /:topic, POST /:topic/submit
│   │   └── scores.js       ← POST /, GET /me, GET /leaderboard/:topic
│   └── data/
│       └── questions.js    ← 80 questions across 8 topics
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.css       ← Global design system
        ├── context/
        │   └── AuthContext.js   ← Global auth state
        ├── components/
        │   ├── Navbar.js
        │   └── ProtectedRoute.js
        └── pages/
            ├── Home.js         ← Landing page
            ├── Login.js        ← Login form
            ├── Signup.js       ← Signup form (with password strength meter)
            ├── Dashboard.js    ← Topic grid with images + stats
            ├── Quiz.js         ← Quiz player with timer + review
            ├── Profile.js      ← Performance history + breakdown
            ├── About.js        ← About page
            └── Contact.js      ← Contact form + FAQ
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Auth | Description          |
|--------|---------------------|------|----------------------|
| POST   | `/api/auth/signup`  | No   | Register new user    |
| POST   | `/api/auth/login`   | No   | Login & get token    |
| GET    | `/api/auth/me`      | Yes  | Get current user     |

### Quiz
| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| GET    | `/api/quiz/topics`          | No   | Get all topic info       |
| GET    | `/api/quiz/:topic`          | Yes  | Get shuffled questions   |
| POST   | `/api/quiz/:topic/submit`   | Yes  | Submit & grade answers   |

### Scores
| Method | Endpoint                        | Auth | Description           |
|--------|---------------------------------|------|-----------------------|
| POST   | `/api/scores`                   | Yes  | Save a quiz score     |
| GET    | `/api/scores/me`                | Yes  | My scores + stats     |
| GET    | `/api/scores/leaderboard/:topic`| No   | Top 10 for a topic    |

---

## 🎨 Design System

- **Background**: `#080B14` (deep space black)
- **Cards**: `#111827`
- **Primary**: `#6366F1` (indigo)
- **Secondary**: `#06B6D4` (cyan)
- **Accent**: `#F43F5E` (rose)
- **Font Display**: Orbitron
- **Font Body**: DM Sans

---

## 📝 License

MIT — free to use and modify.
