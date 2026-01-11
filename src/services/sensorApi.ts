import { SensorData, ChartDataPoint, SensorReading } from '@/types/sensor';
import { getSoilCondition, getLightCondition, formatTime } from '@/utils/sensorLogic';

// ============================================================
// ESP32 API Configuration
// ============================================================
// TODO: Replace with your ESP32's IP address or hostname
// Example: const ESP32_API_URL = 'http://192.168.1.100';
// ============================================================
const ESP32_API_URL = null; // ESP32 API endpoint will be connected here

/**
 * Fetch sensor data from ESP32
 * Currently returns mock data - will connect to ESP32 when URL is configured
 */
export async function fetchSensorData(): Promise<SensorData> {
  // ============================================================
  // ESP32 API endpoint will be connected here
  // ============================================================
  // When ESP32 is ready, uncomment and modify:
  // 
  // if (ESP32_API_URL) {
  //   const response = await fetch(`${ESP32_API_URL}/sensors`);
  //   const data = await response.json();
  //   return {
  //     soilMoisture: {
  //       value: data.soil,
  //       timestamp: new Date(),
  //       condition: getSoilCondition(data.soil),
  //     },
  //     light: {
  //       value: data.light,
  //       timestamp: new Date(),
  //       condition: getLightCondition(data.light),
  //     },
  //   };
  // }
  // ============================================================

  // Mock data for development
  return generateMockSensorData();
}

/**
 * Generate realistic mock sensor data for testing
 * Simulates ESP32 ADC readings (0-4095 range)
 */
function generateMockSensorData(): SensorData {
  const now = new Date();
  
  // Simulate soil moisture (lower = wetter = better)
  // Oscillates between good and okay states with occasional bad readings
  const soilBase = 1200 + Math.sin(Date.now() / 10000) * 800;
  const soilNoise = (Math.random() - 0.5) * 400;
  const soilValue = Math.round(Math.max(500, Math.min(3500, soilBase + soilNoise)));

  // Simulate light sensor (higher = more light = better)
  // Follows a pattern based on "time of day"
  const hour = now.getHours();
  const dayFactor = Math.sin((hour - 6) * Math.PI / 12); // Peak at noon
  const lightBase = 2000 + dayFactor * 1500;
  const lightNoise = (Math.random() - 0.5) * 500;
  const lightValue = Math.round(Math.max(500, Math.min(4000, lightBase + lightNoise)));

  return {
    soilMoisture: {
      value: soilValue,
      timestamp: now,
      condition: getSoilCondition(soilValue),
    },
    light: {
      value: lightValue,
      timestamp: now,
      condition: getLightCondition(lightValue),
    },
  };
}

/**
 * Generate historical data for charts
 * Creates 20 data points spanning the last 2 minutes
 */
export function generateHistoricalData(
  type: 'soil' | 'light',
  currentReading: SensorReading
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = Date.now();
  const getCondition = type === 'soil' ? getSoilCondition : getLightCondition;
  
  // Generate 20 historical points
  for (let i = 19; i >= 0; i--) {
    const timestamp = new Date(now - i * 6000); // 6 seconds apart
    
    if (i === 0) {
      // Current reading
      data.push({
        time: formatTime(timestamp),
        value: currentReading.value,
        condition: currentReading.condition,
      });
    } else {
      // Historical mock data with realistic variation
      const variation = (Math.random() - 0.5) * 300;
      let value: number;
      
      if (type === 'soil') {
        value = Math.round(Math.max(500, Math.min(3500, currentReading.value + variation * (i / 10))));
      } else {
        value = Math.round(Math.max(500, Math.min(4000, currentReading.value + variation * (i / 10))));
      }
      
      data.push({
        time: formatTime(timestamp),
        value,
        condition: getCondition(value),
      });
    }
  }
  
  return data;
}
