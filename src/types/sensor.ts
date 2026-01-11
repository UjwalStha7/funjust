// Sensor data types for Plant Monitoring System

export type ConditionStatus = 'Good' | 'Okay' | 'Bad';

export interface SensorReading {
  value: number;
  timestamp: Date;
  condition: ConditionStatus;
}

export interface SensorData {
  soilMoisture: SensorReading;
  light: SensorReading;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  condition: ConditionStatus;
}

// ESP32 Threshold Constants (from Arduino code)
export const SOIL_THRESHOLDS = {
  GOOD_MAX: 1500,      // value ≤ 1500 = Good
  OKAY_MAX: 2500,      // 1501 - 2500 = Okay
  // > 2500 = Bad
} as const;

export const LIGHT_THRESHOLDS = {
  BAD_MAX: 1499,       // value < 1500 = Bad
  OKAY_MAX: 2999,      // 1500 - 2999 = Okay
  // ≥ 3000 = Good
} as const;
