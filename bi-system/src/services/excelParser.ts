import * as XLSX from 'xlsx';
import { Dataset, Column } from '@/types';
import { inferColumnType, calculateColumnStats } from '@/utils/dataAnalysis';

export interface ExcelParseResult {
  sheets: string[];
  data: { [sheetName: string]: any[] };
}

/**
 * Parse Excel file and return all sheets
 */
export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const result: ExcelParseResult = {
          sheets: workbook.SheetNames,
          data: {},
        };

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: null,
          });
          result.data[sheetName] = jsonData;
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Create dataset from Excel sheet data
 */
export function createDatasetFromExcel(
  id: string,
  name: string,
  sourceId: string,
  sheetData: any[]
): Dataset {
  if (!sheetData || sheetData.length === 0) {
    throw new Error('No data found in Excel sheet');
  }

  const columnNames = Object.keys(sheetData[0]);

  // Analyze each column
  const columns: Column[] = columnNames.map((colName) => {
    const values = sheetData.map((row) => row[colName]);
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
    rowCount: sheetData.length,
    data: sheetData,
    metadata: {
      analyzedAt: new Date(),
      suggestedChartTypes: [],
      relationships: [],
    },
  };
}

/**
 * Export data to Excel
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1'): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, filename);
}
