import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ onDataUploaded }) => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [fileName, setFileName] = useState('');

  const processFile = useCallback((file) => {
    setFileName(file.name);
    setUploadStatus('processing');

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      // Process CSV file
      Papa.parse(file, {
        complete: (results) => {
          if (results.errors.length > 0) {
            setUploadStatus('error');
            console.error('CSV parsing errors:', results.errors);
            return;
          }
          
          const data = results.data.filter(row => 
            row.some(cell => cell && cell.toString().trim() !== '')
          );
          
          if (data.length > 0) {
            const headers = data[0];
            const rows = data.slice(1).map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
            
            onDataUploaded(rows);
            setUploadStatus('success');
          } else {
            setUploadStatus('error');
          }
        },
        header: false,
        skipEmptyLines: true
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      // Process Excel file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length > 0) {
            const headers = jsonData[0];
            const rows = jsonData.slice(1).map(row => {
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            }).filter(row => Object.values(row).some(val => val && val.toString().trim() !== ''));
            
            onDataUploaded(rows);
            setUploadStatus('success');
          } else {
            setUploadStatus('error');
          }
        } catch (error) {
          console.error('Excel parsing error:', error);
          setUploadStatus('error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setUploadStatus('error');
    }
  }, [onDataUploaded]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-green-bright/20 hover-lift">
      <h3 className="text-lg font-semibold mb-4 flex items-center gradient-text">
        <Upload className="w-5 h-5 mr-2" />
        Upload Shipping Data
      </h3>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-green-bright bg-green-bright/10 scale-105'
            : 'border-green-bright/30 hover:border-green-bright/60 hover:bg-green-bright/5'
        }`}
      >
        <input {...getInputProps()} />
        
        {uploadStatus === 'processing' ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-bright mb-4"></div>
            <p className="text-white">Processing {fileName}...</p>
          </div>
        ) : uploadStatus === 'success' ? (
          <div className="flex flex-col items-center text-green-bright">
            <CheckCircle className="w-8 h-8 mb-4 animate-pulse-green" />
            <p className="font-medium">File uploaded successfully!</p>
            <p className="text-sm text-muted-foreground mt-2">{fileName}</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="flex flex-col items-center text-red-400">
            <AlertCircle className="w-8 h-8 mb-4" />
            <p className="font-medium">Error processing file</p>
            <p className="text-sm text-muted-foreground mt-2">Please try again with a valid CSV or Excel file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-green-bright font-medium">Drop the file here...</p>
            ) : (
              <>
                <p className="text-white font-medium mb-2">
                  Drag & drop your shipping data file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to select a file
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports CSV, XLS, and XLSX files
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      {uploadStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-bright/10 border border-green-bright/20 rounded-lg hover-lift">
          <p className="text-sm text-green-bright">
            ✓ Data loaded successfully. You can now filter by customer name.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 