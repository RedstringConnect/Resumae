import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Download,
  ArrowLeft,
  LayoutTemplate,
  RotateCcw,
  Save,
  Loader2,
  Sparkles,
  Briefcase,
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import toast from 'react-hot-toast';
import { ResumeData, TemplateType } from '@/types';
import ResumeForm from '@/components/ResumeForm';
import AdvancedATSScanner from '@/components/AdvancedATSScanner';
import PDFATSUploader from '@/components/PDFATSUploader';
import TemplateSelector from '@/components/TemplateSelector';
import { exportToPDF } from '@/utils/pdfExport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';
import UglyTemplate from '@/components/templates/UglyTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { getResumeById, createResume, updateResume } from '@/services/api';

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

const GradientBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <motion.div
      className="absolute top-[-10rem] left-[15%] h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-3xl"
      animate={{
        y: [0, 40, 0],
        scale: [1, 1.06, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[-12rem] right-[12%] h-[30rem] w-[30rem] rounded-full bg-purple-500/10 blur-3xl"
      animate={{
        y: [0, -50, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

// LocalStorage keys
const STORAGE_KEY_RESUME_DATA = 'resumatic_resume_data';
const STORAGE_KEY_TEMPLATE = 'resumatic_selected_template';

const emptyData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  spacing: {
    pageMargin: 20,
    sectionSpacing: 8,
    lineSpacing: 1.2,
    bulletSpacing: 4,
    headerSpacing: 6,
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
};

const sampleData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.dev',
    summary: 'Results-driven Software Engineer with 5+ years of experience building scalable web applications. Passionate about creating efficient, user-friendly solutions and mentoring junior developers. Proven track record of delivering high-impact projects on time.',
  },
  spacing: {
    pageMargin: 20,
    sectionSpacing: 8,
    lineSpacing: 1.2,
    bulletSpacing: 4,
    headerSpacing: 6,
  },
  workExperience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2021',
      endDate: '',
      current: true,
      description: [
        'Led development of microservices architecture serving 2M+ users, improving system reliability by 40%',
        'Mentored team of 5 junior developers, conducting code reviews and technical training sessions',
        'Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
        'Collaborated with product team to design and launch 3 major features, increasing user engagement by 25%',
      ],
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      startDate: 'Jun 2019',
      endDate: 'Dec 2020',
      current: false,
      description: [
        'Built responsive web applications using React, Node.js, and MongoDB',
        'Optimized database queries reducing page load time by 60%',
        'Integrated third-party APIs including Stripe, Twilio, and SendGrid',
        'Participated in agile ceremonies and contributed to sprint planning',
      ],
    },
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', category: 'Programming Languages' },
    { id: '2', name: 'TypeScript', category: 'Programming Languages' },
    { id: '3', name: 'Python', category: 'Programming Languages' },
    { id: '4', name: 'React', category: 'Frontend' },
    { id: '5', name: 'Node.js', category: 'Backend' },
    { id: '6', name: 'MongoDB', category: 'Databases' },
    { id: '7', name: 'PostgreSQL', category: 'Databases' },
    { id: '8', name: 'AWS', category: 'Cloud' },
    { id: '9', name: 'Docker', category: 'DevOps' },
    { id: '10', name: 'Git', category: 'Tools' },
    { id: '11', name: 'Agile/Scrum', category: 'Methodologies' },
    { id: '12', name: 'Problem Solving', category: 'Soft Skills' },
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Spanish', proficiency: 'Professional' },
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: 'Mar 2023',
      url: 'https://aws.amazon.com/certification/',
    },
    {
      id: '2',
      name: 'Professional Scrum Master I',
      issuer: 'Scrum.org',
      date: 'Jan 2022',
      url: 'https://www.scrum.org/professional-scrum-master-i-certification',
    },
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Built a full-stack e-commerce platform with payment processing, inventory management, and admin dashboard',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
      url: 'https://github.com/johndoe/ecommerce',
      date: 'Jan 2023 - Jun 2023',
    },
    {
      id: '2',
      name: 'Task Management App',
      description: 'Developed a collaborative task management application with real-time updates and team features',
      technologies: ['React', 'Firebase', 'Material-UI', 'WebSockets'],
      url: 'https://taskmaster.johndoe.dev',
      date: 'Sep 2022 - Dec 2022',
    },
  ],
};

