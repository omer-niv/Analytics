import React, { useState, useMemo } from 'react';
import { Card } from '@/components/Common/Card';
import { Button } from '@/components/Common/Button';
import { useBIStore } from '@/store';
import { ChartType, AggregationType, ChartConfig, AxisConfig } from '@/types';
import { BarChart, LineChart, PieChart, ScatterChart } from 'lucide-react';

const chartTypeIcons = {
  [ChartType.BAR]: BarChart,
  [ChartType.COLUMN]: BarChart,
  [ChartType.LINE]: LineChart,
  [ChartType.AREA]: LineChart,
  [ChartType.PIE]: PieChart,
  [ChartType.DONUT]: PieChart,
  [ChartType.SCATTER]: ScatterChart,
  [ChartType.BUBBLE]: ScatterChart,
  [ChartType.HEATMAP]: BarChart,
  [ChartType.TREEMAP]: BarChart,
  [ChartType.COMBO]: BarChart,
};

export const ChartBuilder: React.FC = () => {
  const { currentDataset, datasets, addChart } = useBIStore();
  const dataset = datasets.find((d) => d.id === currentDataset);

  const [selectedChartType, setSelectedChartType] = useState<ChartType>(ChartType.BAR);
  const [xAxisColumn, setXAxisColumn] = useState<string>('');
  const [yAxisColumn, setYAxisColumn] = useState<string>('');
  const [aggregation, setAggregation] = useState<AggregationType>(AggregationType.SUM);

  const availableChartTypes = useMemo(() => {
    return [
      ChartType.BAR,
      ChartType.COLUMN,
      ChartType.LINE,
      ChartType.AREA,
      ChartType.PIE,
      ChartType.SCATTER,
    ];
  }, []);

  const handleCreateChart = () => {
    if (!dataset || !xAxisColumn || !yAxisColumn) return;

    const chartConfig: ChartConfig = {
      id: `chart-${Date.now()}`,
      name: `${selectedChartType} Chart`,
      type: selectedChartType,
      datasetId: dataset.id,
      xAxis: {
        column: xAxisColumn,
        label: xAxisColumn,
      },
      yAxis: [
        {
          column: yAxisColumn,
          label: yAxisColumn,
          aggregation,
        },
      ],
      style: {
        colors: ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        showLegend: true,
        showGrid: true,
        showDataLabels: false,
        height: 400,
      },
    };

    addChart(chartConfig);
  };

  if (!dataset) {
    return (
      <Card title="Chart Builder">
        <div className="text-center py-12 text-gray-500">
          Please upload and select a dataset first
        </div>
      </Card>
    );
  }

  return (
    <Card title="Chart Builder">
      <div className="space-y-6">
        {/* Chart Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Chart Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {availableChartTypes.map((type) => {
              const Icon = chartTypeIcons[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedChartType(type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    selectedChartType === type
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* X-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            X-Axis
          </label>
          <select
            value={xAxisColumn}
            onChange={(e) => setXAxisColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="">Select column...</option>
            {dataset.columns.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.type})
              </option>
            ))}
          </select>
        </div>

        {/* Y-Axis Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Y-Axis (Measurement)
          </label>
          <select
            value={yAxisColumn}
            onChange={(e) => setYAxisColumn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="">Select column...</option>
            {dataset.columns
              .filter((col) => col.type === 'numeric')
              .map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
          </select>
        </div>

        {/* Aggregation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aggregation
          </label>
          <select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value as AggregationType)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value={AggregationType.SUM}>Sum</option>
            <option value={AggregationType.AVG}>Average</option>
            <option value={AggregationType.COUNT}>Count</option>
            <option value={AggregationType.MIN}>Minimum</option>
            <option value={AggregationType.MAX}>Maximum</option>
          </select>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateChart}
          disabled={!xAxisColumn || !yAxisColumn}
          className="w-full"
        >
          Create Chart
        </Button>
      </div>
    </Card>
  );
};
