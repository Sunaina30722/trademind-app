import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';

const SYMBOLS = ['NIFTY50', 'BANKNIFTY', 'RELIANCE', 'TCS', 'INFY'];

export default function RealTrade() {
  const queryClient = useQueryClient();
  const [symbol, setSymbol] = useState('NIFTY50');
  const [tradeType, setTradeType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(22450);
  const [stopLoss, setStopLoss] = useState(22000);

  const createTrade = useMutation({
    mutationFn: async (tradeData) => {
      return await api.post('/trades', tradeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast.success('Mock trade placed! (Demo mode)');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTrade.mutate({
      symbol,
      tradeType,
      entryPrice: price,
      positionSize: quantity,
      stopLoss,
      isVirtual: false,
      status: 'open',
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Real Trade</h1>
        <p className="text-muted-foreground mt-1">⚠️ Demo mode - prices are simulated</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 max-w-md">
        <h2 className="text-lg font-semibold text-foreground mb-4">Place Order</h2>
        
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
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  tradeType === 'buy' ? 'bg-profit text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                BUY
              </button>
              <button
                type="button"
                onClick={() => setTradeType('sell')}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  tradeType === 'sell' ? 'bg-loss text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                SELL
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Price (₹)</label>
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

          <div className="pt-4">
            <div className="p-3 bg-warning/10 rounded-lg mb-4">
              <p className="text-xs text-warning">⚠️ Demo Mode: This is a mock execution. No real money is transacted.</p>
            </div>
            <button
              type="submit"
              disabled={createTrade.isPending}
              className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
            >
              {createTrade.isPending ? 'Placing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}