import { useMemo, useState } from 'react';
import { AlertsPanel } from './components/AlertsPanel/AlertsPanel';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ReadingsTable } from './components/ReadingsTable/ReadingsTable';
import { SensorFilterBar, type SensorFilters } from './components/SensorFilterBar/SensorFilterBar';
import { useAlerts } from './hooks/useAlerts';
import { useReadings } from './hooks/useReadings';

function App() {
  const [filters, setFilters] = useState<SensorFilters>({ sensorId: '', sensorType: '' });

  const readingsFilters = useMemo(
    () => ({
      sensorId: filters.sensorId || undefined,
      sensorType: filters.sensorType || undefined,
    }),
    [filters],
  );

  const alertsFilters = useMemo(
    () => ({ sensorId: filters.sensorId || undefined }),
    [filters.sensorId],
  );

  const readings = useReadings(readingsFilters);
  const alerts = useAlerts(alertsFilters);

  return (
    <DashboardLayout
      filters={<SensorFilterBar value={filters} onChange={setFilters} />}
      main={<ReadingsTable readings={readings.data?.data ?? []} loading={readings.loading} />}
      sidebar={<AlertsPanel alerts={alerts.data ?? []} loading={alerts.loading} />}
    />
  );
}

export default App;
