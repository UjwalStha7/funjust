import { ConditionStatus, SOIL_THRESHOLDS, LIGHT_THRESHOLDS } from '@/types/sensor';

/**
 * Determines soil moisture condition based on ESP32 logic
 * 
 * ESP32 Thresholds:
 * - Good: value ≤ 1500
 * - Okay: 1501 - 2500
 * - Bad: value > 2500
 */
export function getSoilCondition(value: number): ConditionStatus {
  if (value <= SOIL_THRESHOLDS.GOOD_MAX) {
    return 'Good';
  } else if (value <= SOIL_THRESHOLDS.OKAY_MAX) {
    return 'Okay';
  }
  return 'Bad';
}

/**
 * Determines light (LDR) condition based on ESP32 logic
 * 
 * ESP32 Thresholds:
 * - Bad: value < 1500
 * - Okay: 1500 - 2999
 * - Good: value ≥ 3000
 */
export function getLightCondition(value: number): ConditionStatus {
  if (value < 1500) {
    return 'Bad';
  } else if (value < 3000) {
    return 'Okay';
  }
  return 'Good';
}

/**
 * Format timestamp for chart display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Get status color class based on condition
 */
export function getStatusClass(condition: ConditionStatus): string {
  switch (condition) {
    case 'Good':
      return 'status-good';
    case 'Okay':
      return 'status-okay';
    case 'Bad':
      return 'status-bad';
  }
}

/**
 * Get pulse dot class based on condition
 */
export function getPulseClass(condition: ConditionStatus): string {
  return condition.toLowerCase();
}
