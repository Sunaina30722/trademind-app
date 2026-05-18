import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Brain, Wallet, Activity, Trophy } from 'lucide-react';
import api from '../api/client';

export default function Dashboard() {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profiles = await api.get('/profiles');
      return profiles[0];
    },
  });

  const { data: trades, isLoading: tradesLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => api.get('/trades?limit=10'),
  });

  if (profileLoading || tradesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Virtual Balance', value: `₹${(profile?.virtualBalance || 100000).toLocaleString('en-IN')}`, icon: Wallet, color: 'text-primary' },
    { label: 'Discipline Score', value: `${profile?.disciplineScore || 50}/100`, icon: Brain, color: 'text-accent' },
    { label: 'Total Trades', value: profile?.totalTrades || 0, icon: Activity, color: 'text-warning' },
    { label: 'Win Rate', value: profile?.totalTrades ? Math.round((profile.winningTrades / profile.totalTrades) * 100) : 0, icon: Trophy, color: 'text-profit' },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {JSON.parse(localStorage.getItem('user') || '{}').name || 'Trader'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/virtual-trade" className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition">
          <TrendingUp className="h-8 w-8 text-primary mb-3" />
          <h3 className="font-semibold text-foreground">Virtual Trade</h3>
          <p className="text-sm text-muted-foreground mt-1">Practice with ₹1,00,000 fake money</p>
        </Link>
        <Link to="/ai-coach" className="bg-gradient-to-r from-accent/20 to-accent/10 rounded-xl p-6 border border-accent/20 hover:border-accent/40 transition">
          <Brain className="h-8 w-8 text-accent mb-3" />
          <h3 className="font-semibold text-foreground">AI Coach</h3>
          <p className="text-sm text-muted-foreground mt-1">Get personalized trading advice</p>
        </Link>
      </div>

      {/* Recent Trades */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Recent Trades</h3>
        </div>
        <div className="divide-y divide-border">
          {trades?.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No trades yet. Start trading to see your history!
            </div>
          ) : (
            trades?.slice(0, 5).map((trade) => (
              <div key={trade._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{trade.symbol}</p>
                  <p className="text-xs text-muted-foreground">{new Date(trade.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-medium ${trade.profitLoss >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}₹{Math.abs(trade.profitLoss || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{trade.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}