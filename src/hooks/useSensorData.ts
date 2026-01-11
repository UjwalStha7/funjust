import { useState, useEffect, useCallback } from 'react';
import { SensorData, ChartDataPoint } from '@/types/sensor';
import { fetchSensorData, generateHistoricalData } from '@/services/sensorApi';

const UPDATE_INTERVAL = 2000; // 2 seconds

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [soilHistory, setSoilHistory] = useState<ChartDataPoint[]>([]);
  const [lightHistory, setLightHistory] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const updateSensorData = useCallback(async () => {
    try {
      const data = await fetchSensorData();
      setSensorData(data);
      
      // Update history with new data point
      setSoilHistory(prev => {
        const newHistory = [...prev, {
          time: data.soilMoisture.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }),
          value: data.soilMoisture.value,
          condition: data.soilMoisture.condition,
        }];
        // Keep only last 20 points
        return newHistory.slice(-20);
      });
      
      setLightHistory(prev => {
        const newHistory = [...prev, {
          time: data.light.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }),
          value: data.light.value,
          condition: data.light.condition,
        }];
        return newHistory.slice(-20);
      });
      
      setError(null);
      // Check if we're getting real ESP32 data (for now always simulated)
      setIsConnected(false);
    } catch (err) {
      setError('Failed to fetch sensor data');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load with historical data
  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchSensorData();
      setSensorData(data);
      
      // Generate initial historical data
      setSoilHistory(generateHistoricalData('soil', data.soilMoisture));
      setLightHistory(generateHistoricalData('light', data.light));
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  // Periodic updates
  useEffect(() => {
    const interval = setInterval(updateSensorData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [updateSensorData]);

  return {
    sensorData,
    soilHistory,
    lightHistory,
    isLoading,
    error,
    isConnected,
    refresh: updateSensorData,
  };
}
