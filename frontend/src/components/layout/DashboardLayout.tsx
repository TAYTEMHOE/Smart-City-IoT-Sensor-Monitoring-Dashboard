import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  filters: ReactNode;
  main: ReactNode;
  sidebar: ReactNode;
}

export function DashboardLayout({ filters, main, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Smart City IoT Sensor Monitoring Dashboard</h1>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
        {filters}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="flex flex-col gap-4">{main}</div>
          <div>{sidebar}</div>
        </div>
      </main>
    </div>
  );
}
