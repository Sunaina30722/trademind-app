import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// AI Coach endpoint (mock - replace with OpenAI or other LLM)
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Mock AI response
    const mockResponse = `## 🤖 AI Trading Coach

Based on your trading activity, here's some personalized advice:

### 📊 Risk Management
- Keep position sizes under 2% of your capital
- Always use stop-loss orders
- Review your risk/reward ratio before each trade

### 🧠 Emotional Control
- Take a 5-minute break between trades
- Journal your emotions before entering
- Don't chase losses - they'll come back

### 🎯 Consistency
- Focus on quality over quantity
- Stick to your trading plan
- Review your performance weekly

Keep up the great work! Remember, discipline beats luck. 🚀`;

    res.json({ response: mockResponse });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;