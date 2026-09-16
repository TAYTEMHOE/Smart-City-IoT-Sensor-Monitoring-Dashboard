import type { Reading } from '../../types/reading.types';

interface ReadingsChartProps {
  readings: Reading[];
}

/**
 * Placeholder: the table view already satisfies the spec's "table and/or
 * chart" requirement. A real chart (Recharts or a minimal SVG one) can be
 * dropped in here later without touching the rest of the dashboard.
 */
export function ReadingsChart({ readings }: ReadingsChartProps) {
  return (
    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm text-gray-500">
      Chart view not yet implemented ({readings.length} readings loaded).
    </div>
  );
}
