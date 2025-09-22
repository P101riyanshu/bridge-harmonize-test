import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  Image, 
  Video, 
  X, 
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';

interface FileUploadProps {
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  existingFiles?: string[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  progress?: number;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  existingFiles = []
}) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed.`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of acceptedFiles) {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds ${maxSize}MB limit.`,
          variant: "destructive",
        });
        continue;
      }

      const fileId = `${Date.now()}-${file.name}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: '',
        progress: 0
      };

      newFiles.push(newFile);
      setUploadedFiles(prev => [...prev, newFile]);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === fileId && f.progress !== undefined && f.progress < 90
                ? { ...f, progress: f.progress + 10 }
                : f
            )
          );
        }, 200);

        const response = await api.uploadFile(file);

        clearInterval(progressInterval);

        if (response.success && response.data) {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === fileId
                ? { ...f, url: response.data!.url, progress: 100 }
                : f
            )
          );
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      } catch (error) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === fileId
              ? { ...f, error: error instanceof Error ? error.message : 'Upload failed', progress: undefined }
              : f
          )
        );
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
  }, [uploadedFiles, maxFiles, maxSize, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploading || uploadedFiles.length >= maxFiles
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    updateParent();
  };

  const updateParent = () => {
    const urls = uploadedFiles.filter(f => f.url && !f.error).map(f => f.url);
    onFilesChange([...existingFiles, ...urls]);
  };

  React.useEffect(() => {
    updateParent();
  }, [uploadedFiles]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
              ${uploading || uploadedFiles.length >= maxFiles 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop files here...</p>
            ) : (
              <div className="space-y-2">
                <p className="font-medium">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Max {maxFiles} files, up to {maxSize}MB each
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: Images, PDFs, Text files
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Uploaded Files</h4>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  {file.progress !== undefined && file.progress < 100 && !file.error && (
                    <div className="w-20">
                      <Progress value={file.progress} className="h-2" />
                    </div>
                  )}

                  {file.error && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error
                    </Badge>
                  )}

                  {file.url && !file.error && (
                    <Badge variant="default" className="text-xs">
                      <Upload className="h-3 w-3 mr-1" />
                      Uploaded
                    </Badge>
                  )}

                  <div className="flex items-center gap-1">
                    {file.url && !file.error && (
                      <>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-3 w-3" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={file.url} download={file.name}>
                            <Download className="h-3 w-3" />
                          </a>
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUpload;