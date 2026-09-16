import type { Reading } from '../../types/reading.types';
import { formatDate } from '../../utils/formatDate';

interface ReadingsTableProps {
  readings: Reading[];
  loading: boolean;
}

export function ReadingsTable({ readings, loading }: ReadingsTableProps) {
  if (loading && readings.length === 0) {
    return <p className="text-gray-500 p-4">Loading readings...</p>;
  }

  if (readings.length === 0) {
    return <p className="text-gray-500 p-4">No readings match the current filters.</p>;
  }

  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-3 py-2">Sensor</th>
            <th className="px-3 py-2">Type</th>
            <th className="px-3 py-2">Value</th>
            <th className="px-3 py-2">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((reading) => (
            <tr
              key={reading._id}
              className={
                reading.isAlert
                  ? 'bg-alert-bg text-alert border-l-4 border-alert'
                  : 'border-t border-gray-100 dark:border-gray-800'
              }
            >
              <td className="px-3 py-2 font-medium">{reading.sensorId}</td>
              <td className="px-3 py-2">{reading.sensorType}</td>
              <td className="px-3 py-2">
                {reading.value} {reading.unit}
              </td>
              <td className="px-3 py-2">{formatDate(reading.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
