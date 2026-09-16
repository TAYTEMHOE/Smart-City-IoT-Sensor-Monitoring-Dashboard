import type { SensorType } from '../../types/reading.types';

export interface SensorFilters {
  sensorId: string;
  sensorType: SensorType | '';
}

interface SensorFilterBarProps {
  value: SensorFilters;
  onChange: (filters: SensorFilters) => void;
}

const SENSOR_TYPES: SensorType[] = ['temperature', 'humidity', 'air_quality'];

export function SensorFilterBar({ value, onChange }: SensorFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 items-end p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600 dark:text-gray-300">Sensor ID</span>
        <input
          type="text"
          placeholder="e.g. temp-01"
          value={value.sensorId}
          onChange={(e) => onChange({ ...value, sensorId: e.target.value })}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-gray-600 dark:text-gray-300">Sensor type</span>
        <select
          value={value.sensorType}
          onChange={(e) => onChange({ ...value, sensorType: e.target.value as SensorType | '' })}
          className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-transparent"
        >
          <option value="">All</option>
          {SENSOR_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
