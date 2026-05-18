import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory database
let users = [];
let profiles = [];
let trades = [];
let nextId = 1;

// Helper functions
const findUserByEmail = (email) => users.find(u => u.email === email);
const findProfileByUserId = (userId) => profiles.find(p => p.userId === userId);

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { 
      id: nextId++, 
      email, 
      password: hashedPassword, 
      name,
      createdAt: new Date() 
    };
    users.push(user);
    
    // Create default profile
    profiles.push({
      id: nextId++,
      userId: user.id,
      experienceLevel: 'beginner',
      traderType: 'beginner',
      riskTolerance: 'medium',
      dailyLossLimit: 5000,
      virtualBalance: 100000,
      realBalance: 0,
      onboardingCompleted: true,
      disciplineScore: 50,
      emotionalControlScore: 50,
      consistencyScore: 50,
      riskManagementScore: 50,
      patienceScore: 50,
      traderPersonality: 'unclassified',
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalProfitLoss: 0,
      consecutiveLosses: 0,
      consecutiveWins: 0,
      tradesToday: 0,
      dailyPnl: 0,
      cooldownActive: false,
      badges: [],
    });
    
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'secret123');
    res.json({ token, user: { id: user.id, email, name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET || 'secret123');
    res.json({ token, user: { id: user.id, email, name: user.name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PROFILE
app.get('/api/profiles', authMiddleware, (req, res) => {
  const profile = findProfileByUserId(req.user.userId);
  res.json(profile ? [profile] : []);
});

// CREATE/UPDATE PROFILE
app.post('/api/profiles', authMiddleware, (req, res) => {
  const newProfile = {
    id: nextId++,
    userId: req.user.userId,
    ...req.body,
  };
  profiles.push(newProfile);
  res.json(newProfile);
});

app.put('/api/profiles/:id', authMiddleware, (req, res) => {
  const index = profiles.findIndex(p => p.id === parseInt(req.params.id) && p.userId === req.user.userId);
  if (index === -1) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  profiles[index] = { ...profiles[index], ...req.body };
  res.json(profiles[index]);
});

// GET TRADES
app.get('/api/trades', authMiddleware, (req, res) => {
  const userTrades = trades.filter(t => t.userId === req.user.userId);
  res.json(userTrades);
});

// CREATE TRADE
app.post('/api/trades', authMiddleware, (req, res) => {
  const newTrade = {
    id: nextId++,
    userId: req.user.userId,
    ...req.body,
    createdAt: new Date(),
    profitLoss: 0,
    status: 'open',
  };
  trades.push(newTrade);
  
  // Update profile
  const profile = findProfileByUserId(req.user.userId);
  if (profile) {
    profile.totalTrades = (profile.totalTrades || 0) + 1;
    profile.tradesToday = (profile.tradesToday || 0) + 1;
  }
  
  res.json(newTrade);
});

// UPDATE TRADE
app.put('/api/trades/:id', authMiddleware, (req, res) => {
  const index = trades.findIndex(t => t.id === parseInt(req.params.id) && t.userId === req.user.userId);
  if (index === -1) {
    return res.status(404).json({ error: 'Trade not found' });
  }
  trades[index] = { ...trades[index], ...req.body };
  res.json(trades[index]);
});

// DELETE TRADE
app.delete('/api/trades/:id', authMiddleware, (req, res) => {
  const index = trades.findIndex(t => t.id === parseInt(req.params.id) && t.userId === req.user.userId);
  if (index !== -1) {
    trades.splice(index, 1);
  }
  res.json({ success: true });
});

// AI CHAT
app.post('/api/ai/chat', authMiddleware, (req, res) => {
  const mockResponse = `## 🤖 AI Trading Coach

Here's your personalized advice:

### 📊 Risk Management
- Keep position sizes under 2% of your capital
- Always use stop-loss orders

### 🧠 Emotional Control  
- Take a 5-minute break between trades
- Journal your emotions before entering

### 🎯 Consistency
- Focus on quality over quantity
- Stick to your trading plan

Keep up the great work! 🚀`;

  res.json({ response: mockResponse });
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TradeMind API running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 In-memory storage active`);
});
