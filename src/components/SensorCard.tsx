import { SensorReading } from '@/types/sensor';
import { getStatusClass, getPulseClass } from '@/utils/sensorLogic';
import { Droplets, Sun, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SensorCardProps {
  title: string;
  type: 'soil' | 'light';
  reading: SensorReading;
  unit?: string;
}

export function SensorCard({ title, type, reading, unit = 'ADC' }: SensorCardProps) {
  const Icon = type === 'soil' ? Droplets : Sun;
  
  // Determine trend icon based on condition
  // For soil: Good means moisture is sufficient (trend up)
  // For light: Good means enough light (trend up)
  const getTrendIcon = () => {
    switch (reading.condition) {
      case 'Good':
        return <TrendingUp className="h-4 w-4" />;
      case 'Bad':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  return (
    <div className="sensor-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            type === 'soil' ? 'bg-primary/10' : 'bg-[hsl(43_96%_56%/0.1)]'
          }`}>
            <Icon className={`h-6 w-6 ${
              type === 'soil' ? 'text-primary' : 'text-[hsl(43_96%_56%)]'
            }`} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground/70">Real-time reading</p>
          </div>
        </div>
        
        <div className={`status-indicator ${getStatusClass(reading.condition)}`}>
          <span className={`pulse-dot ${getPulseClass(reading.condition)}`} />
          {reading.condition}
          {getTrendIcon()}
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <span className="value-display text-foreground">{reading.value}</span>
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Last updated: {reading.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      {/* Threshold reference */}
      <div className="mt-4 rounded-lg bg-secondary/50 p-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">ESP32 Thresholds:</p>
        {type === 'soil' ? (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span className="text-[hsl(160_84%_39%)]">≤1500: Good</span>
            <span className="text-[hsl(43_96%_56%)]">1501-2500: Okay</span>
            <span className="text-[hsl(0_72%_51%)]">&gt;2500: Bad</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span className="text-[hsl(0_72%_51%)]">&lt;1500: Bad</span>
            <span className="text-[hsl(43_96%_56%)]">1500-2999: Okay</span>
            <span className="text-[hsl(160_84%_39%)]">≥3000: Good</span>
          </div>
        )}
      </div>
    </div>
  );
}
