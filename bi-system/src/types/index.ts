// Data Source Types
export enum DataSourceType {
  BIGQUERY = 'bigquery',
  CSV = 'csv',
  EXCEL = 'excel',
}

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  config: BigQueryConfig | FileConfig;
  createdAt: Date;
  lastModified: Date;
}

export interface BigQueryConfig {
  projectId: string;
  datasetId?: string;
  credentials?: any;
}

export interface FileConfig {
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

// Column and Data Types
export enum ColumnType {
  NUMERIC = 'numeric',
  CATEGORICAL = 'categorical',
  TEMPORAL = 'temporal',
  TEXT = 'text',
  BOOLEAN = 'boolean',
}

export interface Column {
  name: string;
  type: ColumnType;
  originalType: string;
  nullable: boolean;
  unique: boolean;
  stats?: ColumnStats;
}

export interface ColumnStats {
  count: number;
  nullCount: number;
  uniqueCount: number;
  min?: number | string | Date;
  max?: number | string | Date;
  mean?: number;
  median?: number;
  mode?: any;
  stdDev?: number;
}

// Dataset Types
export interface Dataset {
  id: string;
  name: string;
  sourceId: string;
  columns: Column[];
  rowCount: number;
  data: any[];
  metadata: DatasetMetadata;
}

export interface DatasetMetadata {
  analyzedAt: Date;
  suggestedChartTypes: ChartType[];
  relationships: ColumnRelationship[];
}

export interface ColumnRelationship {
  column1: string;
  column2: string;
  type: 'correlation' | 'dependency';
  strength: number;
}

// Chart Types
export enum ChartType {
  LINE = 'line',
  AREA = 'area',
  BAR = 'bar',
  COLUMN = 'column',
  SCATTER = 'scatter',
  BUBBLE = 'bubble',
  PIE = 'pie',
  DONUT = 'donut',
  HEATMAP = 'heatmap',
  TREEMAP = 'treemap',
  COMBO = 'combo',
}

export enum AggregationType {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
  MIN = 'min',
  MAX = 'max',
  MEDIAN = 'median',
  COUNT_DISTINCT = 'count_distinct',
}

export interface ChartConfig {
  id: string;
  name: string;
  type: ChartType;
  datasetId: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig[];
  series?: SeriesConfig[];
  filters?: Filter[];
  style: ChartStyle;
}

export interface AxisConfig {
  column: string;
  label?: string;
  aggregation?: AggregationType;
  scale?: 'linear' | 'logarithmic' | 'time';
  format?: string;
  groupBy?: string;
}

export interface SeriesConfig {
  name: string;
  column: string;
  aggregation: AggregationType;
  color?: string;
}

export interface Filter {
  column: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between';
  value: any;
}

export interface ChartStyle {
  colors: string[];
  showLegend: boolean;
  showGrid: boolean;
  showDataLabels: boolean;
  width?: number;
  height?: number;
}

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: ChartConfig[];
  layout: DashboardLayout[];
  createdAt: Date;
  lastModified: Date;
}

export interface DashboardLayout {
  chartId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// UI State Types
export interface AppState {
  dataSources: DataSource[];
  datasets: Dataset[];
  charts: ChartConfig[];
  dashboards: Dashboard[];
  currentDataset?: string;
  currentChart?: string;
  currentDashboard?: string;
}
