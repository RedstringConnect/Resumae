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
  Eye,
  Edit,
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
import { useReferral } from '@/contexts/ReferralContext';
import { getResumeById, createResume, updateResume } from '@/services/api';
import RewardsCenter from '@/components/RewardsCenter';

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

const GradientOrbs = () => (
  <>
    <motion.div
      className="absolute top-[-12rem] -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2563eb]/10 blur-3xl"
      animate={{
        y: [0, 40, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[-14rem] -left-24 h-[30rem] w-[30rem] rounded-full bg-[#2563eb]/5 blur-3xl"
      animate={{
        y: [0, -50, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.06),rgba(255,255,255,0))]" />
  </>
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
  const { user, signInWithGoogle } = useAuth();
  const { credits } = useReferral();
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
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState<'save' | 'download' | 'ats' | null>(null);
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

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
          // Remove both uploaded data and any existing draft
          localStorage.removeItem('resumatic_uploaded_data');
          localStorage.removeItem(STORAGE_KEY_RESUME_DATA);
          // Set the uploaded data as the new draft
          localStorage.setItem(STORAGE_KEY_RESUME_DATA, uploadedData);
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

  // Save resume data to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_RESUME_DATA, JSON.stringify(resumeData));
      } catch (error) {
        console.error('Error saving resume data to localStorage:', error);
      }
    }, 1000); // Debounce by 1000ms (1 second)

    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  // Save selected template to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate);
    } catch (error) {
      console.error('Error saving template to localStorage:', error);
    }
  }, [selectedTemplate]);

  // Execute pending action after user logs in
  useEffect(() => {
    if (user && pendingActionAfterLogin && loginAction) {
      setPendingActionAfterLogin(false);
      
      if (loginAction === 'save') {
        if (currentResumeId) {
          handleSaveResume();
        } else {
          setShowSaveDialog(true);
        }
      } else if (loginAction === 'download') {
        setIsExporting(true);
        exportToPDF(resumeData, selectedTemplate)
          .then(() => {
            toast.success('PDF downloaded successfully!');
          })
          .catch((error) => {
            console.error('Error exporting PDF:', error);
            toast.error('Failed to export PDF. Please try again.');
          })
          .finally(() => {
            setIsExporting(false);
          });
      } else if (loginAction === 'ats') {
        setShowATSModal(true);
      }
      setLoginAction(null);
    }
  }, [user, pendingActionAfterLogin, loginAction, currentResumeId, resumeData, selectedTemplate]);

  const handleDataChange = (data: ResumeData) => {
    try {
      // Use functional update to avoid stale closures
      setResumeData(data);
    } catch (error) {
      console.error('BuilderPage: Error updating resume data:', error);
    }
  };

  const handleUploadComplete = (data: ResumeData) => {
    // Clear localStorage before setting uploaded data
    localStorage.removeItem('resumatic_uploaded_data');
    setResumeData(data);
    // Switch to builder tab after successful upload
    setActiveTab('builder');
    toast.success('Resume loaded! You can now edit and customize it.');
  };

  const handleExportPDF = async () => {
    if (!user) {
      setLoginAction('download');
      setShowLoginModal(true);
      return;
    }
    
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
      setLoginAction('save');
      setShowLoginModal(true);
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
      setLoginAction('save');
      setShowLoginModal(true);
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

  const handleLoginAndContinue = async () => {
    try {
      await signInWithGoogle();
      toast.success('Signed in successfully!');
      setShowLoginModal(false);
      setPendingActionAfterLogin(true);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to sign in. Please try again.');
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-white to-[#e9f1ff] text-gray-700">
        <div className="rounded-2xl border border-[#dbeafe] bg-white/80 px-10 py-8 shadow-lg shadow-[rgba(37,99,235,0.12)]">
          <p className="text-base font-medium">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-gray-900"
      style={{
        backgroundColor: '#f4f7ff',
        backgroundImage: 'radial-gradient(#c7d2fe 1.15px, transparent 1.15px)',
        backgroundSize: '22px 22px',
      }}
    >
      <GradientOrbs />

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md border border-[#dbeafe] bg-white/90 shadow-xl shadow-[rgba(37,99,235,0.12)] backdrop-blur">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Sign In Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 mb-4">
              {loginAction === 'save' 
                ? 'Please sign in to save your resume and access it from anywhere.' 
                : loginAction === 'ats'
                ? 'Please sign in to analyze your resume with our advanced ATS scanner.'
                : 'Please sign in to download your resume as a PDF.'}
            </p>
            <p className="text-sm text-gray-500">
              Your work is saved locally and won't be lost. Sign in to unlock all features!
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            
            <Button 
              onClick={handleLoginAndContinue}
              className="rounded-full w-full gap-2 bg-[#2563eb]/10 border border-[#2563eb] text-[#2563eb] hover:bg-[#1d4ed8]/20"
            >
              <svg className="h-4 w-4" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
                  <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
                  <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
                  <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path>
                </g>
              </svg>
              Sign in with Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md border border-[#dbeafe] bg-white/90 shadow-xl shadow-[rgba(37,99,235,0.12)] backdrop-blur">
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
              className="border-[#dbeafe] focus-visible:ring-[#2563eb]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={isSaving} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSaveResume} disabled={isSaving} className="rounded-full gap-2 bg-[#2563eb] text-white hover:bg-[#1d4ed8]">
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
        onOpenRewards={() => setShowRewardsModal(true)}
      />

      {/* Rewards Center Modal */}
      <RewardsCenter open={showRewardsModal} onOpenChange={setShowRewardsModal} />

      {/* ATS Score Analysis Modal */}
      <Dialog open={showATSModal} onOpenChange={setShowATSModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbeafe] bg-white/95 shadow-xl shadow-[rgba(37,99,235,0.12)] backdrop-blur">
         
          <div className="py-4">
            <AdvancedATSScanner data={resumeData} />
          </div>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easing }}
        className="fixed left-0 right-0 top-0 z-40 backdrop-blur-lg"
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
                    <span className="text-[8px] font-medium uppercase tracking-wider text-[#2563eb]/60">
                      Beta
                    </span>
                  </div>
                  <span className="text-[11px] text-black/60 -mt-1 flex items-center gap-1">
                    Powered by <img src="/redstring.png" alt="Redstring" className="h-3 w-auto mt-1" />
                  </span>
                </div>
              </Link>
              <Link
                to={user ? '/dashboard' : '/'}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#f5f9ff] border border-[#9bbcff] px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-[#2563eb] shadow-sm shadow-[rgba(37,99,235,0.12)] transition hover:border-[#c7d2fe] hover:text-[#1d4ed8] whitespace-nowrap"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back
              </Link>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTemplateSelector(true)}
                className="rounded-full gap-1.5 border-[#c7d2fe] bg-white/80 text-gray-700 hover:bg-[#f5f9ff] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                size="sm"
              >
                <LayoutTemplate className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Template</span>
              </Button>

              {user && (
                <Button
                  variant="outline"
                  onClick={() => setShowRewardsModal(true)}
                  className="rounded-full gap-1.5 border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                  size="sm"
                >
                  <span className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#fef9c3] flex items-center justify-center flex-shrink-0">
                   <svg
      width={12}
      height={12}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path fill="#EFB832" d="M256,512C114.841,512,0,397.159,0,256S114.841,0,256,0s256,114.841,256,256S397.159,512,256,512z" />
        <g opacity="0.2">
          <g>
            <path fill="#FFFFFF" d="M331.858,278.511c-2.639-7.713-6.907-14.208-12.786-19.487 c-4.679-4.679-10.266-8.329-16.762-10.969c-6.496-2.639-14.723-4.679-24.68-6.102l-1.92-0.291l-23.978-3.668 c-4.662-0.6-8.57-1.628-11.723-3.051c-1.32-0.583-2.554-1.234-3.719-1.936c-1.611-0.977-3.051-2.057-4.353-3.24 c-2.245-2.228-3.805-4.662-4.73-7.301c-0.908-2.639-1.371-5.382-1.371-8.227c0-7.524,2.691-13.968,8.073-19.35 c0.737-0.737,1.525-1.423,2.382-2.04c5.348-4.028,12.94-6.033,22.761-6.033c5.33,0,10.883,0.48,16.659,1.457 c1.936,0.326,3.891,0.703,5.879,1.131c7.918,1.731,15.237,5.844,21.938,12.34l26.806-26.514 c-9.341-9.135-19.59-15.631-30.765-19.487c-7.164-2.468-15.133-4.165-23.875-5.039c-4.884-0.514-10.026-0.754-15.425-0.754 c-8.638,0-16.642,0.874-23.978,2.639c-2.657,0.634-5.227,1.371-7.713,2.245c-9.341,3.24-17.259,7.764-23.755,13.54 c-6.496,5.793-11.484,12.7-14.928,20.721c-3.462,8.021-5.176,16.917-5.176,26.669c0,18.476,5.176,32.702,15.528,42.642 c4.885,4.679,10.66,8.484,17.362,11.432c5.296,2.314,11.5,4.165,18.681,5.519c1.937,0.377,3.925,0.72,5.999,1.028l25.897,3.959 c2.913,0.428,5.416,0.891,7.524,1.371c1.868,0.446,3.428,0.891,4.662,1.371c2.639,1.011,5.073,2.537,7.318,4.559 c4.456,4.473,6.701,10.472,6.701,17.979c0,8.741-3.256,15.442-9.752,20.104c-2.502,1.817-5.484,3.274-8.929,4.37 c-5.484,1.765-12.151,2.639-20.018,2.639c-6.684,0-13.163-0.6-19.402-1.8c-3.034-0.583-5.999-1.303-8.929-2.159 c-8.929-2.639-16.848-7.404-23.755-14.311l-27.423,27.405c10.558,10.78,22.281,18.236,35.187,22.401 c7.678,2.485,15.991,4.216,24.938,5.21c6.067,0.686,12.443,1.029,19.093,1.029c7.061,0,13.831-0.566,20.31-1.714 c3.942-0.686,7.781-1.594,11.517-2.708c9.855-2.931,18.373-7.198,25.589-12.786c7.216-5.587,12.854-12.443,16.917-20.567 c4.062-8.124,6.085-17.465,6.085-28.022C335.817,294.964,334.497,286.24,331.858,278.511z" />
          </g>
          <path fill="#FFFFFF" d="M275.71,151.407v36.866c-5.776-0.977-11.329-1.457-16.659-1.457 c-9.821,0-17.413,2.005-22.761,6.033v-41.442c0-10.849,8.878-19.71,19.71-19.71c5.416,0,10.352,2.211,13.917,5.793 c3.428,3.411,5.605,8.073,5.776,13.214C275.71,150.944,275.71,151.167,275.71,151.407z" />
          <path fill="#FFFFFF" d="M275.71,241.662v40.054c-2.108-0.48-4.61-0.943-7.524-1.371l-25.897-3.959 c-2.074-0.309-4.062-0.651-5.999-1.028v-42.351c1.165,0.703,2.399,1.354,3.719,1.936c3.154,1.423,7.061,2.451,11.723,3.051 L275.71,241.662z" />
          <path fill="#FFFFFF" d="M255.692,332.739c7.867,0,14.534-0.874,20.018-2.639v38.974c0,10.832-8.861,19.71-19.71,19.71 c-10.695,0-19.487-8.655-19.693-19.299c-0.017-0.137-0.017-0.274-0.017-0.411v-38.135 C242.529,332.139,249.007,332.739,255.692,332.739z" />
        </g>
        <g opacity="0.5">
          <path fill="#AE8132" d="M256.001,472.633c-119.452,0-216.633-97.181-216.633-216.633s97.18-216.633,216.633-216.633 c119.452,0,216.633,97.18,216.633,216.633S375.453,472.633,256.001,472.633z M256.001,94.604 c-88.994,0-161.396,72.402-161.396,161.396s72.402,161.396,161.396,161.396c88.994,0,161.396-72.402,161.396-161.396 S344.994,94.604,256.001,94.604z" />
        </g>
        <g>
          <path fill="#EFB832" d="M184,82.265c0.458,1.164,0.856,2.222,1.187,3.17c0.334,0.946,0.576,1.846,0.725,2.697 c0.15,0.847,0.19,1.669,0.117,2.461c-0.069,0.789-0.291,1.617-0.664,2.474c-0.497,1.144-1.183,2.144-2.057,3.002 c-0.874,0.854-2.02,1.563-3.434,2.118c-1.411,0.555-2.736,0.819-3.972,0.791c-1.236-0.028-2.425-0.287-3.572-0.786 c-0.855-0.376-1.579-0.827-2.17-1.359c-0.593-0.529-1.119-1.161-1.572-1.89c-0.461-0.729-0.888-1.553-1.29-2.473 c-0.405-0.924-0.833-1.965-1.291-3.129c-0.456-1.162-0.851-2.217-1.183-3.166c-0.336-0.95-0.582-1.846-0.745-2.692 c-0.16-0.841-0.208-1.661-0.134-2.453c0.069-0.791,0.293-1.617,0.664-2.474c0.499-1.144,1.189-2.146,2.077-3.009 c0.885-0.861,2.034-1.568,3.45-2.123c1.414-0.558,2.733-0.819,3.957-0.786c1.221,0.031,2.408,0.295,3.552,0.791 c0.857,0.373,1.581,0.829,2.172,1.359c0.591,0.532,1.118,1.161,1.59,1.884c0.469,0.724,0.905,1.548,1.307,2.466 C183.114,80.06,183.547,81.104,184,82.265z M179.247,84.134c-0.458-1.162-0.86-2.116-1.204-2.861 c-0.347-0.745-0.665-1.35-0.954-1.817c-0.289-0.467-0.566-0.825-0.836-1.07c-0.27-0.253-0.567-0.459-0.893-0.619 c-0.495-0.255-1.047-0.396-1.653-0.437c-0.608-0.039-1.241,0.074-1.902,0.336c-0.66,0.257-1.205,0.611-1.622,1.05 c-0.419,0.444-0.736,0.926-0.947,1.457c-0.128,0.343-0.208,0.697-0.233,1.062c-0.028,0.365,0.011,0.817,0.117,1.356 c0.108,0.538,0.294,1.195,0.559,1.973c0.268,0.778,0.629,1.749,1.088,2.912c0.456,1.162,0.851,2.119,1.187,2.867 c0.334,0.753,0.645,1.354,0.929,1.81s0.559,0.807,0.826,1.055c0.272,0.252,0.569,0.454,0.898,0.618 c0.514,0.241,1.08,0.39,1.694,0.438c0.611,0.05,1.246-0.056,1.91-0.318c0.659-0.26,1.198-0.613,1.612-1.068 c0.412-0.453,0.715-0.941,0.904-1.461c0.13-0.341,0.208-0.695,0.236-1.06c0.026-0.367-0.009-0.813-0.112-1.34 c-0.101-0.525-0.279-1.177-0.534-1.961C180.059,86.273,179.704,85.297,179.247,84.134z" />
          <path fill="#EFB832" d="M208.075,89.001l-14.273-12.715l4.284,15.481l-4.922,1.363l-6.984-25.224l4.395-1.215 l14.263,12.682l-4.276-15.446l4.927-1.361l6.981,25.22L208.075,89.001z" />
          <path fill="#EFB832" d="M217.723,86.957l-3.763-25.9l17.059-2.478l0.655,4.511l-12.002,1.744l0.88,6.072l10.224-1.482 l0.652,4.506l-10.219,1.486l0.915,6.295l12.004-1.744l0.657,4.508L217.723,86.957z" />
          <path fill="#EFB832" d="M266.141,65.704c-0.005,1.105-0.205,2.15-0.602,3.141c-0.396,0.993-0.962,1.859-1.7,2.604 c-0.738,0.744-1.649,1.33-2.728,1.753c-1.081,0.428-2.293,0.637-3.638,0.632l-5.039-0.022l-0.038,9.852l-5.108-0.018 l0.101-26.174l10.144,0.04c1.348,0.005,2.562,0.224,3.64,0.657c1.076,0.431,1.979,1.026,2.712,1.774 c0.731,0.752,1.293,1.624,1.68,2.617C265.954,63.557,266.144,64.599,266.141,65.704z M261.031,65.686 c0.006-1.078-0.329-1.95-1-2.613c-0.671-0.665-1.596-1.002-2.771-1.003l-4.78-0.02l-0.026,7.165l4.78,0.02 c1.173,0.004,2.101-0.316,2.776-0.962C260.685,67.627,261.027,66.764,261.031,65.686z" />
          <path fill="#EFB832" d="M269.683,84.046l2.934-26.005l17.129,1.93l-0.51,4.529l-12.054-1.357l-0.686,6.1l10.263,1.155 l-0.512,4.531l-10.264-1.158l-0.712,6.319l12.054,1.357l-0.51,4.531L269.683,84.046z" />
          <path fill="#EFB832" d="M306.119,90.148l-6.472-17.989l-3.624,15.652l-4.979-1.154l5.906-25.498l4.439,1.029l6.484,17.953 l3.615-15.613l4.979,1.154l-5.904,25.496L306.119,90.148z" />
          <path fill="#EFB832" d="M330.211,98.029l-4.201-18.647l-5.531,15.08l-4.798-1.762l9.015-24.567l4.277,1.571l4.212,18.615 l5.521-15.048l4.796,1.762l-9.015,24.572L330.211,98.029z" />
          <path fill="#EFB832" d="M353.133,96.742l-4.795,9.6l-4.539-2.264l4.795-9.604l-0.141-17.323l4.964,2.478l-0.337,11.622 l9.022-7.288l4.964,2.478L353.133,96.742z" />
        </g>
        <g>
          <path fill="#EFB832" d="M331.201,432.648c-0.458-1.165-0.856-2.222-1.187-3.17c-0.334-0.946-0.576-1.846-0.725-2.697 c-0.149-0.846-0.19-1.669-0.117-2.46c0.069-0.789,0.291-1.617,0.664-2.475c0.497-1.144,1.183-2.144,2.057-3.002 c0.874-0.854,2.02-1.563,3.434-2.118c1.412-0.555,2.736-0.819,3.972-0.791c1.237,0.028,2.425,0.287,3.572,0.786 c0.855,0.376,1.579,0.827,2.17,1.359c0.593,0.529,1.118,1.161,1.572,1.89c0.461,0.729,0.888,1.553,1.29,2.473 c0.405,0.924,0.832,1.965,1.291,3.129c0.456,1.162,0.851,2.217,1.183,3.165c0.336,0.95,0.582,1.846,0.745,2.692 c0.16,0.841,0.208,1.661,0.134,2.453c-0.069,0.792-0.293,1.617-0.664,2.474c-0.499,1.144-1.189,2.146-2.077,3.01 c-0.885,0.861-2.034,1.568-3.45,2.123c-1.414,0.558-2.733,0.819-3.957,0.786c-1.221-0.031-2.408-0.294-3.552-0.792 c-0.857-0.373-1.582-0.829-2.172-1.359c-0.591-0.532-1.119-1.161-1.59-1.884c-0.469-0.724-0.905-1.548-1.307-2.466 C332.087,434.852,331.655,433.808,331.201,432.648z M335.954,430.778c0.458,1.162,0.86,2.116,1.204,2.861 c0.347,0.745,0.665,1.35,0.954,1.817c0.289,0.467,0.566,0.825,0.836,1.071c0.27,0.253,0.567,0.459,0.893,0.619 c0.495,0.256,1.047,0.396,1.653,0.437c0.608,0.039,1.241-0.073,1.902-0.336c0.659-0.257,1.204-0.611,1.622-1.05 c0.42-0.444,0.736-0.926,0.947-1.457c0.128-0.343,0.208-0.697,0.234-1.062c0.028-0.365-0.011-0.817-0.117-1.355 c-0.108-0.539-0.294-1.195-0.559-1.973c-0.267-0.778-0.629-1.749-1.088-2.912c-0.456-1.162-0.851-2.119-1.187-2.867 c-0.334-0.753-0.645-1.353-0.929-1.81c-0.284-0.456-0.559-0.807-0.826-1.055c-0.272-0.252-0.569-0.454-0.898-0.618 c-0.514-0.241-1.08-0.39-1.694-0.438c-0.611-0.05-1.246,0.056-1.91,0.318c-0.659,0.26-1.198,0.613-1.612,1.068 c-0.412,0.453-0.715,0.941-0.905,1.461c-0.13,0.341-0.208,0.695-0.236,1.06c-0.026,0.367,0.009,0.813,0.112,1.34 c0.101,0.525,0.279,1.177,0.534,1.961C335.143,428.639,335.498,429.616,335.954,430.778z" />
          <path fill="#EFB832" d="M307.126,425.912l14.273,12.715l-4.284-15.481l4.922-1.363l6.984,25.224l-4.395,1.215 l-14.263-12.682l4.276,15.446l-4.927,1.361l-6.981-25.22L307.126,425.912z" />
          <path fill="#EFB832" d="M297.479,427.955l3.763,25.9l-17.059,2.478l-0.655-4.511l12.002-1.744l-0.88-6.072l-10.224,1.482 l-0.652-4.506l10.219-1.486l-0.915-6.295l-12.004,1.744l-0.657-4.508L297.479,427.955z" />
          <path fill="#EFB832" d="M249.06,449.208c0.005-1.105,0.205-2.15,0.602-3.141c0.396-0.993,0.962-1.859,1.7-2.603 c0.738-0.744,1.649-1.33,2.728-1.753c1.081-0.428,2.293-0.637,3.638-0.632l5.038,0.022l0.038-9.852l5.108,0.018l-0.101,26.174 l-10.144-0.04c-1.348-0.005-2.562-0.224-3.64-0.657c-1.076-0.431-1.979-1.026-2.712-1.774c-0.731-0.752-1.293-1.624-1.68-2.617 C249.248,451.355,249.058,450.313,249.06,449.208z M254.171,449.226c-0.006,1.078,0.329,1.95,1,2.613 c0.671,0.665,1.596,1.001,2.771,1.003l4.78,0.02l0.026-7.165l-4.78-0.02c-1.172-0.004-2.101,0.316-2.776,0.962 C254.516,447.285,254.174,448.148,254.171,449.226z" />
          <path fill="#EFB832" d="M245.519,430.866l-2.934,26.005l-17.129-1.93l0.51-4.529l12.054,1.357l0.686-6.1l-10.264-1.155 l0.512-4.531l10.264,1.158l0.712-6.319l-12.054-1.357l0.51-4.531L245.519,430.866z" />
          <path fill="#EFB832" d="M209.083,424.764l6.472,17.989l3.624-15.652l4.979,1.154l-5.906,25.498l-4.439-1.029 l-6.484-17.953l-3.615,15.613l-4.979-1.154l5.904-25.496L209.083,424.764z" />
          <path fill="#EFB832" d="M184.991,416.883l4.2,18.647l5.531-15.08l4.798,1.762l-9.015,24.567l-4.277-1.571l-4.213-18.616 l-5.521,15.048l-4.796-1.762l9.015-24.572L184.991,416.883z" />
          <path fill="#EFB832" d="M162.068,418.17l4.795-9.6l4.539,2.264l-4.795,9.604l0.141,17.323l-4.964-2.478l0.337-11.622 l-9.022,7.288l-4.964-2.478L162.068,418.17z" />
        </g>
        <g>
          <g>
            <path fill="#CC9322" d="M331.858,274.27c-2.639-7.713-6.907-14.208-12.786-19.487 c-4.679-4.679-10.266-8.329-16.762-10.969c-6.496-2.639-14.723-4.679-24.68-6.102l-1.92-0.292l-23.978-3.668 c-4.662-0.6-8.57-1.628-11.723-3.051c-1.32-0.583-2.554-1.234-3.719-1.936c-1.611-0.977-3.051-2.057-4.353-3.24 c-2.245-2.228-3.805-4.662-4.73-7.301c-0.908-2.639-1.371-5.382-1.371-8.227c0-7.524,2.691-13.968,8.073-19.35 c0.737-0.737,1.525-1.423,2.382-2.04c5.348-4.028,12.94-6.033,22.761-6.033c5.33,0,10.883,0.48,16.659,1.457 c1.936,0.326,3.891,0.703,5.879,1.131c7.918,1.731,15.237,5.844,21.938,12.34l26.806-26.514 c-9.341-9.135-19.59-15.631-30.765-19.487c-7.164-2.468-15.133-4.165-23.875-5.039c-4.884-0.514-10.026-0.754-15.425-0.754 c-8.638,0-16.642,0.874-23.978,2.64c-2.657,0.634-5.227,1.371-7.713,2.245c-9.341,3.239-17.259,7.764-23.755,13.54 c-6.496,5.793-11.484,12.7-14.928,20.721c-3.462,8.021-5.176,16.917-5.176,26.669c0,18.476,5.176,32.701,15.528,42.642 c4.885,4.679,10.66,8.484,17.362,11.432c5.296,2.314,11.5,4.165,18.681,5.519c1.937,0.377,3.925,0.72,5.999,1.028l25.897,3.959 c2.913,0.428,5.416,0.891,7.524,1.371c1.868,0.446,3.428,0.891,4.662,1.371c2.639,1.011,5.073,2.537,7.318,4.559 c4.456,4.474,6.701,10.472,6.701,17.979c0,8.741-3.256,15.442-9.752,20.104c-2.502,1.817-5.484,3.274-8.929,4.37 c-5.484,1.765-12.151,2.639-20.018,2.639c-6.684,0-13.163-0.6-19.402-1.8c-3.034-0.583-5.999-1.303-8.929-2.16 c-8.929-2.639-16.848-7.404-23.755-14.311l-27.423,27.405c10.558,10.78,22.281,18.236,35.187,22.401 c7.678,2.485,15.991,4.216,24.938,5.21c6.067,0.686,12.443,1.029,19.093,1.029c7.061,0,13.831-0.566,20.31-1.714 c3.942-0.686,7.781-1.594,11.517-2.708c9.855-2.931,18.373-7.198,25.589-12.786c7.216-5.587,12.854-12.443,16.917-20.567 c4.062-8.124,6.085-17.465,6.085-28.022C335.817,290.724,334.497,282,331.858,274.27z" />
          </g>
          <path fill="#CC9322" d="M275.71,147.167v36.866c-5.776-0.977-11.329-1.457-16.659-1.457 c-9.821,0-17.413,2.005-22.761,6.033v-41.442c0-10.849,8.878-19.71,19.71-19.71c5.416,0,10.352,2.211,13.917,5.793 c3.428,3.411,5.605,8.072,5.776,13.214C275.71,146.704,275.71,146.927,275.71,147.167z" />
          <path fill="#CC9322" d="M275.71,237.421v40.054c-2.108-0.48-4.61-0.943-7.524-1.371l-25.897-3.959 c-2.074-0.309-4.062-0.651-5.999-1.028v-42.351c1.165,0.703,2.399,1.354,3.719,1.936c3.154,1.423,7.061,2.451,11.723,3.051 L275.71,237.421z" />
          <path fill="#CC9322" d="M255.692,328.498c7.867,0,14.534-0.874,20.018-2.639v38.974c0,10.832-8.861,19.71-19.71,19.71 c-10.695,0-19.487-8.655-19.693-19.299c-0.017-0.137-0.017-0.274-0.017-0.411v-38.134 C242.529,327.898,249.007,328.498,255.692,328.498z" />
        </g>
        <g>
          <circle fill="#EFB832" cx="65.963" cy="256" r="9.56" />
          <circle fill="#EFB832" cx="444.121" cy="256" r="9.56" />
        </g>
      </g>
      <path opacity="0.06" fill="#040000" d="M256.12,511.759c65.556,0,131.113-24.952,181.02-74.859 c99.814-99.814,99.814-262.225,0-362.038C387.232,24.953,321.676,0,256.12,0L256.12,511.759z" />
    </svg>
                  </span>
                  <span>{credits} Credits</span>
                </Button>
              )}

              <Button
                onClick={() => {
                  if (!user) {
                    setLoginAction('ats');
                    setShowLoginModal(true);
                  } else {
                    setShowATSModal(true);
                  }
                }}
                className="gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700  transition-all hover:scale-[1.02] text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 h-auto whitespace-nowrap font-semibold"
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
                  className="rounded-full gap-2.5 border-[#c7d2fe] bg-[#2563eb]/10 text-[#1d4ed8] hover:bg-[#2563eb] hover:text-white text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
                  size="sm"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </Button>
              )}

              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="rounded-full gap-1.5 bg-[#2563eb] text-white shadow-lg shadow-[rgba(37,99,235,0.3)] hover:bg-[#1d4ed8] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
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
            className="rounded-2xl sm:rounded-2xl border border-dashed border-[#dbeafe] bg-white/85 p-3 sm:p-4 md:p-6 shadow-2xl shadow-[rgba(37,99,235,0.12)] backdrop-blur"
          >
           

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-xl sm:rounded-2xl border border-[#dbeafe] bg-[#f5f9ff]/60 text-xs sm:text-sm font-semibold text-[#1d4ed8] h-auto">
                <TabsTrigger value="builder" className="py-2 sm:py-2.5 text-xs sm:text-sm">Resume Builder</TabsTrigger>
                <TabsTrigger value="upload" className="py-2 sm:py-2.5 text-xs sm:text-sm">Upload & Analyze</TabsTrigger>
              </TabsList>

              <TabsContent value="builder" className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6">
                {/* Mobile View Toggle - Only visible on mobile */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                  <Button
                    onClick={() => setMobileView('editor')}
                    variant={mobileView === 'editor' ? 'default' : 'outline'}
                    className={`rounded-full gap-2 text-xs sm:text-sm px-4 py-2 h-auto ${
                      mobileView === 'editor'
                        ? 'bg-[#2563eb] text-white'
                        : 'border-[#c7d2fe] text-gray-700 hover:bg-[#f5f9ff]'
                    }`}
                    size="sm"
                  >
                    <Edit className="h-4 w-4" />
                    Editor
                  </Button>
                  <Button
                    onClick={() => setMobileView('preview')}
                    variant={mobileView === 'preview' ? 'default' : 'outline'}
                    className={`rounded-full gap-2 text-xs sm:text-sm px-4 py-2 h-auto ${
                      mobileView === 'preview'
                        ? 'bg-[#2563eb] text-white'
                        : 'border-[#c7d2fe] text-gray-700 hover:bg-[#f5f9ff]'
                    }`}
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>

                <div className="grid gap-4 sm:gap-6 lg:grid-cols-[420px_1fr]">
                  {/* Editor Panel - Hidden on mobile when preview is active */}
                  <div className={`overflow-hidden rounded-2xl sm:rounded-3xl border border-[#dbeafe] bg-white/80 border-dashed shadow-lg shadow-[rgba(37,99,235,0.12)] ${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
                    <div className="flex items-center justify-between  px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Resume Builder</h2>
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="rounded-full gap-1.5 sm:gap-2 border-[#dbeafe] text-gray-700 hover:bg-[#f5f9ff] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                        size="sm"
                      >
                        <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Reset
                      </Button>
                    </div>
                    <div className="h-[500px] sm:h-[600px] md:h-[650px] overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                      <ResumeForm data={resumeData} onChange={handleDataChange} />
                    </div>
                  </div>

                  {/* Desktop Preview Panel - Always visible on desktop, hidden on mobile */}
                  <div className="hidden overflow-hidden rounded-2xl sm:rounded-3xl border border-dashed border-[#dbeafe] bg-[#eef2ff] shadow-lg lg:block">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Preview</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSelector(true)}
                        className="rounded-full gap-1.5 sm:gap-2 text-xs text-[#2563eb] hover:bg-[#f5f9ff] px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                      >
                        <LayoutTemplate className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {getTemplateName(selectedTemplate)}
                      </Button>
                    </div>

                    <div className="h-[600px] md:h-[650px] overflow-y-auto bg-gradient-to-b from-[#e3ecff]/40 via-white to-white px-1 py-2">
                      <div
                        className="rounded-xl bg-white shadow-xl shadow-[rgba(37,99,235,0.18)] mx-auto"
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

                {/* Mobile Preview Panel - Only visible when preview is active */}
                <div className={`lg:hidden ${mobileView === 'editor' ? 'hidden' : ''}`}>
                  <div className="overflow-hidden rounded-2xl sm:rounded-3xl border border-[#dbeafe] bg-white/80 shadow-lg shadow-[rgba(37,99,235,0.12)]">
                    <div className="flex items-center justify-between border-b border-[#dbeafe] px-4 sm:px-6 py-3 sm:py-4">
                      <h2 className="text-sm sm:text-base font-semibold text-gray-900">Preview</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplateSelector(true)}
                        className="rounded-full gap-1.5 sm:gap-2 text-xs text-[#2563eb] hover:bg-[#f5f9ff] px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto"
                      >
                        <LayoutTemplate className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden xs:inline">{getTemplateName(selectedTemplate)}</span>
                      </Button>
                    </div>
                    <div className="relative overflow-auto bg-[#eef2ff] touch-pan-x touch-pan-y" style={{ height: '600px', WebkitOverflowScrolling: 'touch' }}>
                      <div className="inline-block min-w-full" >
                        <div
                          className="rounded-lg sm:rounded-xl bg-white shadow-xl shadow-[rgba(37,99,235,0.18)] mx-auto"
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
                    <div className="bg-[#f5f9ff]/50 px-3 sm:px-4 py-2 text-center border-t border-[#dbeafe]">
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
                  className="rounded-2xl sm:rounded-3xl border border-[#dbeafe] bg-white/80 p-4 sm:p-6 shadow-lg shadow-[rgba(37,99,235,0.12)] backdrop-blur"
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

