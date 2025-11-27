import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock historical data
const data = [
  { time: '08:00', occupancy: 20 },
  { time: '10:00', occupancy: 45 },
  { time: '12:00', occupancy: 80 },
  { time: '14:00', occupancy: 65 },
  { time: '16:00', occupancy: 50 },
  { time: '18:00', occupancy: 30 },
  { time: '20:00', occupancy: 40 },
  { time: '22:00', occupancy: 20 },
];

export function StatsPanel() {
  return (
    <div className="h-[300px] w-full bg-card border border-border rounded-xl p-4">
      <h3 className="text-lg font-bold mb-4">Occupancy Trend (24h)</h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area 
              type="monotone" 
              dataKey="occupancy" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOccupancy)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
