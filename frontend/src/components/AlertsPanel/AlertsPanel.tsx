import type { Alert } from '../../types/reading.types';
import { formatDate } from '../../utils/formatDate';

interface AlertsPanelProps {
  alerts: Alert[];
  loading: boolean;
}

export function AlertsPanel({ alerts, loading }: AlertsPanelProps) {
  return (
    <div className="bg-alert-bg border border-alert-border rounded-lg p-4">
      <h2 className="text-alert font-semibold mb-3">Active Alerts</h2>

      {loading && alerts.length === 0 && <p className="text-alert/70 text-sm">Loading alerts...</p>}

      {!loading && alerts.length === 0 && (
        <p className="text-alert/70 text-sm">No alerts — all readings within thresholds.</p>
      )}

      <ul className="flex flex-col gap-2">
        {alerts.map((alert) => (
          <li
            key={alert._id}
            className="bg-white dark:bg-gray-900 border border-alert-border rounded-md px-3 py-2 text-sm"
          >
            <div className="flex justify-between font-medium text-alert">
              <span>{alert.sensorId}</span>
              <span>{formatDate(alert.triggeredAt)}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {alert.value} is {alert.direction} threshold {alert.threshold} ({alert.sensorType})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
