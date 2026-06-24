import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  bullSignals: string[];
  bearSignals: string[];
}

export function SentimentChart({ bullSignals, bearSignals }: SentimentChartProps) {
  const data: any[] = [];
  const bulls = (bullSignals ?? []).slice(0, 3).map((_, i) => ({
    name: `b${i}`,
    value: 70 + Math.random() * 30, // vary heights
    type: 'bull'
  }))
  const bears = (bearSignals ?? []).slice(0, 3).map((_, i) => ({
    name: `r${i}`,
    value: 30 + Math.random() * 40,
    type: 'bear'
  }))
  
  // Interleave: bull, bear, bull, bear...
  const max = Math.max(bulls.length, bears.length)
  for (let i = 0; i < max; i++) {
    if (bulls[i]) data.push(bulls[i])
    if (bears[i]) data.push(bears[i])
  }
  
  if (data.length === 0) {
    return (
      <div className="h-[140px] flex items-center justify-center text-[#444] text-xs font-mono">
        Awaiting sentiment data...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="h-[150px] w-full mt-4 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={6}>
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'bull' ? '#00D4A0' : '#2a2a2a'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
