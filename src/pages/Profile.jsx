import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export default function Profile() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profiles = await api.get('/profiles');
      return profiles[0];
    },
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-2xl text-primary">
              {user.name?.charAt(0) || 'T'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user.name || 'Trader'}</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Trader Type</span>
            <span className="text-foreground capitalize">{profile?.traderType || 'Beginner'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Risk Tolerance</span>
            <span className="text-foreground capitalize">{profile?.riskTolerance || 'Medium'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Daily Loss Limit</span>
            <span className="text-foreground">₹{(profile?.dailyLossLimit || 5000).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Member Since</span>
            <span className="text-foreground">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}