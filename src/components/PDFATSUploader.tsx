import { ResumeData } from '@/types';
import ResumeParser from './ResumeParser';

interface PDFATSUploaderProps {
  onParseComplete: (data: ResumeData) => void;
}

// This is a wrapper/alias for ResumeParser
export default function PDFATSUploader({ onParseComplete }: PDFATSUploaderProps) {
  return <ResumeParser onParseComplete={onParseComplete} />;
}

