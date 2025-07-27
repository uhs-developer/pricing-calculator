import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  uploadProgress?: number;
  error?: string;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '.csv,.xlsx,.json',
  maxSize = 5 * 1024 * 1024, // 5MB
  uploadProgress,
  error,
  className
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json']
    },
    maxSize,
    multiple: false
  });

  const clearFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'upload-zone p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive && 'active',
          selectedFile && 'border-accent bg-accent-light/30'
        )}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-accent" />
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearFile}>
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop file here' : 'Choose file or drag & drop'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports CSV, Excel, and JSON files up to {formatFileSize(maxSize)}
              </p>
            </div>
            <Button variant="outline" className="pointer-events-none">
              Browse Files
            </Button>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploadProgress !== undefined && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileRejections[0].errors.map(error => error.message).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Supported Formats */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">CSV</Badge>
        <Badge variant="secondary">Excel</Badge>
        <Badge variant="secondary">JSON</Badge>
      </div>
    </div>
  );
}