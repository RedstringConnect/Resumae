import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import LoginButton from '@/components/LoginButton';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import {
  ArrowRight,
  Loader2,
  Brain,
  BarChart,
  Blocks,
  MessageSquare,
  Upload,
  Menu,
} from 'lucide-react';

const featureHighlights = [
  {
    icon: Brain,
    title: 'AI-Powered Resume Parser',
    description: 'Upload your existing resume and let our AI instantly extract and format all your information. Save hours of manual data entry.',
    accentBg: '#e4e6ff',
    accentColor: '#2a3dbd',
  },
  {
    icon: BarChart,
    title: 'Advanced ATS Analytics',
    description: 'Get real-time feedback on how your resume performs against Applicant Tracking Systems. Optimize for better job matches.',
    accentBg: '#d6f7d5',
    accentColor: '#0a7b29',
  },
  {
    icon: Blocks,
    title: 'Build From Scratch',
    description: 'Start fresh with our intuitive builder. Professional templates, smart suggestions, and instant previews make creation effortless.',
    accentBg: '#e0e7ff',
    accentColor: '#2563eb',
  },
];

const resumeTemplates = [
  {
    id: 'modern',
    name: 'Modern',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3f3478d101914b86a94b87e2060148a7~mv2.png',
  },
  {
    id: 'executive',
    name: 'Executive',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_ede979d665e9417fa087494a38873355~mv2.png',
  },
  {
    id: 'technical',
    name: 'Technical',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3dbd1d9927654d0392a47bd075897d8a~mv2.png',
  },
  {
    id: 'classic',
    name: 'Classic',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_438ecda1168249db860ce1056c283520~mv2.png',
  },
  {
    id: 'professional',
    name: 'Professional',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_cda9004a5dd14b33bc5397fb964ec849~mv2.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3f9e69e6d61f4495a0502193c206bc8e~mv2.png',
  },
  {
    id: 'ugly',
    name: 'I Don\'t Want a Job',
    imageUrl: 'https://static.wixstatic.com/media/5c0589_d3e4e85075154a098fe9ed52cbbcefb6~mv2.png',
  },
];