// Helper function to load data from localStorage
const loadResumeData = (): ResumeData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY_RESUME_DATA);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading resume data from localStorage:', error);
  }
  // Return empty data for fresh start
  return emptyData;
};

// Helper function to load template from localStorage
const loadTemplate = (): TemplateType => {
  try {
    const savedTemplate = localStorage.getItem(STORAGE_KEY_TEMPLATE);
    if (savedTemplate) {
      return savedTemplate as TemplateType;
    }
  } catch (error) {
    console.error('Error loading template from localStorage:', error);
  }
  return 'modern';
};

export default function BuilderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const isNewResume = searchParams.get('new') === 'true';
  const isUploaded = searchParams.get('uploaded') === 'true';

  // If editing existing resume, start with empty data and load from API
  // Otherwise, load from localStorage or use empty data
  const [resumeData, setResumeData] = useState<ResumeData>(resumeId ? emptyData : loadResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(loadTemplate);
  const [isExporting, setIsExporting] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(resumeId);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [isLoadingResume, setIsLoadingResume] = useState(!!resumeId);
  const [showATSModal, setShowATSModal] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');

  // Load sample data when creating a new resume
  useEffect(() => {
    if (isNewResume) {
      setResumeData(sampleData);
      setCurrentResumeId(null);
      setResumeTitle('');
      localStorage.removeItem(STORAGE_KEY_RESUME_DATA);
      toast.success('Sample resume loaded! Replace with your own information.', { duration: 4000 });
    }
  }, [isNewResume]);

  // Load uploaded resume data
  useEffect(() => {
    if (isUploaded) {
      const uploadedData = localStorage.getItem('resumatic_uploaded_data');
      if (uploadedData) {
        try {
          const parsedData = JSON.parse(uploadedData);
          setResumeData(parsedData);
          setCurrentResumeId(null);
          setResumeTitle('');
          localStorage.removeItem('resumatic_uploaded_data');
          toast.success('Resume data loaded! Review and edit as needed.');
        } catch (error) {
          console.error('Error loading uploaded data:', error);
          toast.error('Failed to load uploaded resume data');
        }
      }
    }
  }, [isUploaded]);

  // Load resume from database if resumeId is provided
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId && !isNewResume && !isUploaded) {
        try {
          setIsLoadingResume(true);
          const resume = await getResumeById(resumeId);
          setResumeData(resume.resumeData);
          setSelectedTemplate(resume.templateType);
          setCurrentResumeId(resume._id);
          setResumeTitle(resume.title);
        } catch (error) {
          console.error('Error loading resume:', error);
          toast.error('Failed to load resume');
        } finally {
          setIsLoadingResume(false);
        }
      }
    };

    loadResume();
  }, [resumeId, isNewResume, isUploaded]);

  // Save resume data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESUME_DATA, JSON.stringify(resumeData));
    } catch (error) {
      console.error('Error saving resume data to localStorage:', error);
    }
  }, [resumeData]);

  // Save selected template to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate);
    } catch (error) {
      console.error('Error saving template to localStorage:', error);
    }
  }, [selectedTemplate]);

  const handleDataChange = (data: ResumeData) => {
    try {
      setResumeData(data);
    } catch (error) {
      console.error('BuilderPage: Error updating resume data:', error);
    }
  };

  const handleUploadComplete = (data: ResumeData) => {
    handleDataChange(data);
    // Switch to builder tab after successful upload
    setActiveTab('builder');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(resumeData, selectedTemplate);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data and start fresh? This action cannot be undone.')) {
      const newEmptyData = { ...emptyData };
      setResumeData(newEmptyData);
      setCurrentResumeId(null);
      setResumeTitle('');
      try {
        localStorage.removeItem(STORAGE_KEY_RESUME_DATA);
        localStorage.removeItem(STORAGE_KEY_TEMPLATE);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      toast.success('Resume cleared successfully');
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    if (currentResumeId) {
      handleSaveResume();
    } else {
      setShowSaveDialog(true);
    }
  };

  const handleSaveResume = async () => {
    if (!user) {
      toast.error('Please sign in to save your resume');
      return;
    }

    try {
      setIsSaving(true);

      if (currentResumeId) {
        const updated = await updateResume(currentResumeId, {
          title: resumeTitle || 'Untitled Resume',
          resumeData,
          templateType: selectedTemplate,
        });
        setCurrentResumeId(updated._id);
        toast.success('Resume updated successfully! Redirecting to dashboard...');
        setShowSaveDialog(false);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        const title = resumeTitle || resumeData.personalInfo.fullName || 'Untitled Resume';
        const created = await createResume(
          user.uid,
          user.email || '',
          title,
          resumeData,
          selectedTemplate,
        );
        setCurrentResumeId(created._id);
        setResumeTitle(created.title);
        toast.success('Resume saved successfully! Redirecting to dashboard...');
        setShowSaveDialog(false);
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTemplateName = (template: TemplateType): string => {
    const names: Record<TemplateType, string> = {
      modern: 'Modern',
      classic: 'Classic',
      minimal: 'Minimal',
      professional: 'Professional',
      executive: 'Executive',
      technical: 'Technical',
      ugly: "I Don't Want a Job",
    };
    return names[template];
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'classic':
        return <ClassicTemplate data={resumeData} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} />;
      case 'professional':
        return <ProfessionalTemplate data={resumeData} />;
      case 'executive':
        return <ExecutiveTemplate data={resumeData} />;
      case 'technical':
        return <TechnicalTemplate data={resumeData} />;
      case 'ugly':
        return <UglyTemplate data={resumeData} />;
      default:
        return <ModernTemplate data={resumeData} />;
    }
  };

  if (isLoadingResume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-white to-blue-50 text-gray-700">
        <div className="rounded-2xl border border-blue-100 bg-white/80 px-10 py-8 shadow-lg shadow-blue-500/10">
          <p className="text-base font-medium">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/60">
      <GradientBackdrop />

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md border border-blue-100 bg-white/90 shadow-xl shadow-blue-500/10 backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Save Resume</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="resume-title" className="mb-2 block text-sm font-medium text-gray-700">
              Resume Title
            </label>
            <Input
              id="resume-title"
              placeholder="e.g. Principal Product Manager Resume"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              disabled={isSaving}
              className="border-blue-100 focus-visible:ring-blue-500"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveResume} disabled={isSaving} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Selector Modal */}
      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />

      {/* ATS Score Analysis Modal */}
      <Dialog open={showATSModal} onOpenChange={setShowATSModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-blue-100 bg-white/95 shadow-xl shadow-blue-500/10 backdrop-blur">
         
          <div className="py-4">
            <AdvancedATSScanner data={resumeData} />
          </div>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easing }}
        className="fixed left-0 right-0 top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl"
      >
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
                <img
                  src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                  alt="Resumae"
                  className="h-6 sm:h-9 w-auto"
                />
                <div className="hidden md:flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-semibold tracking-tight">Resumae</span>
                    <span className="text-[8px] font-medium uppercase tracking-wider text-blue-600/60">
                      Beta
                    </span>
                  </div>
                  <span className="text-[11px] text-black/60 -mt-1">
                    Powered by <span className="text-red-500">redstring</span>
                  </span>
                </div>
              </Link>
              <Link
                to={user ? '/dashboard' : '/'}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full  bg-blue-50 border border-blue-300 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 shadow-sm shadow-blue-500/10 transition hover:border-blue-200 hover:text-blue-600 whitespace-nowrap"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
              </Link>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTemplateSelector(true)}
                className="gap-1.5 border-blue-200 bg-white/80 text-gray-700 hover:bg-blue-50 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                size="sm"
              >
                <LayoutTemplate className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{getTemplateName(selectedTemplate)}</span>
              </Button>

              <Button
                onClick={() => setShowATSModal(true)}
                className="gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                size="sm"
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">ATS Score</span>
              </Button>

              {user && (
                <Button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  variant="outline"
                  className="gap-2.5 border-blue-200 bg-blue-600/10 text-blue-700 hover:bg-blue-600 hover:text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                  size="sm"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </Button>
              )}

              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="gap-1.5 bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                size="sm"
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Download PDF'}</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 pt-20 pb-12 sm:pt-28 md:pt-32 sm:pb-16">
        <div className="container mx-auto px-3 sm:px-4">
          <motion.section
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            className="rounded-2xl sm:rounded-2xl border border-blue-100 bg-white/85 p-3 sm:p-4 md:p-6 shadow-2xl shadow-blue-500/10 backdrop-blur"
          >
            <motion.a
              variants={fadeInUp}
              href="https://app.redstring.co.in/talent/login"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 flex flex-col gap-3 rounded-2xl border border-blue-200/70 bg-gradient-to-r from-white via-blue-50 to-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-lg shadow-blue-500/10 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-blue-500/20"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">Land your next role faster</p>
                  <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <img src="/redstring.png" alt="Redstring" className="h-5 w-auto" />
                    <span>Powered by the Redstring Talent Network</span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    Jump into the Resumae Talent Portal to discover openings that match the resume you just polished.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm">
                Visit Job Portal
              </span>
            </motion.a>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl sm:rounded-2xl border border-blue-100 bg-blue-50/60 text-xs sm:text-sm font-semibold text-blue-700 h-auto">
                <TabsTrigger value="builder" className="py-2 sm:py-2.5 text-xs sm:text-sm">Resume Builder</TabsTrigger>
                <TabsTrigger value="upload" className="py-2 sm:py-2.5 text-xs sm:text-sm">Upload & Analyze</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6">
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[420px_1fr]">
                  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 shadow-lg shadow-blue-500/10">
                    <div className="flex items-center justify-between border-b border-blue-100 px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Resume Builder</h2>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="gap-1.5 sm:gap-2 border-blue-100 text-gray-700 hover:bg-blue-50 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                        size="sm"
                      >
                        <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Reset
                      </Button>
                    </div>
                    <div className="h-[500px] sm:h-[600px] md:h-[650px] overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                      <ResumeForm data={resumeData} onChange={handleDataChange} />
                    </div>
                  </div>

                  <div className="hidden overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/75 shadow-lg shadow-blue-500/10 lg:block">
                    <div className="flex items-center justify-between border-b border-blue-100 px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Preview</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSelector(true)}
                        className="gap-1.5 sm:gap-2 text-xs text-blue-600 hover:bg-blue-50 px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                      >
                        <LayoutTemplate className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {getTemplateName(selectedTemplate)}
                      </Button>
                    </div>

                    <div className="h-[600px] md:h-[650px] overflow-y-auto bg-gradient-to-b from-blue-50/40 via-white to-white px-1 py-2">
                      <div
                        className="rounded-xl bg-white shadow-xl shadow-blue-500/20 mx-auto"
                        style={{ 
                          width: '210mm', 
                          transform: 'scale(0.85)', 
                          transformOrigin: 'top center',
                        }}
                      >
                        <div className="resume-preview">{renderTemplate()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden">
                  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 shadow-lg shadow-blue-500/10">
                    <div className="flex items-center justify-between border-b border-blue-100 px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Preview</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSelector(true)}
                        className="gap-1.5 sm:gap-2 text-xs text-blue-600 hover:bg-blue-50 px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                      >
                        <LayoutTemplate className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">{getTemplateName(selectedTemplate)}</span>
                      </Button>
                    </div>
                    <div className="relative overflow-auto bg-gradient-to-b from-blue-50/30 via-white to-white touch-pan-x touch-pan-y" style={{ height: '600px', WebkitOverflowScrolling: 'touch' }}>
                      <div className="inline-block min-w-full" >
                        <div
                          className="rounded-lg sm:rounded-xl bg-white shadow-xl shadow-blue-500/20 mx-auto"
                          style={{
                            width: '210mm',
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                           
                           
                          }}
                        >
                          <div className="resume-preview">{renderTemplate()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 px-3 sm:px-4 py-2 text-center border-t border-blue-100">
                      <p className="text-[10px] sm:text-xs text-gray-600">↔ Scroll to view full resume ↕</p>
                    </div>
                  </div>
                </div>

                <div id="resume-preview" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                  <div style={{ width: '210mm', backgroundColor: '#ffffff' }}>{renderTemplate()}</div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-4 sm:mt-6 md:mt-8">
                <motion.div
                  variants={fadeInUp}
                  className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white/80 p-4 sm:p-6 shadow-lg shadow-blue-500/10 backdrop-blur"
                >
                  <PDFATSUploader onParseComplete={handleUploadComplete} />
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

