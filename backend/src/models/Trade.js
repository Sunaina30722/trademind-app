import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  tradeType: { type: String, enum: ['buy', 'sell'], required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  positionSize: { type: Number, required: true },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  leverage: { type: Number, default: 1 },
  profitLoss: { type: Number, default: 0 },
  profitLossPercent: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  emotionalState: { type: String },
  safetyScore: { type: Number },
  safetyLevel: { type: String, enum: ['green', 'yellow', 'red'] },
  isVirtual: { type: Boolean, default: true },
  isRevengeTrade: { type: Boolean, default: false },
  isFomoTrade: { type: Boolean, default: false },
  isOvertrade: { type: Boolean, default: false },
  postTradeNotes: { type: String },
  strategyFollowed: { type: Boolean, default: false },
  tradeReason: { type: String },
  warningsTriggered: { type: Array, default: [] },
  entryTimestamp: { type: Date, default: Date.now },
  exitTimestamp: { type: Date },
}, { timestamps: true });

export default mongoose.model('Trade', tradeSchema);