const testimonials = [
  {
    quote:
      'The website is smooth and the main thing i liked is if you upload your old resume, the information is filled automatically which is making my resume updation more easier.',
    name: 'Raja Vamshi Dasu',
    role: 'Software Engineer',
  },
  {
    quote:
      'I was able to classify my details properly. It is very smooth and works very well. Overall, my experience with it is good.',
    name: 'Sammad',
    role: 'Product Manager',
  },
  {
    quote:
      'This UI is very simple and clean to make users feel convenient.',
    name: 'Shivakrishna',
    role: 'Marketing Specialist',
  },
  {
    quote:
      'I tried multiple resume builders before finding Resumae. The interface is intuitive, templates are modern, and the export quality is excellent. Highly recommend!',
    name: 'Vishwa',
    role: 'Data Analyst',
  },
  {
    quote:
      'As a career changer, I needed my resume to stand out. The professional templates and smart suggestions helped me highlight my transferable skills perfectly.',
    name: 'Siddhartha',
    role: 'UX Designer',
  },
  {
    quote:
      'The speed and ease of use are impressive. I updated my resume in under 20 minutes and the final PDF looked incredibly professional. Worth every minute!',
    name: 'Rohan ',
    role: 'Business Analyst',
  },
];

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
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

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const [testimonialScrollY1, setTestimonialScrollY1] = useState(0);
  const [testimonialScrollY2, setTestimonialScrollY2] = useState(0);
  const [testimonialScrollY3, setTestimonialScrollY3] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallax = useTransform(scrollY, [0, 400], [0, -80]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Infinite scroll animation for templates
  useEffect(() => {
    const cardWidth = 300 + 24; // card width + gap
    const totalWidth = cardWidth * resumeTemplates.length;
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 40000; // 40 seconds for one complete cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      setScrollX(-(progress * totalWidth));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Infinite scroll animation for testimonials - Column 1 (down)
  useEffect(() => {
    const cardHeight = 200 + 24; // approximate card height + gap
    const isMobile = window.innerWidth < 768;
    const itemsPerColumn = isMobile ? testimonials.length : 2;
    const singleSetHeight = cardHeight * itemsPerColumn;
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = isMobile ? 20000 : 30000; // Faster on mobile (20s vs 30s)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      // Loop back when reaching the height of one set
      setTestimonialScrollY1(-(progress * singleSetHeight));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Infinite scroll animation for testimonials - Column 2 (up)
  useEffect(() => {
    const cardHeight = 200 + 24; // approximate card height + gap
    const itemsPerColumn = 2;
    const singleSetHeight = cardHeight * itemsPerColumn;
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 30000; // 30 seconds for one complete cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      // Scroll upward - start from bottom and move to top
      setTestimonialScrollY2(-singleSetHeight + (progress * singleSetHeight));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Infinite scroll animation for testimonials - Column 3 (down)
  useEffect(() => {
    const cardHeight = 200 + 24; // approximate card height + gap
    const itemsPerColumn = 2;
    const singleSetHeight = cardHeight * itemsPerColumn;
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 30000; // 30 seconds for one complete cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;
      // Loop back when reaching the height of one set
      setTestimonialScrollY3(-(progress * singleSetHeight));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleStartBuilding = () => {
    // Allow users to access builder without login
    navigate('/builder?new=true');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

    setIsUploading(true);
    toast.loading('Processing your resume... This may take a moment.', { id: 'upload' });

    try {
      // Import the extraction service
      const { extractResumeFromPDF } = await import('@/services/groqService');
      const extractedData = await extractResumeFromPDF(file);
      
      if (extractedData) {
        toast.success('Resume extracted successfully! Redirecting to builder...', { id: 'upload' });
        
        // Store extracted data in localStorage temporarily
        localStorage.setItem('resumatic_uploaded_data', JSON.stringify(extractedData));
        
        // Navigate to builder with uploaded flag
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

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, amount: 0.2 });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });

  const handleCanvasMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    if (!isCursorActive) {
      setIsCursorActive(true);
    }
  };

  const handleCanvasLeave = () => setIsCursorActive(false);

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error('Email service is not configured. Please try again later.');
      return;
    }

    setIsSendingFeedback(true);

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

  return (
    <div
      className="relative min-h-screen overflow-hidden text-gray-900"
      style={{
        backgroundColor: '#f4f7ff',
        backgroundImage: 'radial-gradient(#c7d2fe 1.15px, transparent 1.15px)',
        backgroundSize: '22px 22px',
      }}
      onMouseMove={handleCanvasMove}
      onMouseLeave={handleCanvasLeave}
    >
      <GradientOrbs />
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md border border-[#dbeafe] bg-white/95 shadow-2xl shadow-[rgba(37,99,235,0.2)] backdrop-blur">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <MessageSquare className="h-5 w-5 text-[#2563eb]" />
              Share Your Feedback
            </DialogTitle>
          </DialogHeader>
          <form id="landing-feedback-form" onSubmit={handleSubmitFeedback} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="landing-feedback-name" className="text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                id="landing-feedback-name"
                placeholder="Your name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                disabled={isSendingFeedback}
                className="border-[#dbeafe] focus-visible:ring-[#2563eb]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="landing-feedback-email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="landing-feedback-email"
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
              <Label htmlFor="landing-feedback-message" className="text-sm font-medium text-gray-700">
                Feedback
              </Label>
              <Textarea
                id="landing-feedback-message"
                placeholder="Share your thoughts, suggestions, or report issues..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                disabled={isSendingFeedback}
                className="min-h-[120px] border-[#dbeafe] focus-visible:ring-[#2563eb]"
                required
              />
            </div>
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
          </form>
        </DialogContent>
      </Dialog>
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={
          isCursorActive
            ? { opacity: 1 }
            : { opacity: 0 }
        }
        transition={{
          opacity: { duration: 0.3, ease: 'easeOut' },
        }}
        style={{
          backgroundImage: 'radial-gradient(#2563eb 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          clipPath: `circle(80px at ${cursorPos.x}px ${cursorPos.y}px)`,
          WebkitClipPath: `circle(80px at ${cursorPos.x}px ${cursorPos.y}px)`,
        }}
      />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`${
          isScrolled
            ? 'backdrop-blur-lg ring-1 ring-[#2563eb]/10'
            : ' '
        } fixed top-0 left-0 right-0 z-50  transition-all duration-300`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div className="flex items-center gap-2 sm:gap-3" variants={staggerContainer} initial="hidden" animate="show">
            <motion.img
              src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
              alt="Resumae"
              className="h-7 sm:h-9 w-auto"
              variants={fadeInUp}
            />
            <motion.div className="flex flex-col" variants={fadeInUp}>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-gray-900">Resumae</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                  Beta
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-500 -mt-0.5 flex items-center gap-1">
                <span className="hidden sm:inline">Powered by</span>
                <img src="/redstring.png" alt="Redstring" className="h-2.5 sm:h-3 w-auto mt-1" />
              </div>
            </motion.div>

         
          </motion.div>
          <div className="flex items-center gap-3">
            <div className="relative md:hidden" ref={mobileMenuRef}>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dbeafe] bg-white text-[#2563eb] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f5f9ff] ${
                  isMobileMenuOpen ? 'ring-2 ring-[#2563eb]/30' : ''
                }`}
              >
                <Menu className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-64 rounded-2xl border border-[#e0e7ff] bg-white p-4 shadow-xl shadow-[rgba(15,23,42,0.12)]"
                  >
                    <a
                      href="https://chat.whatsapp.com/LcE580c36xd6b63QnPuoJq"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex w-full items-center justify-between gap-2 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#1d4ed8]"
                    >
                      <span>Join the Talent Network</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#e0e7ff] to-transparent" />
                    <LoginButton className="w-full justify-center" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://chat.whatsapp.com/LcE580c36xd6b63QnPuoJq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563eb] px-5 text-sm font-semibold text-white shadow-lg  transition hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
              >
                <span>Join the Talent Network</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <LoginButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-32 sm:pt-36 lg:pt-40">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ y: parallax }}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-12 lg:gap-20 xl:gap-28 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <div className='flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start mb-6'>
                  <a href="https://www.producthunt.com/products/resumae?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-resumae" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1040757&theme=light&t=1763792376973" 
                      alt="Resumae - Free resume builder | Product Hunt" 
                      className="w-[200px] sm:w-[250px] h-auto" 
                    />
                  </a>
                  <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-[#dbeafe] bg-[#eff6ff]/80 px-3 sm:px-4 py-1.5 sm:py-2 shadow-sm backdrop-blur">
                    <img
                      src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                      alt="Resumae"
                      className="h-6 sm:h-8 w-auto"
                    />
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#2563eb]">Resumae</p>
                      <span className="text-xs text-gray-400">|</span>
                      <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                        <span className="hidden sm:inline">Powered by</span>
                        <img src="/redstring.png" alt="Redstring" className="h-2.5 sm:h-3 w-auto mt-1" />
                      </p>
                    </div>
                  </motion.div>
                </div>

                <motion.h1
                  variants={fadeInUp}
                  className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                >
                  <span className="block">Build Your Perfect</span>
                  <span className="block">
                    <span className="text-gray-900">Resume in </span>
                    <span className="relative inline-flex flex-col" style={{ color: '#2563eb' }}>
                      Minutes
                      <motion.span
                        className="mt-2 h-1 w-full rounded-full"
                        style={{ backgroundColor: '#2563eb', opacity: 0.6 }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                      />
                    </span>
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="mt-6 text-lg text-gray-600 sm:text-xl"
                >
                  Create professional, ATS-friendly resumes with our intuitive builder. Choose from premium templates and land your dream job faster.
                </motion.p>

                <motion.div variants={fadeInUp} className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center lg:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={handleStartBuilding}
                    size="lg"
                    className="h-14 rounded-full bg-[#2563eb] px-10 text-lg text-white shadow-xl  transition-all hover:-translate-y-1 hover:bg-[#1d4ed8]"
                  >
                    Create your first resumae <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-full border-2 border-[#2563eb] px-10 text-lg text-[#2563eb] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Enhance the existing
                      </>
                    )}
                  </Button>
                </motion.div>

              

               
              </div>

              <motion.div
                variants={fadeInUp}
                className="relative mx-auto w-full max-w-xl flex flex-col items-center justify-center"
                style={{ perspective: '1000px' }}
              >
                <motion.img
                  src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                  alt="Resume Preview"
                  className="w-full h-auto object-contain relative z-10"
                  animate={{
                    y: [0, -20, 0],
                    rotateZ: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    filter: 'drop-shadow(0 25px 50px rgba(37, 99, 235, 0.15))',
                  }}
                />
                <motion.img
                  src="https://static.wixstatic.com/media/5c0589_473db15555bf4a269b856527b650e913~mv2.png"
                  alt="Shadow"
                  className="w-full h-auto object-contain absolute bottom-0"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    opacity: 0.6,
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Redstring Banner */}
      {/* <section className="relative mt-16 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <motion.a
            href="https://www.redstring.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3 rounded-2xl border border-[#c7d2fe]/70 bg-gradient-to-r from-[#e3ecff] via-white to-purple-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 shadow-lg shadow-[rgba(37,99,235,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#9bbcff] hover:shadow-[rgba(37,99,235,0.2)]"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">Discover the undiscovered startup opportunities</p>
                <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <span>find the jobs from top Indian startups</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c7d2fe] bg-white px-4 py-2 text-xs font-semibold text-[#2563eb] shadow-sm">
                Try 
                <img src="/redstring.png" alt="Redstring" className="h-5 w-auto mt-1" />
              </span>
            </div>
          </motion.a>
        </div>
      </section> */}

      {/* Features */}
      <section ref={featuresRef} className="relative mt-32 max-w-6xl mx-auto">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? 'show' : 'hidden'}
            className="space-y-16"
          >
            <motion.div variants={fadeInUp} className="relative">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4 text-center lg:text-left">
                 
                  <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Powerful features
                    <br />
                    <span className="relative inline-block">
                      <span className="relative z-10">that work for you</span>
                      <span className="pointer-events-none absolute inset-x-0 bottom-1 h-4 rounded-full bg-[#2563eb]/60" />
                     
                    </span>
                  </h2>
                </div>

                <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                  <img src="/arrow.png" alt="arrow" className='w-32 xl:w-40 -rotate-45 object-contain' />
                </div>

                <div className="relative flex items-center justify-center">
                  <Button
                    onClick={handleStartBuilding}
                    className="rounded-full bg-[#2563eb] px-10 py-4 text-lg font-semibold text-white  transition-transform hover:-translate-y-1 hover:bg-[#1d4ed8]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>



                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid gap-10 md:grid-cols-3">
              {featureHighlights.map(({ icon: Icon, title, description, accentBg, accentColor }) => (
                <div key={title} className="space-y-4">
                  <div
                    className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ backgroundColor: accentBg }}
                  >
                    <Icon className="h-6 w-6" style={{ color: accentColor }} />
                  </div>
                  <p className="text-xl font-semibold text-gray-900">{title}</p>
                  <p className="text-base text-gray-600">{description}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process - Template Showcase */}
      <section ref={processRef} className="relative mt-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={processInView ? 'show' : 'hidden'}
            className="mx-auto max-w-3xl text-center mb-12"
          >
          
            <h2 className="mt-6 text-3xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl">
              Choose from our professional templates
            </h2>
            <p className="mt-4 text-gray-600">
              All templates are ATS-friendly and designed by professionals
            </p>
          </motion.div>

          {/* Infinite Scroll Animation */}
          <div className="relative overflow-hidden py-8">
            <div 
              className="flex gap-6"
              style={{
                transform: `translateX(${scrollX}px)`,
                willChange: 'transform',
              }}
            >
              {/* Render templates twice for seamless infinite loop */}
              {[...resumeTemplates, ...resumeTemplates].map((template, index) => (
                <div
                  key={`${template.id}-${index}`}
                  className="flex-shrink-0 w-[300px]"
                >
                  <div className="rounded-2xl border-2 border-[#dbeafe] bg-white p-4 shadow-2xl shadow-[rgba(37,99,235,0.1)] hover:border-[#2563eb] hover:shadow-[rgba(37,99,235,0.2)] hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                    <div className="relative aspect-[1/1.4] overflow-hidden rounded-lg bg-gray-50">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="h-full w-full object-cover object-top"
                        draggable="false"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradient overlays for fade effect */}
            <div className="hidden md:block pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f4f7ff] to-transparent z-10" />
            <div className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f4f7ff] to-transparent z-10" />
          </div>

          
        </div>
      </section>

    

    

      {/* Testimonials */}
      <section ref={testimonialsRef} className="relative mt-32 mb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={testimonialsInView ? 'show' : 'hidden'}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl">
              Loved by job seekers everywhere
            </h2>
            <p className="mt-4 text-gray-600">
              Real feedback from professionals who landed their dream jobs
            </p>
          </motion.div>

          {/* Three Column Infinite Scroll with Alternating Directions */}
          <div className="relative py-8">
            <div className="flex justify-center items-start gap-3 sm:gap-4 max-w-5xl mx-auto">
              {/* Column 1 - Scroll Down - Shows all testimonials on mobile, first 2 on desktop */}
              <div className="overflow-hidden h-[400px] w-full max-w-[280px] sm:max-w-[420px] relative">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    transform: `translateY(${testimonialScrollY1}px)`,
                    willChange: 'transform',
                  }}
                >
                  {/* On mobile: show all testimonials, On desktop: show first 2 */}
                  {[
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768 ? testimonials : testimonials.slice(0, 2))
                  ].map((testimonial, index) => (
                    <div
                      key={`col1-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div className="rounded-xl border border-[#dbeafe] bg-white p-4 shadow-md hover:shadow-lg hover:shadow-[rgba(37,99,235,0.12)] hover:border-[#2563eb] transition-all duration-300">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{testimonial.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{testimonial.role}</p>
                          </div>
                          <svg className="h-5 w-5 text-[#2563eb]/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#f4f7ff] to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f4f7ff] to-transparent z-10" />
              </div>

              {/* Column 2 - Scroll Up */}
              <div className="overflow-hidden h-[400px] w-full max-w-[280px] sm:max-w-[420px] relative hidden md:block">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    transform: `translateY(${testimonialScrollY2}px)`,
                    willChange: 'transform',
                  }}
                >
                  {[...testimonials.slice(2, 4), ...testimonials.slice(2, 4), ...testimonials.slice(2, 4), ...testimonials.slice(2, 4), ...testimonials.slice(2, 4), ...testimonials.slice(2, 4)].map((testimonial, index) => (
                    <div
                      key={`col2-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div className="rounded-xl border border-[#dbeafe] bg-white p-4 shadow-md hover:shadow-lg hover:shadow-[rgba(37,99,235,0.12)] hover:border-[#2563eb] transition-all duration-300">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{testimonial.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{testimonial.role}</p>
                          </div>
                          <svg className="h-5 w-5 text-[#2563eb]/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#f4f7ff] to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f4f7ff] to-transparent z-10" />
              </div>

              {/* Column 3 - Scroll Down */}
              <div className="overflow-hidden h-[400px] w-full max-w-[280px] sm:max-w-[420px] relative hidden md:block">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    transform: `translateY(${testimonialScrollY3}px)`,
                    willChange: 'transform',
                  }}
                >
                  {[...testimonials.slice(4, 6), ...testimonials.slice(4, 6), ...testimonials.slice(4, 6), ...testimonials.slice(4, 6), ...testimonials.slice(4, 6), ...testimonials.slice(4, 6)].map((testimonial, index) => (
                    <div
                      key={`col3-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div className="rounded-xl border border-[#dbeafe] bg-white p-4 shadow-md hover:shadow-lg hover:shadow-[rgba(37,99,235,0.12)] hover:border-[#2563eb] transition-all duration-300">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center text-white font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 truncate">{testimonial.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{testimonial.role}</p>
                          </div>
                          <svg className="h-5 w-5 text-[#2563eb]/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#f4f7ff] to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f4f7ff] to-transparent z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-black focus-visible text-3xl font-semibold">
               Resumae
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Transforming resume building for job seekers with right tools,<br />
                  rapid creation, and zero hassle
                </p>
                <p className="text-gray-500 text-sm">
                  Built with <span className="text-red-500">❤</span> for job seekers.
                </p>
              </div>

              {/* Socials Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 font-semibold text-lg">Socials</h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://www.instagram.com/redstring.connect/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2563eb] transition-colors text-sm"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://www.linkedin.com/company/redstring-invisible-thread/?viewAsMember=true" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2563eb] transition-colors text-sm"
                  >
                    Linkedin
                  </a>
                  <a 
                    href="https://www.youtube.com/@Redstring.connect" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2563eb] transition-colors text-sm"
                  >
                    Youtube
                  </a>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-gray-900 font-semibold text-lg">Info</h3>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://docs.google.com/document/d/1se7on8TdC82QbPBHmL1JnDifGbMCWxxdWFk_nyqCYQY/edit?tab=t.0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2563eb] transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="https://docs.google.com/document/d/1Ysptt6UfxyZoXH4SEQJJUPRAs0cHqvSTZyXIRBGSe38/edit?tab=t.0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-[#2563eb] transition-colors text-sm"
                  >
                    Terms and Condition
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-[#dbeafe] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="text-gray-600 text-sm">© 2025 Resumae. All rights reserved</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeedbackModal(true)}
                  className="rounded-full gap-1.5 border-[#c7d2fe] bg-white text-[#2563eb] hover:bg-[#f5f9ff] text-xs sm:text-sm px-3 py-1.5 h-auto"
                >
                  <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Feedback</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">Powered by</span>
                <a 
                  href="https://redstring.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  <span className="text-red-500 font-semibold">red</span>
                  <span className="text-gray-900 font-semibold">string</span>
                </a>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}

