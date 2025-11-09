import ATSScanner from './ATSScanner';
import { ResumeData } from '@/types';

interface AdvancedATSScannerProps {
  data: ResumeData;
}

// This is a wrapper/alias for ATSScanner
export default function AdvancedATSScanner({ data }: AdvancedATSScannerProps) {
  return <ATSScanner data={data} />;
}

