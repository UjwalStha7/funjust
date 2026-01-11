import { Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Plant Monitoring System
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            by <span className="font-semibold text-foreground">UK DJ's</span>
          </p>
          <p className="text-xs text-muted-foreground/70">
            ESP32 IoT Engineering Project
          </p>
        </div>
      </div>
    </footer>
  );
}
