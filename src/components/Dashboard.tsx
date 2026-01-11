import { Header } from './Header';
import { Footer } from './Footer';
import { SensorCard } from './SensorCard';
import { SensorChart } from './SensorChart';
import { useSensorData } from '@/hooks/useSensorData';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { 
    sensorData, 
    soilHistory, 
    lightHistory, 
    isLoading, 
    error, 
    isConnected,
    refresh 
  } = useSensorData();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Initializing sensors...</p>
        </div>
      </div>
    );
  }

  if (error || !sensorData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium text-foreground">Connection Error</p>
          <p className="text-sm text-muted-foreground">{error || 'Unable to fetch sensor data'}</p>
          <Button onClick={refresh} variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header isConnected={isConnected} />
      
      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Status Banner */}
        <div className="mb-8 rounded-lg border border-border bg-card/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`pulse-dot ${isConnected ? 'good' : 'okay'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isConnected ? 'ESP32 Connected' : 'Demo Mode (Simulated Data)'}
                </span>
              </div>
            </div>
            <Button 
              onClick={refresh} 
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Sensor Cards Grid */}
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Live Sensor Data</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <SensorCard
              title="Soil Moisture"
              type="soil"
              reading={sensorData.soilMoisture}
            />
            <SensorCard
              title="Light Intensity (LDR)"
              type="light"
              reading={sensorData.light}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Data Visualization</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <SensorChart
              title="Soil Moisture Trend"
              data={soilHistory}
              type="soil"
            />
            <SensorChart
              title="Light Intensity Trend"
              data={lightHistory}
              type="light"
            />
          </div>
        </section>

        {/* Technical Note */}
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/30 p-4">
          <p className="text-xs font-mono text-muted-foreground">
            <span className="text-primary">// ESP32 Integration Note:</span> This dashboard displays 
            simulated ADC values matching ESP32 behavior. To connect real sensors, configure the 
            API endpoint in <code className="rounded bg-secondary px-1">src/services/sensorApi.ts</code>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
