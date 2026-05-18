import express from 'express';
import TraderProfile from '../models/TraderProfile.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    let profile = await TraderProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      profile = await TraderProfile.create({ userId: req.user.userId });
    }
    res.json([profile]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const profile = new TraderProfile({ ...req.body, userId: req.user.userId });
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const profile = await TraderProfile.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;