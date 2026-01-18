import Papa from 'papaparse';
import { Dataset, Column } from '@/types';
import { inferColumnType, calculateColumnStats } from '@/utils/dataAnalysis';

export interface CSVParseResult {
  data: any[];
  columns: string[];
  errors: any[];
}

/**
 * Parse CSV file and return structured data
 */
export async function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          data: results.data,
          columns: results.meta.fields || [],
          errors: results.errors,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

/**
 * Create dataset from parsed CSV data
 */
export function createDatasetFromCSV(
  id: string,
  name: string,
  sourceId: string,
  parseResult: CSVParseResult
): Dataset {
  const { data, columns: columnNames } = parseResult;

  // Analyze each column
  const columns: Column[] = columnNames.map((colName) => {
    const values = data.map((row) => row[colName]);
    const type = inferColumnType(values);
    const stats = calculateColumnStats(values, type);

    return {
      name: colName,
      type,
      originalType: 'string',
      nullable: stats.nullCount > 0,
      unique: stats.uniqueCount === stats.count,
      stats,
    };
  });

  return {
    id,
    name,
    sourceId,
    columns,
    rowCount: data.length,
    data,
    metadata: {
      analyzedAt: new Date(),
      suggestedChartTypes: [],
      relationships: [],
    },
  };
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: any[], filename: string): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
