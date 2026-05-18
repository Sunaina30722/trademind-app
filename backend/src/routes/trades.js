import express from 'express';
import Trade from '../models/Trade.js';
import TraderProfile from '../models/TraderProfile.js';
import Notification from '../models/Notification.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get trades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const trades = await Trade.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create trade
router.post('/', authenticateToken, async (req, res) => {
  try {
    const trade = new Trade({ ...req.body, userId: req.user.userId });
    await trade.save();
    
    // Update profile
    const profile = await TraderProfile.findOne({ userId: req.user.userId });
    if (profile) {
      profile.totalTrades += 1;
      profile.tradesToday += 1;
      await profile.save();
    }
    
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update trade
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete trade
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;