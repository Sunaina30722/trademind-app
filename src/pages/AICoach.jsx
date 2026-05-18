import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';

export default function AICoach() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const profiles = await api.get('/profiles');
      return profiles[0];
    },
  });

  const handleAsk = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const result = await api.post('/ai/chat', { prompt: message });
      setResponse(result.response);
    } catch (error) {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Trading Coach</h1>
        <p className="text-muted-foreground mt-1">Get personalized trading advice and psychology coaching</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about trading psychology, risk management, or discipline..."
            className="w-full p-3 rounded-lg bg-background border border-border text-foreground resize-none"
            rows={3}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            {loading ? 'Thinking...' : 'Ask Coach'}
          </button>
        </div>

        {response && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}