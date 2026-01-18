import React, { useState } from 'react';
import { Database, BarChart3, LayoutDashboard, Settings } from 'lucide-react';
import { CSVUploader } from '@/components/DataSources/CSV/CSVUploader';
import { ExcelUploader } from '@/components/DataSources/Excel/ExcelUploader';
import { ChartBuilder } from '@/components/ChartBuilder';
import { Button } from '@/components/Common/Button';
import { useBIStore } from '@/store';

type TabType = 'data' | 'charts' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('data');
  const { datasets, charts } = useBIStore();

  const tabs = [
    { id: 'data' as TabType, label: 'Data Sources', icon: Database },
    { id: 'charts' as TabType, label: 'Chart Builder', icon: BarChart3 },
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 size={32} className="text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                BI System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {datasets.length} datasets • {charts.length} charts
              </span>
              <Button variant="ghost" size="sm">
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'data' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Connect Data Sources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CSVUploader />
                <ExcelUploader />
              </div>
            </div>

            {datasets.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Your Datasets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        {dataset.name}
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>{dataset.rowCount.toLocaleString()} rows</p>
                        <p>{dataset.columns.length} columns</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartBuilder />
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Chart Preview
              </h3>
              <div className="flex items-center justify-center h-96 text-gray-500">
                Select chart options to see preview
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="text-center py-12">
            <LayoutDashboard size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Dashboard Builder
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create charts first, then build your dashboard
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
