import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileUpload } from '@/components/ui/file-upload';
import { 
  Download, 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  X,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportExportProps {
  onImport: (data: any[]) => Promise<void>;
  onExport: (format: 'csv' | 'excel' | 'json') => void;
  dataType: 'products' | 'packages' | 'users';
  className?: string;
}

export function ImportExport({ onImport, onExport, dataType, className }: ImportExportProps) {
  const [open, setOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    try {
      setImporting(true);
      setImportProgress(10);
      
      // Simulate file parsing
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          setImportProgress(40);
          
          let data: any[] = [];
          
          if (file.name.endsWith('.csv')) {
            // Parse CSV
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            data = lines.slice(1).filter(line => line.trim()).map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            });
          } else if (file.name.endsWith('.json')) {
            // Parse JSON
            data = JSON.parse(text);
          }
          
          setImportProgress(70);
          
          // Validate data
          const validationErrors = validateImportData(data);
          setErrors(validationErrors);
          setPreviewData(data.slice(0, 10)); // Show first 10 rows
          
          setImportProgress(100);
          
          if (validationErrors.length === 0) {
            toast({
              title: "File processed successfully",
              description: `Found ${data.length} valid records ready for import.`
            });
          }
        } catch (error) {
          setErrors(['Failed to parse file. Please check the format and try again.']);
          toast({
            title: "Import failed",
            description: "File format is invalid or corrupted.",
            variant: "destructive"
          });
        } finally {
          setImporting(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      setImporting(false);
      setErrors(['Failed to read file.']);
    }
  };

  const validateImportData = (data: any[]): string[] => {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      errors.push('Data must be an array of objects.');
      return errors;
    }
    
    if (data.length === 0) {
      errors.push('File contains no data.');
      return errors;
    }
    
    // Validate based on data type
    const requiredFields = getRequiredFields(dataType);
    
    data.forEach((item, index) => {
      requiredFields.forEach(field => {
        if (!item[field]) {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });
    });
    
    return errors.slice(0, 10); // Limit to 10 errors for display
  };

  const getRequiredFields = (type: string): string[] => {
    switch (type) {
      case 'products':
        return ['name', 'basePrice', 'category'];
      case 'packages':
        return ['name', 'products'];
      case 'users':
        return ['email', 'name', 'role'];
      default:
        return [];
    }
  };

  const handleImport = async () => {
    if (errors.length > 0) {
      toast({
        title: "Cannot import",
        description: "Please fix validation errors first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await onImport(previewData);
      toast({
        title: "Import successful",
        description: `Successfully imported ${previewData.length} ${dataType}.`
      });
      setOpen(false);
      resetImportState();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred during import.",
        variant: "destructive"
      });
    }
  };

  const resetImportState = () => {
    setPreviewData([]);
    setErrors([]);
    setImportProgress(0);
    setImporting(false);
  };

  const handleExport = (format: 'csv' | 'excel' | 'json') => {
    onExport(format);
    toast({
      title: "Export started",
      description: `Exporting ${dataType} as ${format.toUpperCase()}...`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Upload className="h-4 w-4 mr-2" />
          Import/Export
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import/Export {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              uploadProgress={importing ? importProgress : undefined}
              accept=".csv,.xlsx,.json"
            />
            
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Validation Errors:</p>
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm">• {error}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            {previewData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Preview Data ({previewData.length} rows)
                  </h3>
                  <Badge variant={errors.length > 0 ? "destructive" : "secondary"}>
                    {errors.length > 0 ? `${errors.length} errors` : 'Valid'}
                  </Badge>
                </div>
                
                <div className="border rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(previewData[0] || {}).map(key => (
                          <th key={key} className="px-3 py-2 text-left font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 5).map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImport}
                    disabled={errors.length > 0}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Import {previewData.length} Records
                  </Button>
                  <Button variant="outline" onClick={resetImportState}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleExport('csv')}
                className="flex flex-col gap-2 h-24"
              >
                <FileText className="h-8 w-8" />
                Export as CSV
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('excel')}
                className="flex flex-col gap-2 h-24"
              >
                <FileText className="h-8 w-8" />
                Export as Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('json')}
                className="flex flex-col gap-2 h-24"
              >
                <FileText className="h-8 w-8" />
                Export as JSON
              </Button>
            </div>
            
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                Export will include all current {dataType} with their complete data. 
                The file will be downloaded to your device.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}