import React from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ChartProps {
  baseConfidence: number;
  verdict: string;
}

export function PerformanceCorridorChart({ baseConfidence, verdict }: ChartProps) {
  // Generate synthetic data
  const generateCorridorData = (baseConfidence: number, verdict: string) => {
    const months = ['May 24','Aug 24','Nov 24','Feb 25','May 25','Aug 25','Nov 25','Feb 26','May 26'];
    const isInvest = verdict === 'INVEST' || verdict === 'invest';
    
    return months.map((month, i) => {
      // Adjust the baseline so it scales with confidence somewhat
      const startingPoint = 100 * (baseConfidence / 80);
      
      return {
        month,
        optimistic: isInvest ? startingPoint + i * 15 + Math.sin(i) * 5 : startingPoint - i * 5,
        base: startingPoint + i * (isInvest ? 6 : -2),
        bear: startingPoint - i * 8 - Math.abs(Math.sin(i)) * 3
      };
    });
  };

  const data = generateCorridorData(baseConfidence, verdict);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a1a] border border-border p-3 rounded-md shadow-xl text-xs">
          <p className="text-text-muted mb-2 font-mono uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 py-1">
              <span className="flex items-center gap-2" style={{ color: entry.color || entry.stroke }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color || entry.stroke }}></span>
                <span className="capitalize">{entry.name}</span>
              </span>
              <span className="font-bold text-white">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white text-[18px] font-bold">Projected Performance Corridor</h3>
          <p className="text-text-muted text-[12px]">Estimated trajectory 12-24 months out.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00D4A0]"></span>
            <span className="text-[11px] text-text-muted">Optimistic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-[11px] text-text-muted">Base Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
            <span className="text-[11px] text-text-muted">Stress (Bear)</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4A0" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#00D4A0" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.08}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a1a1a" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#444" 
              tick={{ fill: '#666', fontSize: 11 }} 
              tickLine={false} 
              axisLine={{ stroke: '#444' }}
              dy={10}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="optimistic" 
              name="Optimistic"
              stroke="#00D4A0" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOpt)" 
              activeDot={{ r: 4, fill: "#00D4A0", stroke: "#000", strokeWidth: 2 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="base" 
              name="Base Case"
              stroke="#ffffff" 
              strokeWidth={1.5}
              strokeDasharray="5 5"
              fill="transparent" 
              activeDot={{ r: 4, fill: "#fff", stroke: "#000", strokeWidth: 2 }}
            />
            
            <Area 
              type="monotone" 
              dataKey="bear" 
              name="Stress (Bear)"
              stroke="#ef4444" 
              strokeWidth={1.5}
              fillOpacity={1} 
              fill="url(#colorBear)" 
              activeDot={{ r: 4, fill: "#ef4444", stroke: "#000", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
