# React BI System

A modern Business Intelligence platform built with React, TypeScript, and Tailwind CSS. Connect to multiple data sources, analyze data automatically, and create interactive visualizations with an Excel-like chart builder.

## Features

### Phase 1 (Implemented)
- ✅ CSV file upload and parsing
- ✅ Excel file (.xlsx, .xls) upload with sheet selection
- ✅ Automatic data type inference
- ✅ Statistical analysis of columns
- ✅ Chart builder with multiple chart types
- ✅ Interactive UI with dark mode support
- ✅ Type-safe state management with Zustand
- ✅ Modern component architecture

### Upcoming Features
- 🔄 BigQuery integration
- 🔄 Live chart preview with Recharts/ECharts
- 🔄 Advanced chart customization
- 🔄 Calculated fields and filters
- 🔄 Dashboard builder with drag-and-drop layout
- 🔄 Export capabilities (PNG, SVG, PDF)
- 🔄 Data transformations and aggregations

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with Immer
- **Data Processing**:
  - PapaParse for CSV
  - SheetJS (XLSX) for Excel
  - DuckDB-WASM for in-browser SQL (future)
- **Charting**: Recharts & Apache ECharts
- **Icons**: Lucide React
- **Utilities**: date-fns, Apache Arrow

## Project Structure

```
bi-system/
├── src/
│   ├── components/
│   │   ├── Common/           # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── DataGrid/
│   │   ├── DataSources/      # Data source connectors
│   │   │   ├── CSV/
│   │   │   ├── Excel/
│   │   │   └── BigQuery/
│   │   ├── ChartBuilder/     # Chart configuration UI
│   │   │   ├── ConfigPanel/
│   │   │   ├── ChartTypes/
│   │   │   └── Preview/
│   │   └── Dashboard/        # Dashboard components
│   ├── services/             # Data parsing & API services
│   │   ├── csvParser.ts
│   │   ├── excelParser.ts
│   │   └── bigQueryService.ts
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   ├── dataAnalysis.ts
│   │   ├── formatters.ts
│   │   └── cn.ts
│   ├── store/                # Zustand state management
│   ├── styles/               # Global styles
│   ├── App.tsx               # Main application
│   └── main.tsx              # Entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Navigate to the project directory:
```bash
cd bi-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage Guide

### 1. Upload Data

**CSV Files:**
1. Go to the "Data Sources" tab
2. Click on the CSV uploader
3. Select your CSV file
4. Click "Upload and Analyze"

**Excel Files:**
1. Go to the "Data Sources" tab
2. Click on the Excel uploader
3. Select your Excel file (.xlsx or .xls)
4. Choose the sheet you want to analyze
5. Click "Upload and Analyze"

### 2. Create Charts

1. Navigate to the "Chart Builder" tab
2. Select a chart type (Bar, Line, Pie, etc.)
3. Choose your X-axis column (categories)
4. Choose your Y-axis column (measurements)
5. Select an aggregation method (Sum, Average, Count, etc.)
6. Click "Create Chart"

### 3. Build Dashboards (Coming Soon)

Combine multiple charts into interactive dashboards with drag-and-drop layouts.

## Key Components

### Data Analysis
The system automatically analyzes uploaded data:
- **Type Inference**: Automatically detects numeric, categorical, temporal, text, and boolean columns
- **Statistics**: Calculates min, max, mean, median, mode, standard deviation
- **Suggestions**: Recommends appropriate chart types based on data structure

### Chart Types
- Line Chart
- Area Chart
- Bar Chart (Horizontal/Vertical)
- Scatter Plot
- Bubble Chart
- Pie Chart
- Donut Chart
- Heatmap
- Treemap
- Combo Charts

### State Management
Using Zustand for efficient state management:
- Data sources
- Datasets
- Charts
- Dashboards
- Current selections

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Code Structure Guidelines
- Components are organized by feature
- Shared components go in `Common/`
- Each component has its own directory with an `index.tsx`
- Services handle data processing and external APIs
- Types are centralized in `src/types/`
- Utilities are pure functions in `src/utils/`

## Configuration

### Path Aliases
The project uses TypeScript path aliases for cleaner imports:
- `@/` → `src/`
- `@/components/` → `src/components/`
- `@/services/` → `src/services/`
- `@/types/` → `src/types/`
- `@/utils/` → `src/utils/`
- `@/store/` → `src/store/`

### Tailwind Configuration
Custom color palette and dark mode support are configured in `tailwind.config.js`

## BigQuery Integration (Coming Soon)

BigQuery operations require server-side implementation for security. You'll need to:
1. Set up a backend API server
2. Implement OAuth 2.0 authentication
3. Proxy BigQuery requests through your server
4. Handle credentials securely

Example server endpoints needed:
- `GET /api/bigquery/datasets` - List datasets
- `GET /api/bigquery/tables` - List tables
- `POST /api/bigquery/query` - Execute query
- `GET /api/bigquery/schema` - Get table schema

## Performance Considerations

- Virtual scrolling for large datasets (react-window)
- Web Workers for data processing
- Lazy loading and code splitting
- Memoization for expensive computations
- Debounced search and filters

## Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking and linting
4. Test your changes
5. Submit a pull request

## Troubleshooting

### Common Issues

**CSV parsing errors:**
- Ensure your CSV has headers in the first row
- Check for proper delimiter usage (comma, semicolon, tab)
- Verify file encoding (UTF-8 recommended)

**Excel file not loading:**
- Ensure file format is .xlsx or .xls
- Check that the file isn't password protected
- Verify the selected sheet contains data

**Chart not displaying:**
- Ensure you've selected both X and Y axes
- Verify the Y-axis column is numeric
- Check browser console for errors

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
