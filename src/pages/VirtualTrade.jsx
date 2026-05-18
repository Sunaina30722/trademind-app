import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';

const SYMBOLS = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];

export default function VirtualTrade() {
  const queryClient = useQueryClient();
  const [symbol, setSymbol] = useState('NIFTY50');
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(22450);
  const [stopLoss, setStopLoss] = useState(22000);
  const [emotionalState, setEmotionalState] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profiles = await api.get('/profiles');
      return profiles[0];
    },
  });

  const createTrade = useMutation({
    mutationFn: async (tradeData) => {
      return await api.post('/trades', tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast.success('Trade placed successfully!');
      setEmotionalState('');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emotionalState) {
      toast.error('Please select your emotional state');
      return;
    }

    const riskAmount = Math.abs(price - stopLoss) * quantity;
    const riskPercent = (riskAmount / (price * quantity)) * 100;

    if (riskPercent > 5) {
      toast.warning(`High risk: ${riskPercent.toFixed(1)}% of position. Consider reducing size.`);
    }

    createTrade.mutate({
      symbol,
      tradeType,
      entryPrice: price,
      positionSize: quantity,
      stopLoss,
      emotionalState,
      isVirtual: true,
      status: 'open',
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Virtual Trading</h1>
        <p className="text-muted-foreground mt-1">Practice with ₹1,00,000 virtual capital</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trade Form */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Place Trade</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
              >
                {SYMBOLS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Trade Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    tradeType === 'buy' 
                      ? 'bg-profit text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    tradeType === 'sell' 
                      ? 'bg-loss text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  SELL / SHORT
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Entry Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stop Loss (₹)</label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Emotional State</label>
              <div className="flex flex-wrap gap-2">
                {['calm', 'excited', 'anxious', 'frustrated', 'confident'].map(emotion => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => setEmotionalState(emotion)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition ${
                      emotionalState === emotion
                        ? 'bg-primary text-white'
                        : 'bg-muted text-muted-foreground hover:bg-primary/20'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Available Balance: ₹{(profile?.virtualBalance || 100000).toLocaleString('en-IN')}
              </p>
              <button
                type="submit"
                disabled={createTrade.isPending}
                className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {createTrade.isPending ? 'Placing Trade...' : 'Place Trade'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">🎮 Virtual Trading Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Start with ₹1,00,000 fake money - zero real risk</li>
            <li>• Practice different strategies without fear</li>
            <li>• AI analyzes your emotional state before each trade</li>
            <li>• Track your discipline score as you improve</li>
            <li>• Learn from mistakes without losing real money</li>
          </ul>
          
          <div className="mt-6 p-3 bg-card/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Always set a stop loss. Never risk more than 2% of your capital on a single trade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}