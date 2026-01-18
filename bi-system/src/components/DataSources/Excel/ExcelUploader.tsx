import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { parseExcelFile, createDatasetFromExcel } from '@/services/excelParser';
import { useBIStore } from '@/store';
import { DataSourceType } from '@/types';
import { formatFileSize } from '@/utils/formatters';

export const ExcelUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addDataSource, addDataset } = useBIStore();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select an Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError(null);

      // Parse to get sheet names
      try {
        const parseResult = await parseExcelFile(selectedFile);
        setSheets(parseResult.sheets);
        setSelectedSheet(parseResult.sheets[0] || '');
      } catch (err) {
        setError('Failed to read Excel file');
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedSheet) return;

    setLoading(true);
    setError(null);

    try {
      const parseResult = await parseExcelFile(file);
      const sheetData = parseResult.data[selectedSheet];

      if (!sheetData || sheetData.length === 0) {
        throw new Error('Selected sheet is empty');
      }

      // Create data source
      const sourceId = `excel-${Date.now()}`;
      const dataSource = {
        id: sourceId,
        name: file.name,
        type: DataSourceType.EXCEL,
        config: {
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date(),
        },
        createdAt: new Date(),
        lastModified: new Date(),
      };

      addDataSource(dataSource);

      // Create dataset
      const dataset = createDatasetFromExcel(
        `dataset-${Date.now()}`,
        `${file.name} - ${selectedSheet}`,
        sourceId,
        sheetData
      );

      addDataset(dataset);

      setFile(null);
      setSheets([]);
      setSelectedSheet('');
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
      setLoading(false);
    }
  };

  return (
    <Card title="Upload Excel File">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">Excel files (.xlsx, .xls)</p>
          </label>
        </div>

        {file && (
          <>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <FileSpreadsheet size={24} className="text-primary-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>

            {sheets.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Sheet
                </label>
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {sheets.map((sheet) => (
                    <option key={sheet} value={sheet}>
                      {sheet}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || !selectedSheet || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Upload and Analyze'}
        </Button>
      </div>
    </Card>
  );
};
