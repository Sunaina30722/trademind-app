import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export default function Portfolio() {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.get('/trades'),
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profiles = await api.get('/profiles');
      return profiles[0];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const openTrades = trades?.filter(t => t.status === 'open') || [];
  const closedTrades = trades?.filter(t => t.status === 'closed') || [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground mt-1">Track your positions and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase">Virtual Balance</p>
          <p className="text-xl font-bold text-foreground font-mono">
            ₹{(profile?.virtualBalance || 100000).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase">Total Trades</p>
          <p className="text-xl font-bold text-foreground font-mono">{profile?.totalTrades || 0}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase">Open Positions</p>
          <p className="text-xl font-bold text-foreground font-mono">{openTrades.length}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Open Positions</h3>
        </div>
        <div className="divide-y divide-border">
          {openTrades.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No open positions</div>
          ) : (
            openTrades.map(trade => (
              <div key={trade._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{trade.symbol}</p>
                  <p className="text-xs text-muted-foreground capitalize">{trade.tradeType}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-foreground">₹{trade.entryPrice}</p>
                  <p className="text-xs text-muted-foreground">Qty: {trade.positionSize}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}