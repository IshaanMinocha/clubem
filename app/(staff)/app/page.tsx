'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/app/components/layout/PageContainer';
import { Card, CardHeader } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Badge } from '@/app/components/ui/Badge';
import { FileDropzone, FileList } from '@/app/components/ui/FileDropzone';
import { mockPlatforms } from '@/app/data/mock';
import { UploadIcon, CheckIcon } from '@/app/components/icons';

export default function UploadOrdersPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [newOrderId, setNewOrderId] = useState<string | null>(null);

  const activePlatforms = mockPlatforms.filter(p => p.status === 'active');

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(prev => [...prev, ...selectedFiles]);
    setUploadComplete(false);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadComplete(true);
    setNewOrderId(`ORD-${Date.now().toString().slice(-6)}`);
  };

  const handleViewOrder = () => {
    if (newOrderId) {
      router.push(`/app/orders/${newOrderId}`);
    }
  };

  const handleNewUpload = () => {
    setFiles([]);
    setUploadComplete(false);
    setNewOrderId(null);
  };

  return (
    <PageContainer
      title="Upload Orders"
      description="Upload PDF files from supported food ordering platforms"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader 
              title="Upload PDF Files" 
              description="Drag and drop or click to select PDF files (up to 7 files per order)"
            />

            {!uploadComplete ? (
              <>
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  accept=".pdf"
                  multiple
                  maxFiles={7}
                  maxSize={10 * 1024 * 1024}
                  disabled={isUploading}
                />

                <FileList files={files} onRemove={handleRemoveFile} />

                {files.length > 0 && (
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={handleUpload}
                      isLoading={isUploading}
                      leftIcon={<UploadIcon className="w-4 h-4" />}
                    >
                      {isUploading ? 'Uploading...' : `Upload ${files.length} File${files.length > 1 ? 's' : ''}`}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setFiles([])}
                      disabled={isUploading}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                  <CheckIcon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Upload Successful!
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Your files have been uploaded and order <span className="font-mono font-medium">{newOrderId}</span> is now being processed.
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={handleViewOrder}>
                    View Order
                  </Button>
                  <Button variant="secondary" onClick={handleNewUpload}>
                    Upload More
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Supported Platforms */}
        <div>
          <Card>
            <CardHeader 
              title="Supported Platforms" 
              description="We accept PDF orders from these platforms"
            />
            <ul className="space-y-2">
              {activePlatforms.map(platform => (
                <li 
                  key={platform.id}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {platform.name}
                  </span>
                  <Badge variant="success">Active</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Upload Tips" />
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                Upload up to 7 PDF files per order
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                Maximum file size: 10MB per file
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                Include cover sheets and order labels
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400">•</span>
                Platform will be auto-detected
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

