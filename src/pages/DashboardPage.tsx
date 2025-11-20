import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getUserResumes, deleteResume, SavedResume } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import emailjs from '@emailjs/browser';
import AdvancedATSScanner from '@/components/AdvancedATSScanner';
import { extractResumeFromPDF } from '@/services/groqService';
import { exportToPDF } from '@/utils/pdfExport';
import toast from 'react-hot-toast';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';
import UglyTemplate from '@/components/templates/UglyTemplate';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Eye,
  Loader2,
  Sparkles,
  ShieldCheck,
  Upload,
  Download,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const GradientOrbs = () => (
  <>
    <motion.div
      className="absolute top-[-12rem] -right-32 h-[28rem] w-[28rem] rounded-full bg-[#fb651e]/5 blur-3xl"
      animate={{
        y: [0, 40, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[-14rem] -left-24 h-[30rem] w-[30rem] rounded-full bg-[#ff9155]/5 blur-3xl"
      animate={{
        y: [0, -50, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,101,30,0.04),rgba(255,255,255,0))]" />
  </>
);

const renderTemplate = (resume: SavedResume) => {
  const { resumeData, templateType } = resume;

  switch (templateType) {
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

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewingResume, setViewingResume] = useState<SavedResume | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState<SavedResume | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const feedbackFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const loadResumes = async () => {
      try {
        setLoading(true);
        const userResumes = await getUserResumes(user.uid);
        setResumes(userResumes);
      } catch (error) {
        console.error('Error loading resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResumes();
  }, [user, navigate]);

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      setDeleting(resumeId);
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((resume) => resume._id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (resumeId: string) => {
    navigate(`/builder?resumeId=${resumeId}`);
  };

  const handleView = (resume: SavedResume) => {
    setViewingResume(resume);
  };

  const handleDownload = async (resume: SavedResume) => {
    setDownloadingResume(resume._id);
    try {
      await exportToPDF(resume.resumeData, resume.templateType);
      toast.success('Resume PDF downloaded successfully!');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setDownloadingResume(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSendingFeedback(true);

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error('Email service is not configured. Please try again later.');
      setIsSendingFeedback(false);
      return;
    }

    try {
      const templateParams = {
        from_name: feedbackName,
        from_email: feedbackEmail,
        message: feedbackMessage,
        to_name: 'Resumae Team',
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      
      toast.success('Feedback sent successfully! Thank you for your input.');
      setShowFeedbackModal(false);
      setFeedbackName('');
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('Failed to send feedback. Please try again.');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleUploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);
    toast.loading('Extracting resume data with AI... This may take a moment.', { id: 'upload' });

    try {
      const extractedData = await extractResumeFromPDF(file);
      
      if (extractedData) {
        toast.success('Resume extracted successfully! Redirecting to builder...', { id: 'upload' });
        
        // Store extracted data in localStorage temporarily
        localStorage.setItem('resumatic_uploaded_data', JSON.stringify(extractedData));
        
        // Navigate to builder with a flag
        setTimeout(() => {
          navigate('/builder?uploaded=true');
        }, 1000);
      } else {
        toast.error('Failed to extract resume data. Please try again or use the manual builder.', { id: 'upload' });
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      
      if (error?.message === 'RATE_LIMIT_EXCEEDED') {
        toast.error(
          'API rate limit exceeded. Please wait a few minutes and try again.',
          { id: 'upload', duration: 6000 }
        );
      } else {
        toast.error('Failed to process resume. Please try again later.', { id: 'upload' });
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-gray-900"
      style={{
        backgroundColor: '#f6f3ef',
        backgroundImage: 'radial-gradient(#d4c9be 1.15px, transparent 1.15px)',
        backgroundSize: '22px 22px',
      }}
    >
      <GradientOrbs />

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md border  shadow-2xl backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <MessageSquare className="h-5 w-5 text-[#fb651e]" />
              Share Your Feedback
            </DialogTitle>
          </DialogHeader>
          <form ref={feedbackFormRef} onSubmit={handleSubmitFeedback} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="feedback-name"
                placeholder="Your name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                disabled={isSendingFeedback}
                className="border-[#f9d6c2] focus-visible:ring-[#fb651e]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="feedback-email"
                type="email"
                placeholder="your.email@example.com"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                disabled={isSendingFeedback}
                className="border-[#f9d6c2] focus-visible:ring-[#fb651e]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message" className="text-sm font-medium text-gray-700">
                Feedback
              </Label>
              <Textarea
                id="feedback-message"
                placeholder="Share your thoughts, suggestions, or report issues..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                disabled={isSendingFeedback}
                className="min-h-[120px] border-[#f9d6c2] focus-visible:ring-[#fb651e]"
                required
              />
            </div>
          </form>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFeedbackModal(false)}
              disabled={isSendingFeedback}
              className="rounded-full border-[#f9d6c2]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitFeedback}
              disabled={isSendingFeedback}
              className="rounded-full gap-2 bg-[#fb651e] text-white hover:bg-[#e35712]"
            >
              {isSendingFeedback ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Resume Dialog */}
      <Dialog open={!!viewingResume} onOpenChange={(open) => !open && setViewingResume(null)}>
        <DialogContent className="max-w-[95vw] w-[900px] max-h-[90vh] overflow-y-auto border border-[#f9d6c2] bg-white/90 shadow-2xl shadow-[rgba(251,101,30,0.2)] backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-semibold text-gray-900">
              <span>{viewingResume?.title}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (viewingResume) {
                      handleDownload(viewingResume);
                    }
                  }}
                  disabled={downloadingResume === viewingResume?._id}
                  className="rounded-full gap-2 border-green-200 bg-green-50/70 text-green-600 hover:bg-green-100"
                >
                  {downloadingResume === viewingResume?._id ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Downloading...</>
                  ) : (
                    <><Download className="h-4 w-4" /> Download PDF</>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (viewingResume) {
                      setViewingResume(null);
                      handleEdit(viewingResume._id);
                    }
                  }}
                  className="rounded-full gap-2 border-[#f8cfb5] bg-[#fff8f2]/70 text-[#fb651e] hover:bg-[#ffe7d3]"
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {viewingResume && (
              <div className="rounded-3xl border border-[#f9d6c2] bg-gradient-to-br from-[#fff3e6]/60 via-white to-white p-6 shadow-xl shadow-[rgba(251,101,30,0.1)]">
                <div className="flex justify-center">
                  <div
                    className="rounded-xl bg-white shadow-2xl shadow-[rgba(251,101,30,0.2)]"
                    style={{ width: '210mm', transform: 'scale(0.72)', transformOrigin: 'top center' }}
                  >
                    {renderTemplate(viewingResume)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ATS Score Analysis Dialog */}
      <Dialog open={!!analyzingResume} onOpenChange={(open) => !open && setAnalyzingResume(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-[#f9d6c2] bg-white/95 shadow-xl shadow-[rgba(251,101,30,0.1)] backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
              <Sparkles className="h-6 w-6 text-purple-600" />
              AI-Powered ATS Score Analysis
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {analyzingResume && <AdvancedATSScanner data={analyzingResume.resumeData} />}
          </div>
        </DialogContent>
      </Dialog>

      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: easing }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg"
      >
        <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                alt="Resumae"
                className="h-6 sm:h-9 w-auto"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-semibold tracking-tight">Resumae</span>
                  <span className="text-[8px] font-medium uppercase tracking-wider text-[#fb651e]/60">
                    Beta
                  </span>
                </div>
                <span className="text-[11px] text-black/60 -mt-1 flex items-center gap-1">
                  Powered by <img src="/redstring.png" alt="Redstring" className="h-3 w-auto" />
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackModal(true)}
                className="rounded-full gap-1.5 sm:gap-2 border-[#f8cfb5] bg-white/80 text-[#fb651e] hover:bg-[#fff8f2] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
              >
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </Button>
              <div className="relative">
                {user?.photoURL && (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-[#f9d6c2] shadow-sm hover:border-[#f6b890] transition-all focus:outline-none focus:ring-2 focus:ring-[#fb651e] focus:ring-offset-2"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </button>
                )}
                
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[#f9d6c2] bg-white/95 shadow-xl shadow-[rgba(251,101,30,0.2)] backdrop-blur">
                      <div className="p-4 border-b border-[#f9d6c2]">
                        <div className="flex items-center gap-3">
                          {user?.photoURL && (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'User'}
                              className="h-12 w-12 rounded-full border-2 border-[#f9d6c2]"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowUserMenu(false);
                            handleSignOut();
                          }}
                          className="rounded-full w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 pt-20 pb-12 sm:pt-28 md:pt-32 sm:pb-20">
        <div className="container mx-auto px-3 sm:px-4">
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="rounded-2xl sm:rounded-3xl border border-[#f9d6c2] bg-white/85 p-4 sm:p-6 md:p-8 shadow-2xl shadow-[rgba(251,101,30,0.1)] backdrop-blur"
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f9d6c2] bg-[#fff8f2]/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#fb651e]">
                  Dashboard
                </div>
                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Welcome back, {user.displayName || user.email?.split('@')[0] || 'Resumae creator'}
                </h1>
               
                <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#fb651e]" />
                    {resumes.length ? 'Pick up where you left off.' : 'Start building your first resume.'}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" /> Autosave & cloud sync enabled
                  </div>
                </div>
              </div>
            
            </motion.div>

            <motion.a
              variants={fadeInUp}
              href="https://app.redstring.co.in/talent/login"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 sm:mt-8 flex flex-col gap-3 rounded-2xl border border-[#f8cfb5]/70 bg-gradient-to-r from-[#fff3e6] via-white to-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-lg shadow-[rgba(251,101,30,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#f6b890] hover:shadow-[rgba(251,101,30,0.2)]"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fb651e]/10 text-[#fb651e]">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">Land your next role faster</p>
                  <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                     <span>Redstring Talent Network Powered by</span>
                    <img src="/redstring.png" alt="Redstring" className="h-5 w-auto" />
                   
                  </div>
                
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f8cfb5] bg-white px-4 py-2 text-xs font-semibold text-[#fb651e] shadow-sm">
                  Visit Job Portal
                </span>
              </div>
            </motion.a>

          

            <motion.div variants={fadeInUp} className="mt-6 sm:mt-10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
                <label htmlFor="resume-upload" className="w-full sm:w-auto cursor-pointer">
                  <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleUploadResume}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <span className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    isUploading 
                      ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'border-[#f8cfb5] bg-white text-[#fb651e] hover:bg-[#fff8f2]'
                  }`}>
                    {isUploading ? (
                      <><Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Upload Resume</>
                    )}
                  </span>
                </label>
                <Link to="/builder?new=true" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 h-auto rounded-full bg-[#fb651e] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[rgba(251,101,30,0.3)] hover:bg-[#e35712] whitespace-nowrap">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Create New Resume
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.section>


          <div className='mt-5 sm:mt-7 ml-2 sm:ml-4'>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Resumes</h2>
                <p className="text-xs sm:text-sm text-gray-500">Manage, preview, and refine every version you&apos;ve saved.</p>
              </div>

          <section className="relative mt-1">
            {loading && (
              <div className="flex items-center justify-center py-16 text-sm text-gray-600">
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#fb651e]" /> Loading your saved resumes...
              </div>
            )}

            {!loading && resumes.length === 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="show"
                className="mt-6 rounded-full border border-dashed border-[#f8cfb5] bg-white/80 p-10 text-center shadow-xl shadow-[rgba(251,101,30,0.1)] backdrop-blur"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fb651e]/10 text-[#fb651e]">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No resumes yet</h3>
                <p className="mt-2 text-sm text-gray-500">Create your first resume to start building your library.</p>
                <Link to="/builder?new=true">
                  <Button className="mt-6 gap-2 rounded-full bg-[#fb651e] text-white hover:bg-[#e35712]">
                    <Plus className="h-4 w-4" /> Create your first resume
                  </Button>
                </Link>
              </motion.div>
            )}

            {!loading && resumes.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {resumes.map((resume) => (
                  <motion.div key={resume._id} variants={fadeInUp}>
                    <Card className="group rounded-3xl overflow-hidden border border-[#f9d6c2] border-dashed bg-white/80 shadow-lg shadow-[rgba(251,101,30,0.1)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-[#f8cfb5]">
                      <div
                        className="relative cursor-pointer bg-gradient-to-br from-[#fff3e6]/60 via-white to-white p-3"
                        onClick={() => handleView(resume)}
                        style={{ height: '280px' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                          <div className="h-full w-full max-w-[160px] overflow-hidden rounded-lg border border-[#f9d6c2]/70 bg-white shadow-lg shadow-[rgba(251,101,30,0.1)]">
                            <div className="scale-[0.35] origin-top-left" style={{ width: '210mm', transformOrigin: 'top left' }}>
                              {renderTemplate(resume)}
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#fb651e] shadow">
                            View resume
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 rounded-full border border-[#f9d6c2] bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#fb651e]">
                          {resume.templateType}
                        </div>
                      </div>
                      <CardHeader className="space-y-3 border-t border-[#f9d6c2] bg-white/85 p-4">
                        <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {resume.title}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          Updated {formatDate(resume.updatedAt)}
                        </CardDescription>
                        <div className="flex gap-1.5 mb-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full flex-1 gap-1.5 border-[#f9d6c2] text-[#fb651e] hover:bg-[#fff8f2] text-xs px-2 py-1 h-8"
                            onClick={() => handleView(resume)}
                          >
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full flex-1 gap-1.5 border-[#f9d6c2] text-gray-700 hover:bg-[#fff8f2] text-xs px-2 py-1 h-8"
                            onClick={() => handleEdit(resume._id)}
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full px-2 border-[#f9d6c2] text-red-500 hover:bg-red-50 h-8"
                            onClick={() => handleDelete(resume._id)}
                            disabled={deleting === resume._id}
                            title="Delete Resume"
                          >
                            {deleting === resume._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full w-full gap-1.5 border-green-100 text-green-600 hover:bg-green-50 text-xs py-2 h-8 mb-2"
                          onClick={() => handleDownload(resume)}
                          disabled={downloadingResume === resume._id}
                        >
                          {downloadingResume === resume._id ? (
                            <><Loader2 className="h-3 w-3 animate-spin" /> Downloading...</>
                          ) : (
                            <><Download className="h-3 w-3" /> Download PDF</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="w-full gap-1.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700  transition-all hover:scale-[1.02] text-xs py-2.5 h-9 font-semibold"
                          onClick={() => setAnalyzingResume(resume)}
                        >
                          <Sparkles className="h-3.5 w-3.5" /> ATS Score Analysis
                        </Button>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

