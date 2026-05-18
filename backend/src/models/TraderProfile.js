import mongoose from 'mongoose';

const traderProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experienceLevel: { type: String, default: 'beginner' },
  traderType: { type: String, default: 'beginner' },
  riskTolerance: { type: String, default: 'medium' },
  dailyLossLimit: { type: Number, default: 5000 },
  virtualBalance: { type: Number, default: 100000 },
  realBalance: { type: Number, default: 0 },
  onboardingCompleted: { type: Boolean, default: false },
  disciplineScore: { type: Number, default: 50 },
  emotionalControlScore: { type: Number, default: 50 },
  consistencyScore: { type: Number, default: 50 },
  riskManagementScore: { type: Number, default: 50 },
  patienceScore: { type: Number, default: 50 },
  traderPersonality: { type: String, default: 'unclassified' },
  totalTrades: { type: Number, default: 0 },
  winningTrades: { type: Number, default: 0 },
  losingTrades: { type: Number, default: 0 },
  totalProfitLoss: { type: Number, default: 0 },
  consecutiveLosses: { type: Number, default: 0 },
  consecutiveWins: { type: Number, default: 0 },
  tradesToday: { type: Number, default: 0 },
  dailyPnl: { type: Number, default: 0 },
  cooldownActive: { type: Boolean, default: false },
  badges: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model('TraderProfile', traderProfileSchema);