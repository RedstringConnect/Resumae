import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ResumeData } from '@/types';
import toast from 'react-hot-toast';

interface ResumeParserProps {
  onParseComplete: (data: ResumeData) => void;
}

export default function ResumeParser({ }: ResumeParserProps) {
  const [isUploading] = useState(false);
  const [isParsing] = useState(false);
  const [uploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Feature temporarily disabled
    toast.error('PDF upload is temporarily unavailable. Groq/Llama models don\'t support PDF extraction yet. Please use the manual Resume Builder.', { 
      duration: 6000,
      icon: '⚠️'
    });
    event.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Existing Resume (Temporarily Unavailable)
        </CardTitle>
        <CardDescription>
          PDF upload feature is temporarily disabled while we transition to Groq/Llama models. Llama doesn't support vision/PDF processing yet. Please use the manual Resume Builder tab instead.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Feature Temporarily Unavailable</p>
              <p>PDF extraction requires vision-capable AI models. Our new Groq/Llama integration doesn't support this yet. Please switch to the "Resume Builder" tab to create your resume manually.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 opacity-50 pointer-events-none">
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

          <Button 
            onClick={handleClick} 
            disabled={isUploading || isParsing}
            className="w-full max-w-md"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Choose PDF File
              </>
            )}
          </Button>

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
