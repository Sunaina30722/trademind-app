import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';

export default function Analytics() {
  const { data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.get('/trades'),
  });

  const closedTrades = trades?.filter(t => t.status === 'closed') || [];
  
  const wins = closedTrades.filter(t => t.profitLoss > 0).length;
  const losses = closedTrades.filter(t => t.profitLoss < 0).length;
  const winRate = closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : 0;

  const emotionData = [
    { name: 'Calm', value: closedTrades.filter(t => t.emotionalState === 'calm').length },
    { name: 'Excited', value: closedTrades.filter(t => t.emotionalState === 'excited').length },
    { name: 'Anxious', value: closedTrades.filter(t => t.emotionalState === 'anxious').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights into your trading behavior</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Total Trades</p>
          <p className="text-2xl font-bold text-foreground">{closedTrades.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-2xl font-bold text-profit">{winRate}%</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-xs text-muted-foreground">Total P&L</p>
          <p className={`text-2xl font-bold ${closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
            ₹{closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {emotionData.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Trades by Emotional State</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={emotionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {emotionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}