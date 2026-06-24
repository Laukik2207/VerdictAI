import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';

interface SentimentChartProps {
  bullSignals: string[];
  bearSignals: string[];
}

export function SentimentChart({ bullSignals, bearSignals }: SentimentChartProps) {
  // Generate visual-only data
  // Green bars for positive signals, dark gray for negative
  const data: any[] = [];
  
  bullSignals.slice(0, 3).forEach((s, i) => {
    data.push({ name: `bull-${i}`, value: 60 + Math.random() * 40, type: 'bull' });
  });
  bearSignals.slice(0, 3).forEach((s, i) => {
    data.push({ name: `bear-${i}`, value: 30 + Math.random() * 30, type: 'bear' });
  });

  // If there's missing data, pad it so chart doesn't look empty
  while (data.length < 5) {
    data.push({ name: `pad-${data.length}`, value: 50, type: 'neutral' });
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
                  fill={entry.type === 'bull' ? '#00D4A0' : '#333333'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
