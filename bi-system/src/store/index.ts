import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  AppState,
  DataSource,
  Dataset,
  ChartConfig,
  Dashboard,
} from '@/types';

interface BIStore extends AppState {
  // Data Source Actions
  addDataSource: (dataSource: DataSource) => void;
  removeDataSource: (id: string) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;

  // Dataset Actions
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
  setCurrentDataset: (id: string | undefined) => void;

  // Chart Actions
  addChart: (chart: ChartConfig) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  removeChart: (id: string) => void;
  setCurrentChart: (id: string | undefined) => void;

  // Dashboard Actions
  addDashboard: (dashboard: Dashboard) => void;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  removeDashboard: (id: string) => void;
  setCurrentDashboard: (id: string | undefined) => void;
}

export const useBIStore = create<BIStore>()(
  immer((set) => ({
    // Initial State
    dataSources: [],
    datasets: [],
    charts: [],
    dashboards: [],
    currentDataset: undefined,
    currentChart: undefined,
    currentDashboard: undefined,

    // Data Source Actions
    addDataSource: (dataSource) =>
      set((state) => {
        state.dataSources.push(dataSource);
      }),

    removeDataSource: (id) =>
      set((state) => {
        state.dataSources = state.dataSources.filter((ds) => ds.id !== id);
      }),

    updateDataSource: (id, updates) =>
      set((state) => {
        const index = state.dataSources.findIndex((ds) => ds.id === id);
        if (index !== -1) {
          state.dataSources[index] = { ...state.dataSources[index], ...updates };
        }
      }),

    // Dataset Actions
    addDataset: (dataset) =>
      set((state) => {
        state.datasets.push(dataset);
        state.currentDataset = dataset.id;
      }),

    removeDataset: (id) =>
      set((state) => {
        state.datasets = state.datasets.filter((ds) => ds.id !== id);
        if (state.currentDataset === id) {
          state.currentDataset = undefined;
        }
      }),

    setCurrentDataset: (id) =>
      set((state) => {
        state.currentDataset = id;
      }),

    // Chart Actions
    addChart: (chart) =>
      set((state) => {
        state.charts.push(chart);
        state.currentChart = chart.id;
      }),

    updateChart: (id, updates) =>
      set((state) => {
        const index = state.charts.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.charts[index] = { ...state.charts[index], ...updates };
        }
      }),

    removeChart: (id) =>
      set((state) => {
        state.charts = state.charts.filter((c) => c.id !== id);
        if (state.currentChart === id) {
          state.currentChart = undefined;
        }
      }),

    setCurrentChart: (id) =>
      set((state) => {
        state.currentChart = id;
      }),

    // Dashboard Actions
    addDashboard: (dashboard) =>
      set((state) => {
        state.dashboards.push(dashboard);
        state.currentDashboard = dashboard.id;
      }),

    updateDashboard: (id, updates) =>
      set((state) => {
        const index = state.dashboards.findIndex((d) => d.id === id);
        if (index !== -1) {
          state.dashboards[index] = { ...state.dashboards[index], ...updates };
        }
      }),

    removeDashboard: (id) =>
      set((state) => {
        state.dashboards = state.dashboards.filter((d) => d.id !== id);
        if (state.currentDashboard === id) {
          state.currentDashboard = undefined;
        }
      }),

    setCurrentDashboard: (id) =>
      set((state) => {
        state.currentDashboard = id;
      }),
  }))
);
