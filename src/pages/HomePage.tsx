import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import LoginButton from '@/components/LoginButton';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  Loader2,
  Brain,
  BarChart,
  Blocks,
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
    accentBg: '#ffeccc',
    accentColor: '#b46a00',
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
      'The AI parser saved me hours! I uploaded my old resume and it instantly formatted everything perfectly. The ATS scanner helped me get past the initial screening.',
    name: 'Sarah Mitchell',
    role: 'Software Engineer',
  },
  {
    quote:
      'Building my resume from scratch was surprisingly easy. The templates are professional and the live preview made it simple to see exactly how it would look.',
    name: 'David Chen',
    role: 'Product Manager',
  },
  {
    quote:
      'The ATS analytics feature is a game-changer. I could see exactly what keywords I was missing and how to optimize my resume. Got three interviews in one week!',
    name: 'Emily Rodriguez',
    role: 'Marketing Specialist',
  },
  {
    quote:
      'I tried multiple resume builders before finding Resumae. The interface is intuitive, templates are modern, and the export quality is excellent. Highly recommend!',
    name: 'Michael Thompson',
    role: 'Data Analyst',
  },
  {
    quote:
      'As a career changer, I needed my resume to stand out. The professional templates and smart suggestions helped me highlight my transferable skills perfectly.',
    name: 'Jessica Williams',
    role: 'UX Designer',
  },
  {
    quote:
      'The speed and ease of use are impressive. I updated my resume in under 20 minutes and the final PDF looked incredibly professional. Worth every minute!',
    name: 'Robert Kumar',
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

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [scrollX, setScrollX] = useState(0);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallax = useTransform(scrollY, [0, 400], [0, -80]);

  const resumeImages = [
    'https://static.wixstatic.com/media/5c0589_ede979d665e9417fa087494a38873355~mv2.png',
    'https://static.wixstatic.com/media/5c0589_3f3478d101914b86a94b87e2060148a7~mv2.png'
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHovering) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % resumeImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

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

  const handleStartBuilding = async () => {
    if (user) {
      // User is already logged in, navigate to builder
      navigate('/builder');
    } else {
      // User needs to sign in first
      try {
        setIsSigningIn(true);
        await signInWithGoogle();
        toast.success('Signed in successfully!');
        navigate('/builder');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Please sign in to start building your resume');
      } finally {
        setIsSigningIn(false);
      }
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

  return (
    <div
      className="relative min-h-screen overflow-hidden text-gray-900"
      style={{
        backgroundColor: '#f6f3ef',
        backgroundImage: 'radial-gradient(#d4c9be 1.15px, transparent 1.15px)',
        backgroundSize: '22px 22px',
      }}
      onMouseMove={handleCanvasMove}
      onMouseLeave={handleCanvasLeave}
    >
      <GradientOrbs />
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
          backgroundImage: 'radial-gradient(#fb651e 1.5px, transparent 1.5px)',
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
            ? 'backdrop-blur-lg ring-1 ring-[#fb651e]/10'
            : ' '
        } fixed top-0 left-0 right-0 z-50  transition-all duration-300`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div className="flex items-center gap-3" variants={staggerContainer} initial="hidden" animate="show">
            <motion.img
              src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
              alt="Resumae"
              className="h-9 w-auto"
              variants={fadeInUp}
            />
            <motion.div className="flex flex-col" variants={fadeInUp}>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-gray-900">Resumae</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-blue-600">
                  Beta
                </span>
              </div>
              <span className="text-[11px] text-gray-500 -mt-0.5 flex items-center gap-1">
                Powered by <img src="/redstring.png" alt="Redstring" className="h-3 w-auto" />
              </span>
            </motion.div>
          </motion.div>
          <div className="flex  items-center gap-3">
            <LoginButton />
           
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
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-3 rounded-full border border-[#f9d6c2] bg-[#fff7f0]/80 px-4 py-2 shadow-sm backdrop-blur">
                  <img
                    src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                    alt="Resumae"
                    className="h-8 w-auto"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#fb651e]">Resumae</p>
                    <span className="text-xs text-gray-400">|</span>
                    <p className="text-xs text-gray-500 flex items-center gap-1">Powered by <img src="/redstring.png" alt="Redstring" className="h-3 w-auto" /></p>
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
                >
                  <span className="block">Build Your Perfect</span>
                  <span className="block">
                    <span className="text-gray-900">Resume in </span>
                    <span className="relative inline-flex flex-col" style={{ color: '#fb651e' }}>
                      Minutes
                      <motion.span
                        className="mt-2 h-1 w-full rounded-full"
                        style={{ backgroundColor: '#fb651e', opacity: 0.6 }}
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
                  <Button
                    onClick={handleStartBuilding}
                    disabled={isSigningIn}
                    size="lg"
                    className="h-14 rounded-full bg-[#fb651e] px-10 text-lg text-white shadow-xl  transition-all hover:-translate-y-1 hover:bg-[#e35712] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSigningIn ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                
                </motion.div>

              

               
              </div>

              <motion.div
                variants={fadeInUp}
                className="relative mx-auto w-full max-w-xl flex items-center justify-center"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="relative rounded-[32px] bg-transparent overflow-hidden cursor-pointer" 
                  style={{ width: '100%', maxWidth: '400px' }}
                  onMouseEnter={() => {
                    setIsHovering(true);
                    setTimeout(() => {
                      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
                    }, 50);
                  }}
                  onMouseLeave={() => {
                    setIsHovering(false);
                  }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                      key={currentImageIndex}
                      src={resumeImages[currentImageIndex]}
                      alt="Resume Template Preview"
                      className="w-full h-auto object-contain pointer-events-none"
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                      style={{ transformStyle: 'preserve-3d' }}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

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
                <div className="space-y-4">
                 
                  <h2 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    Powerful features
                    <br />
                    <span className="relative inline-block">
                      <span className="relative z-10">that work for you</span>
                      <span className="pointer-events-none absolute inset-x-0 bottom-1 h-4 rounded-full bg-[#fb651e]/60" />
                     
                    </span>
                  </h2>
                </div>

                <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                  <img src="/arrow.png" alt="arrow" className='w-32 xl:w-40 -rotate-45 object-contain' />
                </div>

                <div className="relative flex items-center justify-center">
                  <Button
                    onClick={handleStartBuilding}
                    disabled={isSigningIn}
                    className="rounded-full bg-[#fb651e] px-10 py-4 text-lg font-semibold text-white  transition-transform hover:-translate-y-1 hover:bg-[#fb651e]/80 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSigningIn ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
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
                  <div className="rounded-2xl border-2 border-[#f9d6c2] bg-white p-4 shadow-2xl shadow-[rgba(251,101,30,0.1)] hover:border-[#fb651e] hover:shadow-[rgba(251,101,30,0.2)] hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
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
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f6f3ef] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f6f3ef] to-transparent z-10" />
          </div>

          
        </div>
      </section>

    

    

      {/* Testimonials */}
      <section ref={testimonialsRef} className="relative mt-32 mb-32">
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
            
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testimonialsInView ? 'show' : 'hidden'}
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={`${testimonial.name}-${index}`} variants={fadeInUp}>
                <div className="h-full rounded-2xl  bg-white p-6 shadow-lg  hover:shadow-xl hover:shadow-[rgba(251,101,30,0.15)] hover:border-[#fb651e] transition-all duration-300">
                  <div className="mb-4">
                    <svg className="h-8 w-8 text-[#fb651e]/30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-[#f9d6c2] pt-4">
                    <p className="text-sm font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#f9d6c2] py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© 2025 Resumae. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <a 
                href="https://redstring.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
              >
                <img 
                  src="/redstring.png" 
                  alt="Redstring" 
                  className="h-5 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

