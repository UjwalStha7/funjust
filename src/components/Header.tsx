import { Cpu, Wifi } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
}

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Plant Monitoring System
            </h1>
            <p className="text-sm text-muted-foreground">ESP32 IoT Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5">
            <Wifi className={`h-4 w-4 ${isConnected ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-sm font-medium text-secondary-foreground">
              {isConnected ? 'Live' : 'Simulated'}
            </span>
            <span className={`pulse-dot ${isConnected ? 'good' : 'okay'}`} />
          </div>
        </div>
      </div>
    </header>
  );
}
