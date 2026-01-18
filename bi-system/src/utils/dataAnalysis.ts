import { Column, ColumnType, ColumnStats, ChartType } from '@/types';

/**
 * Infer column type from data samples
 */
export function inferColumnType(values: any[]): ColumnType {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) return ColumnType.TEXT;

  // Check if temporal
  const dateCount = nonNullValues.filter((v) => {
    const date = new Date(v);
    return !isNaN(date.getTime());
  }).length;

  if (dateCount / nonNullValues.length > 0.8) {
    return ColumnType.TEMPORAL;
  }

  // Check if numeric
  const numericCount = nonNullValues.filter((v) => {
    return !isNaN(parseFloat(v)) && isFinite(v);
  }).length;

  if (numericCount / nonNullValues.length > 0.8) {
    return ColumnType.NUMERIC;
  }

  // Check if boolean
  const booleanCount = nonNullValues.filter((v) => {
    const lower = String(v).toLowerCase();
    return ['true', 'false', '0', '1', 'yes', 'no'].includes(lower);
  }).length;

  if (booleanCount / nonNullValues.length > 0.8) {
    return ColumnType.BOOLEAN;
  }

  // Check if categorical (low cardinality)
  const uniqueValues = new Set(nonNullValues);
  if (uniqueValues.size / nonNullValues.length < 0.5) {
    return ColumnType.CATEGORICAL;
  }

  return ColumnType.TEXT;
}

/**
 * Calculate statistics for a column
 */
export function calculateColumnStats(values: any[], type: ColumnType): ColumnStats {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
  const count = values.length;
  const nullCount = count - nonNullValues.length;
  const uniqueCount = new Set(nonNullValues).size;

  const stats: ColumnStats = {
    count,
    nullCount,
    uniqueCount,
  };

  if (type === ColumnType.NUMERIC) {
    const numbers = nonNullValues.map((v) => parseFloat(v)).filter((n) => !isNaN(n));

    if (numbers.length > 0) {
      stats.min = Math.min(...numbers);
      stats.max = Math.max(...numbers);
      stats.mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;

      // Median
      const sorted = [...numbers].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      stats.median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

      // Standard Deviation
      const variance = numbers.reduce((sum, n) => sum + Math.pow(n - stats.mean!, 2), 0) / numbers.length;
      stats.stdDev = Math.sqrt(variance);
    }
  }

  if (type === ColumnType.TEMPORAL) {
    const dates = nonNullValues.map((v) => new Date(v)).filter((d) => !isNaN(d.getTime()));

    if (dates.length > 0) {
      stats.min = new Date(Math.min(...dates.map((d) => d.getTime())));
      stats.max = new Date(Math.max(...dates.map((d) => d.getTime())));
    }
  }

  // Mode (most frequent value)
  if (nonNullValues.length > 0) {
    const frequency = new Map<any, number>();
    nonNullValues.forEach((v) => {
      frequency.set(v, (frequency.get(v) || 0) + 1);
    });

    let maxFreq = 0;
    let mode: any;
    frequency.forEach((freq, value) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = value;
      }
    });
    stats.mode = mode;
  }

  return stats;
}

/**
 * Analyze dataset and suggest appropriate chart types
 */
export function suggestChartTypes(columns: Column[]): ChartType[] {
  const suggestions: ChartType[] = [];

  const numericColumns = columns.filter((c) => c.type === ColumnType.NUMERIC);
  const categoricalColumns = columns.filter((c) => c.type === ColumnType.CATEGORICAL);
  const temporalColumns = columns.filter((c) => c.type === ColumnType.TEMPORAL);

  // Time series data
  if (temporalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push(ChartType.LINE, ChartType.AREA);
  }

  // Categorical vs Numeric
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    suggestions.push(ChartType.BAR, ChartType.COLUMN);

    // Pie chart for single categorical with few categories
    if (categoricalColumns.length === 1 && categoricalColumns[0].stats) {
      const uniqueCount = categoricalColumns[0].stats.uniqueCount;
      if (uniqueCount <= 8) {
        suggestions.push(ChartType.PIE, ChartType.DONUT);
      }
    }
  }

  // Multiple numeric columns
  if (numericColumns.length >= 2) {
    suggestions.push(ChartType.SCATTER);

    if (numericColumns.length >= 3) {
      suggestions.push(ChartType.BUBBLE);
    }
  }

  // Heatmap for categorical vs categorical
  if (categoricalColumns.length >= 2) {
    suggestions.push(ChartType.HEATMAP);
  }

  // Default fallbacks
  if (suggestions.length === 0) {
    suggestions.push(ChartType.BAR, ChartType.LINE);
  }

  return suggestions;
}

/**
 * Detect correlations between numeric columns
 */
export function calculateCorrelation(values1: number[], values2: number[]): number {
  if (values1.length !== values2.length || values1.length === 0) {
    return 0;
  }

  const n = values1.length;
  const mean1 = values1.reduce((a, b) => a + b, 0) / n;
  const mean2 = values2.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = values1[i] - mean1;
    const diff2 = values2[i] - mean2;
    numerator += diff1 * diff2;
    sum1 += diff1 * diff1;
    sum2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sum1 * sum2);
  return denominator === 0 ? 0 : numerator / denominator;
}
