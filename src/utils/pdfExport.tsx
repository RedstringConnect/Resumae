import { pdf } from '@react-pdf/renderer';
import { ResumeData, TemplateType } from '../types';
import ModernPDFTemplate from '../components/pdf-templates/ModernPDFTemplate';
import ClassicPDFTemplate from '../components/pdf-templates/ClassicPDFTemplate';
import MinimalPDFTemplate from '../components/pdf-templates/MinimalPDFTemplate';
import ProfessionalPDFTemplate from '../components/pdf-templates/ProfessionalPDFTemplate';
import ExecutivePDFTemplate from '../components/pdf-templates/ExecutivePDFTemplate';
import TechnicalPDFTemplate from '../components/pdf-templates/TechnicalPDFTemplate';

// Function to get the appropriate PDF template component
function getPDFTemplate(templateType: TemplateType, data: ResumeData) {
  switch (templateType) {
    case 'modern':
      return <ModernPDFTemplate data={data} />;
    case 'classic':
      return <ClassicPDFTemplate data={data} />;
    case 'minimal':
      return <MinimalPDFTemplate data={data} />;
    case 'professional':
      return <ProfessionalPDFTemplate data={data} />;
    case 'executive':
      return <ExecutivePDFTemplate data={data} />;
    case 'technical':
      return <TechnicalPDFTemplate data={data} />;
    case 'ugly':
    default:
      // Use ModernPDFTemplate as fallback for ugly template
      return <ModernPDFTemplate data={data} />;
  }
}

export async function exportToPDF(data: ResumeData, template: TemplateType): Promise<void> {
  try {
    // Get the appropriate PDF template
    const pdfDocument = getPDFTemplate(template, data);
    
    // Generate the PDF blob
    const blob = await pdf(pdfDocument).toBlob();
    
    // Create a download link and trigger download
    const fileName = data.personalInfo.fullName
      ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      : 'Resume.pdf';
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again or contact support.');
    throw error;
  }
}

