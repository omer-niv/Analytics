import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Common/Button';
import { Card } from '@/components/Common/Card';
import { parseCSVFile, createDatasetFromCSV } from '@/services/csvParser';
import { useBIStore } from '@/store';
import { DataSourceType } from '@/types';
import { formatFileSize } from '@/utils/formatters';

export const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addDataSource, addDataset } = useBIStore();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parseResult = await parseCSVFile(file);

      if (parseResult.errors.length > 0) {
        console.warn('CSV parsing warnings:', parseResult.errors);
      }

      // Create data source
      const sourceId = `csv-${Date.now()}`;
      const dataSource = {
        id: sourceId,
        name: file.name,
        type: DataSourceType.CSV,
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
      const dataset = createDatasetFromCSV(
        `dataset-${Date.now()}`,
        file.name.replace('.csv', ''),
        sourceId,
        parseResult
      );

      addDataset(dataset);

      setFile(null);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      setLoading(false);
    }
  };

  return (
    <Card title="Upload CSV File">
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">CSV files only</p>
          </label>
        </div>

        {file && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FileText size={24} className="text-primary-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Upload and Analyze'}
        </Button>
      </div>
    </Card>
  );
};
