# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- PapaParse (CSV parsing)
- SheetJS (Excel parsing)
- Recharts & ECharts (charting libraries)
- And more...

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Upload Your First Dataset

1. Click on the "Data Sources" tab
2. Choose CSV or Excel uploader
3. Select a file from your computer
4. Click "Upload and Analyze"

## Sample Data

We've included a sample sales data CSV in `sample-data/sales.csv` for testing.

## Creating Your First Chart

1. After uploading data, go to the "Chart Builder" tab
2. Select a chart type (try "Bar" first)
3. Choose X-axis: Select a categorical column (e.g., "Category", "Product")
4. Choose Y-axis: Select a numeric column (e.g., "Sales", "Revenue")
5. Select aggregation: "Sum" or "Average"
6. Click "Create Chart"

## Project Structure Overview

```
bi-system/
├── src/
│   ├── components/       # React components
│   ├── services/        # Data parsing & APIs
│   ├── store/           # State management
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types

## Next Steps

1. **Explore the Code**: Check out the component structure in `src/components/`
2. **Read the Docs**: See `README.md` for detailed documentation
3. **View Architecture**: Check `ARCHITECTURE.md` for system design
4. **Customize**: Modify `tailwind.config.js` for theme customization

## Tips

- The app supports dark mode (configured in Tailwind)
- All data processing happens client-side (no server required for CSV/Excel)
- BigQuery integration requires server-side setup
- Charts will render in real-time as you configure them

## Common Issues

**Port already in use?**
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

**Types not working?**
```bash
npm run type-check
```

**Styling issues?**
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

## Support

- Check `README.md` for detailed documentation
- Review `ARCHITECTURE.md` for technical details
- Open an issue for bugs or questions

Happy analyzing!
