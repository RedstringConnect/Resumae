import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ResumeData } from '@/types';
import { extractResumeFromPDF } from '@/services/groqService';
import toast from 'react-hot-toast';

interface ResumeParserProps {
  onParseComplete: (data: ResumeData) => void;
}

export default function ResumeParser({ onParseComplete }: ResumeParserProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsParsing(true);
    setUploadStatus('idle');
    setErrorMessage('');

    toast.loading('Extracting resume data with AI... This may take a moment.', { id: 'upload' });

    try {
      const extractedData = await extractResumeFromPDF(file);
      
      if (extractedData) {
        toast.success('Resume extracted successfully!', { id: 'upload' });
        onParseComplete(extractedData);
        setUploadStatus('success');
      } else {
        setErrorMessage('Failed to extract resume data. Please try again or use the manual builder.');
        setUploadStatus('error');
        toast.error('Failed to extract resume data. Please try again or use the manual builder.', { id: 'upload', duration: 5000 });
      }
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      
      if (error?.message === 'RATE_LIMIT_EXCEEDED') {
        setErrorMessage('API rate limit exceeded. Please wait a few minutes and try again.');
        toast.error(
          'API rate limit exceeded. Please wait a few minutes and try again.',
          { id: 'upload', duration: 6000 }
        );
      } else {
        setErrorMessage('Failed to parse resume. Please try again.');
        toast.error('Failed to process resume. Please try again later.', { id: 'upload' });
      }
      setUploadStatus('error');
    } finally {
      setIsParsing(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Existing Resume
        </CardTitle>
        <CardDescription>
          Upload your existing resume (PDF) and let AI extract the information automatically to save time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div
            onClick={handleClick}
            className={`
              w-full max-w-md h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
              ${uploadStatus === 'error' 
                ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                : uploadStatus === 'success'
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }
            `}
          >
            {isParsing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Parsing your resume...</p>
              </div>
            ) : uploadStatus === 'success' ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
                <p className="text-sm text-green-600 font-medium">Resume parsed successfully!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only, max 10MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

         

          {uploadStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>Note: AI-powered extraction. Please review and edit the extracted information as needed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
