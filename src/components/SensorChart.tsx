import { ChartDataPoint } from '@/types/sensor';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface SensorChartProps {
  title: string;
  data: ChartDataPoint[];
  type: 'soil' | 'light';
}

export function SensorChart({ title, data, type }: SensorChartProps) {
  // Color based on sensor type
  const primaryColor = type === 'soil' ? 'hsl(142, 71%, 40%)' : 'hsl(48, 96%, 50%)';
  const gradientId = `gradient-${type}`;
  
  // Thresholds for reference lines
  const thresholds = type === 'soil' 
    ? [
        { value: 1500, label: 'Good/Okay', color: 'hsl(142, 71%, 40%)' },
        { value: 2500, label: 'Okay/Bad', color: 'hsl(0, 72%, 51%)' },
      ]
    : [
        { value: 1500, label: 'Bad/Okay', color: 'hsl(0, 72%, 51%)' },
        { value: 3000, label: 'Okay/Good', color: 'hsl(142, 71%, 40%)' },
      ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-xl">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-mono text-lg font-semibold text-foreground">
            {data.value} <span className="text-xs text-muted-foreground">ADC</span>
          </p>
          <p className={`text-xs font-medium ${
            data.condition === 'Good' 
              ? 'text-[hsl(142_71%_35%)]' 
              : data.condition === 'Okay'
                ? 'text-[hsl(43_80%_35%)]'
                : 'text-[hsl(0_72%_45%)]'
          }`}>
            {data.condition}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground">Last 2 minutes</span>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(140, 15%, 85%)" 
              vertical={false}
            />
            
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: 'hsl(150, 15%, 40%)' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(140, 15%, 85%)' }}
              interval="preserveStartEnd"
            />
            
            <YAxis
              domain={type === 'soil' ? [0, 4000] : [0, 4500]}
              tick={{ fontSize: 11, fill: 'hsl(150, 15%, 40%)' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(140, 15%, 85%)' }}
              tickFormatter={(value) => `${value}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Threshold reference lines */}
            {thresholds.map((threshold) => (
              <ReferenceLine
                key={threshold.value}
                y={threshold.value}
                stroke={threshold.color}
                strokeDasharray="5 5"
                strokeOpacity={0.5}
              />
            ))}
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={primaryColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 6,
                stroke: primaryColor,
                strokeWidth: 2,
                fill: 'hsl(0, 0%, 100%)',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        {thresholds.map((threshold) => (
          <div key={threshold.value} className="flex items-center gap-2">
            <div 
              className="h-0.5 w-4" 
              style={{ 
                backgroundColor: threshold.color,
                opacity: 0.7,
              }}
            />
            <span>{threshold.label} ({threshold.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
