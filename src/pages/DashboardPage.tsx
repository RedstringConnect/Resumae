import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/contexts/ReferralContext';
import { getUserResumes, deleteResume, SavedResume } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import emailjs from '@emailjs/browser';
import AdvancedATSScanner from '@/components/AdvancedATSScanner';
import RewardsCenter from '@/components/RewardsCenter';
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
  const { credits } = useReferral();
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
  const [showRewardsModal, setShowRewardsModal] = useState(false);
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
        backgroundColor: '#f4f7ff',
        backgroundImage: 'radial-gradient(#c7d2fe 1.15px, transparent 1.15px)',
        backgroundSize: '22px 22px',
      }}
    >
      <GradientOrbs />

      {/* Rewards Center Modal */}
      <RewardsCenter open={showRewardsModal} onOpenChange={setShowRewardsModal} />

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md border  shadow-2xl backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <MessageSquare className="h-5 w-5 text-[#2563eb]" />
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
                className="border-[#dbeafe] focus-visible:ring-[#2563eb]"
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
                className="border-[#dbeafe] focus-visible:ring-[#2563eb]"
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
                className="min-h-[120px] border-[#dbeafe] focus-visible:ring-[#2563eb]"
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
              className="rounded-full border-[#dbeafe]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitFeedback}
              disabled={isSendingFeedback}
              className="rounded-full gap-2 bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
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
        <DialogContent className="max-w-[95vw] w-[900px] max-h-[90vh] overflow-y-auto border border-[#dbeafe] bg-white/90 shadow-2xl shadow-[rgba(37,99,235,0.2)] backdrop-blur">
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
                  className="rounded-full gap-2 border-[#c7d2fe] bg-[#f5f9ff]/70 text-[#2563eb] hover:bg-[#dbe8ff]"
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {viewingResume && (
              <div className="rounded-3xl border border-[#dbeafe] bg-gradient-to-br from-[#e3ecff]/60 via-white to-white p-6 shadow-xl shadow-[rgba(37,99,235,0.12)]">
                <div className="flex justify-center">
                  <div
                    className="rounded-xl bg-white shadow-2xl shadow-[rgba(37,99,235,0.2)]"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-[#dbeafe] bg-white/95 shadow-xl shadow-[rgba(37,99,235,0.12)] backdrop-blur">
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
                  <span className="text-[8px] font-medium uppercase tracking-wider text-[#2563eb]/60">
                    Beta
                  </span>
                </div>
                <span className="text-[11px] text-black/60 -mt-1 flex items-center gap-1">
                  Powered by <img src="/redstring.png" alt="Redstring" className="h-3 w-auto mt-1" />
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRewardsModal(true)}
                className="rounded-full gap-1.5 sm:gap-2 border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f8fafc] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackModal(true)}
                className="rounded-full gap-1.5 sm:gap-2 border-[#c7d2fe] bg-white/80 text-[#2563eb] hover:bg-[#f5f9ff] text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-auto whitespace-nowrap"
              >
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </Button>
              <div className="relative">
                {user?.photoURL && (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-[#dbeafe] shadow-sm hover:border-[#9bbcff] transition-all focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
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
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-[#dbeafe] bg-white/95 shadow-xl shadow-[rgba(37,99,235,0.18)] backdrop-blur">
                      <div className="p-4 border-b border-[#dbeafe]">
                        <div className="flex items-center gap-3">
                          {user?.photoURL && (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'User'}
                              className="h-12 w-12 rounded-full border-2 border-[#dbeafe]"
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
            className="rounded-2xl sm:rounded-3xl border border-[#dbeafe] bg-white/85 p-4 sm:p-6 md:p-8 shadow-2xl shadow-[rgba(37,99,235,0.12)] backdrop-blur"
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#c7d2fe] bg-[#f5f9ff]/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#2563eb]">
                  Dashboard
                </div>
                <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Welcome back, {user.displayName || user.email?.split('@')[0] || 'Resumae creator'}
                </h1>
               
                <div className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2563eb]" />
                    {resumes.length ? 'Pick up where you left off.' : 'Start building your first resume.'}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" /> Autosave & cloud sync enabled
                  </div>
                </div>
              </div>
            
            </motion.div>

    
          

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
                      : 'border-[#c7d2fe] bg-white text-[#2563eb] hover:bg-[#f5f9ff]'
                  }`}>
                    {isUploading ? (
                      <><Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Upload Resume</>
                    )}
                  </span>
                </label>
                <Link to="/builder?new=true" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto gap-2 h-auto rounded-full bg-[#2563eb] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[rgba(37,99,235,0.3)] hover:bg-[#1d4ed8] whitespace-nowrap">
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
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#2563eb]" /> Loading your saved resumes...
              </div>
            )}

            {!loading && resumes.length === 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="show"
                className="mt-6 rounded-3xl border border-dashed border-[#c7d2fe] bg-white/80 p-10 text-center shadow-xl shadow-[rgba(37,99,235,0.12)] backdrop-blur"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No resumes yet</h3>
                <p className="mt-2 text-sm text-gray-500">Create your first resume to start building your library.</p>
                <Link to="/builder?new=true">
                  <Button className="mt-6 gap-2 rounded-full bg-[#2563eb] text-white hover:bg-[#1d4ed8]">
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
                    <Card className="group rounded-3xl overflow-hidden border border-[#dbeafe] border-dashed bg-white/80 shadow-lg shadow-[rgba(37,99,235,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-[#c7d2fe]">
                      <div
                        className="relative cursor-pointer bg-gradient-to-br from-[#e3ecff]/60 via-white to-white p-3"
                        onClick={() => handleView(resume)}
                        style={{ height: '280px' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                          <div className="h-full w-full max-w-[160px] overflow-hidden rounded-lg border border-[#dbeafe]/70 bg-white shadow-lg shadow-[rgba(37,99,235,0.12)]">
                            <div className="scale-[0.35] origin-top-left" style={{ width: '210mm', transformOrigin: 'top left' }}>
                              {renderTemplate(resume)}
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2563eb] shadow">
                            View resume
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 rounded-full border border-[#dbeafe] bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#2563eb]">
                          {resume.templateType}
                        </div>
                      </div>
                      <CardHeader className="space-y-3 border-t border-[#dbeafe] bg-white/85 p-4">
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
                            className="rounded-full flex-1 gap-1.5 border-[#dbeafe] text-[#2563eb] hover:bg-[#f5f9ff] text-xs px-2 py-1 h-8"
                            onClick={() => handleView(resume)}
                          >
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full flex-1 gap-1.5 border-[#dbeafe] text-gray-700 hover:bg-[#f5f9ff] text-xs px-2 py-1 h-8"
                            onClick={() => handleEdit(resume._id)}
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full px-2 border-[#dbeafe] text-red-500 hover:bg-red-50 h-8"
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

