# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React BI System                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌─────▼─────┐        ┌─────▼─────┐
   │  Data   │          │  Chart    │        │ Dashboard │
   │ Sources │          │  Builder  │        │  Builder  │
   └────┬────┘          └─────┬─────┘        └─────┬─────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Zustand Store    │
                    │  (Global State)    │
                    └────────────────────┘
```

## Data Flow

```
┌──────────────┐
│ File Upload  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Parser Service   │ ←─── CSV/Excel/BigQuery
│ (csvParser.ts,   │
│  excelParser.ts) │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Data Analysis    │ ←─── Type Inference
│ (dataAnalysis.ts)│      Statistics
└──────┬───────────┘      Correlations
       │
       ▼
┌──────────────────┐
│   Dataset        │ ←─── Stored in Zustand
│ {columns, data,  │
│  metadata}       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Chart Builder    │ ←─── User Configuration
│                  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Chart Renderer   │ ←─── Recharts/ECharts
│                  │
└──────────────────┘
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Stats Display
│   └── Settings Button
│
├── Navigation Tabs
│   ├── Data Sources Tab
│   ├── Chart Builder Tab
│   └── Dashboard Tab
│
└── Main Content
    │
    ├── [Data Sources View]
    │   ├── CSVUploader
    │   │   ├── FileInput
    │   │   ├── FilePreview
    │   │   └── UploadButton
    │   │
    │   ├── ExcelUploader
    │   │   ├── FileInput
    │   │   ├── SheetSelector
    │   │   └── UploadButton
    │   │
    │   ├── BigQueryConnector (future)
    │   │   ├── AuthButton
    │   │   ├── ProjectSelector
    │   │   └── TableBrowser
    │   │
    │   └── DatasetList
    │       └── DatasetCard[]
    │
    ├── [Chart Builder View]
    │   ├── ChartBuilder
    │   │   ├── ChartTypeSelector
    │   │   ├── AxisConfig
    │   │   │   ├── XAxisSelector
    │   │   │   └── YAxisSelector
    │   │   ├── AggregationSelector
    │   │   ├── FilterPanel (future)
    │   │   └── StyleConfig (future)
    │   │
    │   └── ChartPreview
    │       └── [Chart Component]
    │
    └── [Dashboard View]
        ├── DashboardGrid (future)
        │   └── ChartWidget[]
        │
        └── DashboardControls (future)
            ├── AddChartButton
            └── LayoutToggle
```

## State Management Structure

```typescript
BIStore {
  // Data
  dataSources: DataSource[]
  datasets: Dataset[]
  charts: ChartConfig[]
  dashboards: Dashboard[]

  // Current Selections
  currentDataset?: string
  currentChart?: string
  currentDashboard?: string

  // Actions
  addDataSource()
  removeDataSource()
  addDataset()
  setCurrentDataset()
  addChart()
  updateChart()
  removeChart()
  addDashboard()
  updateDashboard()
}
```

## Type System

```typescript
// Core Types
DataSource
  ├── id: string
  ├── name: string
  ├── type: DataSourceType (CSV | Excel | BigQuery)
  ├── config: BigQueryConfig | FileConfig
  └── timestamps

Dataset
  ├── id: string
  ├── name: string
  ├── sourceId: string
  ├── columns: Column[]
  ├── data: any[]
  └── metadata: DatasetMetadata

Column
  ├── name: string
  ├── type: ColumnType (numeric | categorical | temporal | text)
  ├── nullable: boolean
  └── stats: ColumnStats

ChartConfig
  ├── id: string
  ├── name: string
  ├── type: ChartType
  ├── datasetId: string
  ├── xAxis: AxisConfig
  ├── yAxis: AxisConfig[]
  ├── series?: SeriesConfig[]
  ├── filters?: Filter[]
  └── style: ChartStyle
```

## Service Layer

```
Services/
├── csvParser.ts
│   ├── parseCSVFile(file) → CSVParseResult
│   ├── createDatasetFromCSV(...)
│   └── exportToCSV(data, filename)
│
├── excelParser.ts
│   ├── parseExcelFile(file) → ExcelParseResult
│   ├── createDatasetFromExcel(...)
│   └── exportToExcel(data, filename)
│
└── bigQueryService.ts
    ├── listBigQueryDatasets(projectId)
    ├── listBigQueryTables(projectId, datasetId)
    ├── getBigQueryTableSchema(table)
    ├── executeBigQueryQuery(projectId, query)
    └── createDatasetFromBigQuery(...)
```

## Utility Functions

```
Utils/
├── dataAnalysis.ts
│   ├── inferColumnType(values) → ColumnType
│   ├── calculateColumnStats(values, type) → ColumnStats
│   ├── suggestChartTypes(columns) → ChartType[]
│   └── calculateCorrelation(values1, values2) → number
│
├── formatters.ts
│   ├── formatNumber(value, decimals)
│   ├── formatCurrency(value, currency)
│   ├── formatPercentage(value, decimals)
│   ├── formatDate(date, format)
│   └── formatFileSize(bytes)
│
└── cn.ts
    └── cn(...inputs) → className string
```

## Performance Optimizations

1. **Code Splitting**
   - Lazy load chart libraries
   - Route-based code splitting
   - Dynamic imports for large components

2. **Data Processing**
   - Web Workers for heavy computations
   - Virtualized lists for large datasets
   - Memoization with useMemo/useCallback

3. **Rendering**
   - React.memo for expensive components
   - Virtual scrolling with react-window
   - Debounced search/filters

4. **State Management**
   - Immer for immutable updates
   - Selective subscriptions in Zustand
   - Normalized state structure

## Security Considerations

1. **File Upload**
   - File type validation
   - Size limits
   - Sanitize file names
   - Scan for malicious content

2. **BigQuery (Server-Side)**
   - OAuth 2.0 authentication
   - Credential encryption
   - Rate limiting
   - Query validation & sanitization

3. **Data Privacy**
   - Client-side processing (no server upload)
   - Secure credential storage
   - No data persistence (optional)

## Extension Points

1. **New Data Sources**
   - Implement parser service
   - Create connector component
   - Add to DataSourceType enum
   - Update store actions

2. **New Chart Types**
   - Add to ChartType enum
   - Create chart component
   - Add to chart type selector
   - Implement data transformation

3. **Custom Calculations**
   - Define calculation interface
   - Add calculation builder UI
   - Implement formula parser
   - Integrate with chart builder

4. **Export Formats**
   - Add export service
   - Implement format converters
   - Create export UI
   - Handle downloads
