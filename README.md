# TradeMind - AI Trading Psychology Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

> A full-stack web application for traders to practice risk-free virtual trading and improve psychological discipline through intelligent coaching.

## 🔗 Links

- **GitHub:** [github.com/Sunaina30722/trademind-app](https://github.com/Sunaina30722/trademind-app)

## ✨ Key Features

| Category | Features |
|----------|----------|
| **Authentication** | JWT-based login/register, bcrypt password hashing, protected routes |
| **Virtual Trading** | ₹1,00,000 paper money, real-time price simulation, multi-symbol support |
| **AI Coach** | Personalized psychological advice, emotional state tracking |
| **Portfolio** | Open/closed positions, real-time P&L, trade history |
| **Analytics** | P&L trends, emotion distribution charts, win rate calculation |
| **Discipline Score** | 5-metric algorithm (0-100), behavioral timeline |
| **Journal** | Post-trade reflections, strategy tracking |

## 🛠️ Tech Stack

**Frontend:** React 18, React Router, React Query, Tailwind CSS, Recharts, Framer Motion

**Backend:** Node.js, Express.js, JWT, bcryptjs, CORS

**Tools:** Vite, Git, GitHub, ESLint

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Sunaina30722/trademind-app.git
cd trademind-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Configure environment
echo "VITE_API_URL=http://localhost:5000/api" > .env
cd backend && echo "PORT=5000" > .env && echo "JWT_SECRET=your_secret_key" >> .env && cd ..

# Start backend (Terminal 1)
cd backend && node src/server.js

# Start frontend (Terminal 2)
npm run dev
