import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, type Variants } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getUserResumes, deleteResume, SavedResume } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdvancedATSScanner from '@/components/AdvancedATSScanner';
import { extractResumeFromPDF } from '@/services/geminiService';
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
  Star,
  ShieldCheck,
  LayoutTemplate,
  Users,
  Upload,
  Download,
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

const GradientBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <motion.div
      className="absolute top-[-12rem] right-[18%] h-[28rem] w-[28rem] rounded-full bg-blue-500/12 blur-3xl"
      animate={{
        y: [0, 40, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[-14rem] left-[20%] h-[30rem] w-[30rem] rounded-full bg-purple-500/12 blur-3xl"
      animate={{
        y: [0, -50, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
    />
  </div>
);

const metrics = [
  {
    label: 'Resumes saved',
    value: (count: number) => `${count}`,
    description: 'Drafts synced securely in the cloud',
  },
  {
    label: 'ATS score boost',
    value: () => '92%',
    description: 'Average improvement after refinement',
  },
  {
    label: 'Template swaps',
    value: () => 'Unlimited',
    description: 'Preview every layout instantly',
  },
];

const highlightCards = [
  {
    icon: Sparkles,
    title: 'Keep updating from anywhere',
    description: 'Your resumes stay in sync across devices. Pick up edits on desktop and polish on the go.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure revision history',
    description: 'Every save is tracked so you can revisit previous versions whenever you need.',
  },
  {
    icon: Star,
    title: 'Pin your best versions',
    description: 'Mark high-performing resumes as favorites for quick access before interviews.',
  },
];

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

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewingResume, setViewingResume] = useState<SavedResume | null>(null);
  const [analyzingResume, setAnalyzingResume] = useState<SavedResume | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState<string | null>(null);

  const highlightsRef = useRef<HTMLDivElement>(null);
  const highlightsInView = useInView(highlightsRef, { once: true, amount: 0.25 });

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
        toast.error('Failed to extract resume data. Please check your Gemini API key.', { id: 'upload' });
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      
      if (error?.message === 'RATE_LIMIT_EXCEEDED') {
        toast.error(
          'API rate limit exceeded. Please wait a few minutes and try again. The free tier has limits on requests per minute.',
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/60">
      <GradientBackdrop />

      {/* View Resume Dialog */}
      <Dialog open={!!viewingResume} onOpenChange={(open) => !open && setViewingResume(null)}>
        <DialogContent className="max-w-[95vw] w-[900px] max-h-[90vh] overflow-y-auto border border-blue-100 bg-white/90 shadow-2xl shadow-blue-500/20 backdrop-blur">
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
                  className="gap-2 border-green-200 bg-green-50/70 text-green-600 hover:bg-green-100"
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
                  className="gap-2 border-blue-200 bg-blue-50/70 text-blue-600 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {viewingResume && (
              <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/60 via-white to-white p-6 shadow-xl shadow-blue-500/10">
                <div className="flex justify-center">
                  <div
                    className="rounded-xl bg-white shadow-2xl shadow-blue-500/20"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border border-blue-100 bg-white/95 shadow-xl shadow-blue-500/10 backdrop-blur">
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
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <img
                src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                alt="Resumatic"
                className="h-8 w-auto"
              />
              <span>Resumatic</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                {user?.photoURL && (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="h-10 w-10 rounded-full border-2 border-blue-100 shadow-sm hover:border-blue-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                    <div className="absolute right-0 top-12 z-50 w-64 rounded-xl border border-blue-100 bg-white/95 shadow-xl shadow-blue-500/20 backdrop-blur">
                      <div className="p-4 border-b border-blue-100">
                        <div className="flex items-center gap-3">
                          {user?.photoURL && (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || 'User'}
                              className="h-12 w-12 rounded-full border-2 border-blue-100"
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
                          className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
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

      <main className="relative z-10 pt-28 pb-20 sm:pt-32">
        <div className="container mx-auto px-4">
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-blue-100 bg-white/85 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur"
          >
            <motion.div variants={fadeInUp} className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                  Dashboard
                </div>
                <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Welcome back, {user.displayName || user.email?.split('@')[0] || 'Resumatic creator'}
                </h1>
                <p className="mt-3 text-sm text-gray-600">
                  Access every resume version you&apos;ve crafted, update on the fly, and export when opportunity strikes.
                </p>
                <div className="mt-6 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    {resumes.length ? 'Pick up where you left off.' : 'Start building your first resume.'}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" /> Autosave & cloud sync enabled
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 rounded-2xl border border-blue-100/70 bg-white/70 p-5 text-sm text-gray-600 shadow-sm shadow-blue-500/5">
                {metrics.map(({ label, value, description }) => (
                  <div key={label} className="min-w-[160px]">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-blue-600">{value(resumes.length)}</p>
                    <p className="mt-1 text-xs text-gray-500">{description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

          

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-between gap-4">
             
              <div className="flex gap-3">
                <div>
                  <input
                    id="upload-resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleUploadResume}
                    disabled={isUploading}
                    className="hidden"
                  />
                  <label htmlFor="upload-resume">
                    <span className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-600 shadow-lg shadow-blue-500/10 hover:bg-blue-50 cursor-pointer transition-colors">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" /> Upload Resume
                        </>
                      )}
                    </span>
                  </label>
                </div>
                <Link to="/builder?new=true">
                  <Button className="gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Create New Resume
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.section>


          <div className='mt-7 ml-4'>
                <h2 className="text-2xl font-semibold text-gray-900">My Resumes</h2>
                <p className="text-sm text-gray-500">Manage, preview, and refine every version you&apos;ve saved.</p>
              </div>

          <section className="relative mt-1">
            {loading && (
              <div className="flex items-center justify-center py-16 text-sm text-gray-600">
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-blue-600" /> Loading your saved resumes...
              </div>
            )}

            {!loading && resumes.length === 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="show"
                className="mt-6 rounded-3xl border border-dashed border-blue-200 bg-white/80 p-10 text-center shadow-xl shadow-blue-500/10 backdrop-blur"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">No resumes yet</h3>
                <p className="mt-2 text-sm text-gray-500">Create your first resume to start building your library.</p>
                <Link to="/builder?new=true">
                  <Button className="mt-6 gap-2 bg-blue-600 text-white hover:bg-blue-700">
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
                    <Card className="group overflow-hidden border border-blue-100 bg-white/80 shadow-lg shadow-blue-500/10 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-200">
                      <div
                        className="relative cursor-pointer bg-gradient-to-br from-blue-50/60 via-white to-white p-3"
                        onClick={() => handleView(resume)}
                        style={{ height: '280px' }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                          <div className="h-full w-full max-w-[160px] overflow-hidden rounded-lg border border-blue-100/70 bg-white shadow-lg shadow-blue-500/10">
                            <div className="scale-[0.35] origin-top-left" style={{ width: '210mm', transformOrigin: 'top left' }}>
                              {renderTemplate(resume)}
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-600 shadow">
                            View resume
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 rounded-full border border-blue-100 bg-white/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                          {resume.templateType}
                        </div>
                      </div>
                      <CardHeader className="space-y-3 border-t border-blue-100 bg-white/85 p-4">
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
                            className="flex-1 gap-1.5 border-blue-100 text-blue-600 hover:bg-blue-50 text-xs px-2 py-1 h-8"
                            onClick={() => handleView(resume)}
                          >
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5 border-blue-100 text-gray-700 hover:bg-blue-50 text-xs px-2 py-1 h-8"
                            onClick={() => handleEdit(resume._id)}
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="px-2 border-blue-100 text-red-500 hover:bg-red-50 h-8"
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
                          className="w-full gap-1.5 border-green-100 text-green-600 hover:bg-green-50 text-xs py-2 h-8 mb-2"
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
                          className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-xs py-2 h-8"
                          onClick={() => setAnalyzingResume(resume)}
                        >
                          <Sparkles className="h-3 w-3" /> ATS Score
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

