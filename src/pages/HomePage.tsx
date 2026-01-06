import { useNavigate } from "react-router-dom";
import {
  useState,
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Lottie from "lottie-react";
import scratchAnimation from "../../public/scratch.json";
import analyticsAnimation from "../../public/analytics.json";
import aiAnimation from "../../public/ai.json";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import LoginButton from "@/components/LoginButton";
import { ArcadeEmbed } from "@/components/ArcadeEmbed";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";
import {
  ArrowRight,
  Loader2,
  MessageSquare,
  Upload,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

const featureHighlights = [
  {
    icon: () => (
      <Lottie
        animationData={scratchAnimation}
        loop={true}
        style={{ width: 280, height: 280 }}
      />
    ),
    title: "Build From Scratch",
    description:
      "Start fresh with our intuitive builder. Professional templates, smart suggestions, and instant previews make creation effortless.",
    accentBg: "#ffe9d6",
    accentColor: "#c05621",
  },
  {
    icon: () => (
      <Lottie
        animationData={analyticsAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    ),
    title: "Advanced ATS Analytics",
    description:
      "Get real-time feedback on how your resume performs against Applicant Tracking Systems. Optimize for better job matches.",
    accentBg: "#d6f7d5",
    accentColor: "#0a7b29",
  },
  {
    icon: () => (
      <Lottie
        animationData={aiAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    ),
    title: "AI Resume Writer",
    description:
      " Let AI craft your entire resume from scratch. Just share your experience in a conversation, and watch as intelligent algorithms transform your career story into compelling, professionally-written content tailored to your target role.",
    accentBg: "#e4e6ff",
    accentColor: "#2a3dbd",
  },
];

const resumeTemplates = [
  {
    id: "modern",
    name: "Modern",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_3f3478d101914b86a94b87e2060148a7~mv2.png",
  },
  {
    id: "executive",
    name: "Executive",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_ede979d665e9417fa087494a38873355~mv2.png",
  },
  {
    id: "technical",
    name: "Technical",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_3dbd1d9927654d0392a47bd075897d8a~mv2.png",
  },
  {
    id: "classic",
    name: "Classic",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_438ecda1168249db860ce1056c283520~mv2.png",
  },
  {
    id: "professional",
    name: "Professional",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_cda9004a5dd14b33bc5397fb964ec849~mv2.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_3f9e69e6d61f4495a0502193c206bc8e~mv2.png",
  },
  {
    id: "ugly",
    name: "I Don't Want a Job",
    imageUrl:
      "https://static.wixstatic.com/media/5c0589_d3e4e85075154a098fe9ed52cbbcefb6~mv2.png",
  },
];

const testimonials = [
  {
    quote:
      "The website is smooth and the main thing i liked is if you upload your old resume, the information is filled automatically which is making my resume updation more easier.",
    name: "Raja Vamshi Dasu",
    role: "Software Engineer",
  },
  {
    quote:
      "I was able to classify my details properly. It is very smooth and works very well. Overall, my experience with it is good.",
    name: "Sammad",
    role: "Product Manager",
  },
  {
    quote: "This UI is very simple and clean to make users feel convenient.",
    name: "Shivakrishna",
    role: "Marketing Specialist",
  },
  {
    quote:
      "I tried multiple resume builders before finding Resumae. The interface is intuitive, templates are modern, and the export quality is excellent. Highly recommend!",
    name: "Vishwa",
    role: "Data Analyst",
  },
  {
    quote:
      "As a career changer, I needed my resume to stand out. The professional templates and smart suggestions helped me highlight my transferable skills perfectly.",
    name: "Siddhartha",
    role: "UX Designer",
  },
  {
    quote:
      "The speed and ease of use are impressive. I updated my resume in under 20 minutes and the final PDF looked incredibly professional. Worth every minute!",
    name: "Rohan ",
    role: "Business Analyst",
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

// Unused component - kept for reference
// const GradientOrbs = () => (
//   <>
//     <motion.div
//       className="absolute top-[-12rem] -right-32 h-[28rem] w-[28rem] rounded-full bg-black/5 dark:bg-white/5 blur-3xl"
//       animate={{
//         y: [0, 40, 0],
//         scale: [1, 1.05, 1],
//       }}
//       transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
//     />
//     <motion.div
//       className="absolute bottom-[-14rem] -left-24 h-[30rem] w-[30rem] rounded-full bg-black/3 dark:bg-white/3 blur-3xl"
//       animate={{
//         y: [0, -50, 0],
//         scale: [1, 1.08, 1],
//       }}
//       transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
//     />
//     <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.03),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),rgba(0,0,0,0))]" />
//   </>
// );

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return (
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });
  const [, setCursorPos] = useState({ x: 0, y: 0 });
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [trailPositions, setTrailPositions] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const [hoveredCell, setHoveredCell] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [testimonialScrollY1, setTestimonialScrollY1] = useState(0);
  const [testimonialScrollY2, setTestimonialScrollY2] = useState(0);
  const [testimonialScrollY3, setTestimonialScrollY3] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const geminiRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallax = useTransform(scrollY, [0, 400], [0, -80]);

  // Google Gemini Effect scroll handling
  const { scrollYProgress } = useScroll({
    target: geminiRef,
    offset: ["start end", "end start"],
  });

  const pathLengthFirst = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]),
    {
      stiffness: 100,
      damping: 30,
    }
  );
  const pathLengthSecond = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]),
    {
      stiffness: 100,
      damping: 30,
    }
  );
  const pathLengthThird = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]),
    {
      stiffness: 100,
      damping: 30,
    }
  );
  const pathLengthFourth = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]),
    {
      stiffness: 100,
      damping: 30,
    }
  );
  const pathLengthFifth = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [0, 1.2]),
    {
      stiffness: 100,
      damping: 30,
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
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
      setTestimonialScrollY2(-singleSetHeight + progress * singleSetHeight);
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
    navigate("/builder?new=true");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    toast.loading("Processing your resume... This may take a moment.", {
      id: "upload",
    });

    try {
      // Import the extraction service
      const { extractResumeFromPDF } = await import("@/services/groqService");
      const extractedData = await extractResumeFromPDF(file);

      if (extractedData) {
        toast.success(
          "Resume extracted successfully! Redirecting to builder...",
          { id: "upload" }
        );

        // Store extracted data in localStorage temporarily
        localStorage.setItem(
          "resumatic_uploaded_data",
          JSON.stringify(extractedData)
        );

        // Navigate to builder with uploaded flag
        setTimeout(() => {
          navigate("/builder?uploaded=true");
        }, 1000);
      } else {
        toast.error(
          "Failed to extract resume data. Please try again or use the manual builder.",
          { id: "upload" }
        );
      }
    } catch (error: any) {
      console.error("Error uploading resume:", error);

      if (error?.message === "RATE_LIMIT_EXCEEDED") {
        toast.error(
          "API rate limit exceeded. Please wait a few minutes and try again.",
          { id: "upload", duration: 6000 }
        );
      } else {
        toast.error("Failed to process resume. Please try again later.", {
          id: "upload",
        });
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, amount: 0.2 });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.2,
  });

  const handleHeroMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    // Account for page scroll offset
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;

    setCursorPos({ x: event.clientX, y: event.clientY });

    const gridSize = 72;
    const cellX = Math.floor(x / gridSize) * gridSize - window.scrollX;
    const cellY = Math.floor(y / gridSize) * gridSize - window.scrollY;

    setHoveredCell({ x: cellX, y: cellY });

    setTrailPositions((prev) => {
      const newPos = { x: cellX, y: cellY, id: Date.now() };
      if (
        prev.length === 0 ||
        prev[prev.length - 1].x !== cellX ||
        prev[prev.length - 1].y !== cellY
      ) {
        return [...prev, newPos].slice(-5);
      }
      return prev;
    });

    if (!isCursorActive) {
      setIsCursorActive(true);
    }
  };

  const handleHeroLeave = () => {
    setIsCursorActive(false);
    setTrailPositions([]);
    setHoveredCell(null);
  };

  const updateHoverPosition = (event: ReactMouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--hover-x", `${x}px`);
    event.currentTarget.style.setProperty("--hover-y", `${y}px`);
  };

  const resetHoverPosition = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.style.removeProperty("--hover-x");
    event.currentTarget.style.removeProperty("--hover-y");
  };

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmitFeedback = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !feedbackName.trim() ||
      !feedbackEmail.trim() ||
      !feedbackMessage.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Email service is not configured. Please try again later.");
      return;
    }

    setIsSendingFeedback(true);

    try {
      const templateParams = {
        from_name: feedbackName,
        from_email: feedbackEmail,
        message: feedbackMessage,
        to_name: "Resumae Team",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      toast.success("Feedback sent successfully! Thank you for your input.");
      setShowFeedbackModal(false);
      setFeedbackName("");
      setFeedbackEmail("");
      setFeedbackMessage("");
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const heroBaseColor = isDarkMode ? "#050505" : "#f7f7fb";
  const heroGridLineColor = isDarkMode
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.05)";

  return (
    <div
      className="relative min-h-screen overflow-hidden text-black dark:text-white transition-colors duration-300 font-sans"
      style={{
        backgroundColor: heroBaseColor,
        backgroundImage: `
          linear-gradient(${heroGridLineColor} 1px, transparent 1px),
          linear-gradient(90deg, ${heroGridLineColor} 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
      }}
      onMouseMove={handleHeroMove}
      onMouseLeave={handleHeroLeave}
    >
      {/* Full page grid cell hover highlight */}
      {hoveredCell && (
        <div
          className="fixed z-[5] w-[72px] h-[72px] bg-black/[0.03] dark:bg-white/[0.03] transition-all duration-150 pointer-events-none"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
          }}
        />
      )}

      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md border border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-black dark:text-white">
              <MessageSquare className="h-5 w-5 text-black dark:text-white" />
              Share Your Feedback
            </DialogTitle>
          </DialogHeader>
          <form
            id="landing-feedback-form"
            onSubmit={handleSubmitFeedback}
            className="space-y-4 py-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="landing-feedback-name"
                className="text-sm font-medium text-black dark:text-white"
              >
                Name
              </Label>
              <Input
                id="landing-feedback-name"
                placeholder="Your name"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                disabled={isSendingFeedback}
                className="border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="landing-feedback-email"
                className="text-sm font-medium text-black dark:text-white"
              >
                Email
              </Label>
              <Input
                id="landing-feedback-email"
                type="email"
                placeholder="your.email@example.com"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                disabled={isSendingFeedback}
                className="border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="landing-feedback-message"
                className="text-sm font-medium text-black dark:text-white"
              >
                Feedback
              </Label>
              <Textarea
                id="landing-feedback-message"
                placeholder="Share your thoughts, suggestions, or report issues..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                disabled={isSendingFeedback}
                className="min-h-[120px] border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black focus-visible:ring-black dark:focus-visible:ring-white"
                required
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSendingFeedback}
                className="rounded-full border-[#eaeaeb] dark:border-zinc-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSendingFeedback}
                className="rounded-full gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
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
      {/* Trail effect */}
      {isCursorActive &&
        trailPositions.map((pos, index) => (
          <motion.div
            key={pos.id}
            className="pointer-events-none absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: ((index + 1) / trailPositions.length) * 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: "64px",
              height: "64px",
              background: "rgba(0, 0, 0, 0.02)",
            }}
          />
        ))}
      <style>{`
        .dark .pointer-events-none[style*="background"] {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`${
          isScrolled ? "backdrop-blur-lg" : ""
        } fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div
            className="flex items-center gap-2 sm:gap-3"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.img
              src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
              alt="Resumae"
              className="h-7 sm:h-9 w-auto"
              variants={fadeInUp}
            />
            <motion.div className="flex flex-col" variants={fadeInUp}>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-medium  text-black dark:text-white">
                  Resumae
                </span>
                <span className="rounded bg-gray-200 dark:bg-zinc-900 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-black dark:text-white">
                  Beta
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 -mt-0.5 flex items-center gap-1">
                <span className=" sm:inline">Powered by</span>

                <img
                  src={isDarkMode ? "/redstringDark.svg" : "/redstring.png"}
                  alt="Redstring"
                  className=" w-14 md:w-16 mt-1"
                />
              </div>
            </motion.div>
          </motion.div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-900"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <div className="relative md:hidden" ref={mobileMenuRef}>
              <button
                type="button"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-900 ${
                  isMobileMenuOpen
                    ? "ring-2 ring-black/30 dark:ring-white/30"
                    : ""
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
                    className="absolute right-0 mt-3 w-64 rounded-2xl border border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black p-4 shadow-xl"
                  >
                    {" "}
                    <LoginButton className="w-full justify-center" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <LoginButton />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden pt-32 sm:pt-36 lg:pt-40  min-h-[90vh]"
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            style={{ y: parallax }}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-6xl"
          >
            <div className="grid gap-12 lg:gap-20 xl:gap-28 lg:grid-cols-2 lg:items-center">
              <div className="text-center lg:text-left">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start mb-6">
                  <a
                    href="https://www.producthunt.com/products/resumae?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-resumae"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1040757&theme=light&t=1763792376973"
                      alt="Resumae - Free resume builder | Product Hunt"
                      className="w-[200px] sm:w-[250px] h-auto"
                    />
                  </a>
                </div>

                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl md:text-7xl font-medium pb-4  bg-clip-text text-black dark:text-white"
                >
                  <span className="block">Build Your Perfect</span>
                  <span className="block">
                    <span className="text-black dark:text-white">Resume</span>
                    <div className="">in Minutes</div>
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="mt-6 text-lg text-gray-600 dark:text-gray-400 sm:text-xl"
                >
                  Create professional, ATS-friendly resumes with our intuitive
                  builder. Choose from premium templates and land your dream job
                  faster.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center lg:justify-start"
                >
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
                    className="h-14 rounded-xl bg-black dark:bg-white text-white dark:text-black px-10 text-lg shadow-xl transition-all hover:-translate-y-1 hover:bg-gray-800 dark:hover:bg-gray-200"
                  >
                    Create your first resumae{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-xl border-2 border-[#ebebeb] dark:border-[#2e2f2f] px-10 text-lg text-black dark:text-white dark:bg-black  transition-all hover:-translate-y-1 hover:bg-[#f2f2f2] dark:hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-70"
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
                style={{ perspective: "1000px" }}
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
                    filter: "drop-shadow(0 25px 50px rgba(37, 99, 235, 0.15))",
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

      {/* Arcade Embed - Product Video */}
      <section className="relative mt-8 mb-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-[#eaeaeb] dark:border-zinc-800 bg-white/30 dark:bg-black/30 backdrop-blur-xs p-2 sm:p-4 shadow-xl overflow-hidden"
          >
            <ArcadeEmbed />
          </motion.div>
        </div>
      </section>

      {/* Google Gemini Effect Section */}
      <section ref={geminiRef} className="relative h-[40vh] md:h-[70vh]">
        <div className="h-full w-full dark:border dark:border-white/[0.1] rounded-md overflow-clip">
          <GoogleGeminiEffect
            pathLengths={[
              pathLengthFirst,
              pathLengthSecond,
              pathLengthThird,
              pathLengthFourth,
              pathLengthFifth,
            ]}
            title="AI-Powered Resume Parser"
            description="Upload a PDF to auto-extract content, then refine everything conversationally—rewrite bullets, enhance summaries, boost keywords, and more."
            className=""
          />
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
                <img src={isDarkMode ? "/redstring-dark.svg" : "/redstring.png"} alt="Redstring" className="h-5 w-auto mt-1" />
              </span>
            </div>
          </motion.a>
        </div>
      </section> */}

      {/* Features */}
      <section ref={featuresRef} className="relative mt-32">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            className="space-y-10"
          >
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <span className="inline-flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/70 dark:text-white/80">
                Why people choose Resumae
              </span>
              <h2 className="text-2xl md:text-6xl font-normal pb-4  bg-clip-text text-black dark:text-white">
                Powerful features, calmer UI
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The same ATS-smart capabilities you already have, now presented
                in bold, glanceable tiles inspired by the Gemini layout.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid gap-6 md:grid-cols-2 auto-rows-[1fr]"
            >
              {featureHighlights.map(
                ({ icon: Icon, title, description, accentBg, accentColor }) => {
                  const isFullWidth = title === "AI Resume Writer";
                  return (
                    <div
                      key={title}
                      className={`group relative overflow-hidden rounded-3xl border border-black/[0.04] dark:border-white/[0.08]   bg-white  p-8 sm:p-10 min-h-[260px] transition-transform duration-500 hover:-translate-y-1 ${
                        isFullWidth ? "md:col-span-2" : ""
                      }`}
                      style={{ background: accentBg }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 30% 20%, ${accentColor}22, transparent 40%)`,
                        }}
                      />
                      <div className="relative flex flex-col h-full gap-4 sm:gap-6">
                        <div className="flex flex-col items-center gap-4">
                          <div className="flex items-center justify-center">
                            <Icon />
                          </div>
                          <h3 className="text-2xl font-semibold text-black  leading-tight text-center font-display">
                            {title}
                          </h3>
                        </div>
                        <p className="relative z-10 text-base sm:text-lg text-gray-700  leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process - Template Showcase */}
      <section ref={processRef} className="relative mt-32 overflow-hidden">
        <div className="w-full">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={processInView ? "show" : "hidden"}
            className="mx-auto max-w-3xl text-center mb-12 px-4"
          >
            <h2 className="text-lg md:text-6xl font-normal pb-4  bg-clip-text text-black dark:text-white">
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
                willChange: "transform",
              }}
            >
              {/* Render templates twice for seamless infinite loop */}
              {[...resumeTemplates, ...resumeTemplates].map(
                (template, index) => (
                  <div
                    key={`${template.id}-${index}`}
                    className="flex-shrink-0 w-[300px]"
                  >
                    <div
                      className="hover-glow rounded-2xl border-2 border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black p-4 hover:border-[#c4c4c5] dark:hover:border-white hover:-translate-y-3 hover:scale-[1.04] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer"
                      onMouseMove={updateHoverPosition}
                      onMouseLeave={resetHoverPosition}
                    >
                      <div className="relative aspect-[1/1.4] overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="h-full w-full object-cover object-top"
                          draggable="false"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-lg font-semibold text-black dark:text-white font-display">
                          {template.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        className="relative mt-32 mb-32 overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={testimonialsInView ? "show" : "hidden"}
            className="mx-auto max-w-2xl text-center mb-12"
          >
            <h2 className="text-2xl md:text-6xl font-normal pb-4  bg-clip-text text-black dark:text-white">
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
                    willChange: "transform",
                  }}
                >
                  {/* On mobile: show all testimonials, On desktop: show first 2 */}
                  {[
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                    ...(window.innerWidth < 768
                      ? testimonials
                      : testimonials.slice(0, 2)),
                  ].map((testimonial, index) => (
                    <div
                      key={`col1-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div
                        className=" rounded-xl dark:border-zinc-900 dark:border bg-white dark:bg-black p-4 hover:border hover:border-[#c4c4c5] dark:hover:border-neutral-700 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        onMouseMove={updateHoverPosition}
                        onMouseLeave={resetHoverPosition}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center text-white dark:text-black font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black dark:text-white truncate">
                              {testimonial.name}
                            </p>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                              {testimonial.role}
                            </p>
                          </div>
                          <svg
                            className="h-5 w-5 text-black/30 dark:text-white/30 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
              </div>

              {/* Column 2 - Scroll Up */}
              <div className="overflow-hidden h-[400px] w-full max-w-[280px] sm:max-w-[420px] relative hidden md:block">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    transform: `translateY(${testimonialScrollY2}px)`,
                    willChange: "transform",
                  }}
                >
                  {[
                    ...testimonials.slice(2, 4),
                    ...testimonials.slice(2, 4),
                    ...testimonials.slice(2, 4),
                    ...testimonials.slice(2, 4),
                    ...testimonials.slice(2, 4),
                    ...testimonials.slice(2, 4),
                  ].map((testimonial, index) => (
                    <div
                      key={`col2-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div
                        className="rounded-xl dark:border border-[#eaeaeb] hover:border dark:border-zinc-900 bg-white dark:bg-black p-4  hover:border-[#c4c4c5] dark:hover:border-neutral-700 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        onMouseMove={updateHoverPosition}
                        onMouseLeave={resetHoverPosition}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center text-white dark:text-black font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black dark:text-white truncate">
                              {testimonial.name}
                            </p>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                              {testimonial.role}
                            </p>
                          </div>
                          <svg
                            className="h-5 w-5 text-black/30 dark:text-white/30 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
              </div>

              {/* Column 3 - Scroll Down */}
              <div className="overflow-hidden h-[400px] w-full max-w-[280px] sm:max-w-[420px] relative hidden md:block">
                <div
                  className="flex flex-col gap-4"
                  style={{
                    transform: `translateY(${testimonialScrollY3}px)`,
                    willChange: "transform",
                  }}
                >
                  {[
                    ...testimonials.slice(4, 6),
                    ...testimonials.slice(4, 6),
                    ...testimonials.slice(4, 6),
                    ...testimonials.slice(4, 6),
                    ...testimonials.slice(4, 6),
                    ...testimonials.slice(4, 6),
                  ].map((testimonial, index) => (
                    <div
                      key={`col3-${testimonial.name}-${index}`}
                      className="flex-shrink-0"
                    >
                      <div
                        className="hover-glow rounded-xl dark:border hover:border border-[#eaeaeb] dark:border-zinc-900 bg-white dark:bg-black p-4 shadow-md hover:shadow-xl hover:border-[#c4c4c5] dark:hover:border-neutral-700 hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        onMouseMove={updateHoverPosition}
                        onMouseLeave={resetHoverPosition}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center text-white dark:text-black font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black dark:text-white truncate">
                              {testimonial.name}
                            </p>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 truncate">
                              {testimonial.role}
                            </p>
                          </div>
                          <svg
                            className="h-5 w-5 text-black/30 dark:text-white/30 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-black to-transparent z-10" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-black to-transparent z-10" />
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
            <div className="flex flex-col gap-3">
              <div className="text-lg md:text-3xl font-normal pb-4  bg-clip-text text-black dark:text-white">
                Resumae
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Transforming resume building for job seekers with right tools,
                rapid creation, and zero hassle
              </p>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex flex-wrap items-center gap-1">
                  <span>
                    Built with <span className="text-red-500">❤</span> for job
                    seekers by
                  </span>
                  <a
                    href="https://www.gowthamoleti.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white font-semibold hover:opacity-70 transition-opacity"
                  >
                    Gowtham
                  </a>
                  <span>and</span>
                  <img
                    src={isDarkMode ? "/redstringDark.svg" : "/redstring.png"}
                    alt="Redstring"
                    className="w-16 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Socials Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-black dark:text-white font-semibold text-lg font-display">
                Socials
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/redstring.connect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/redstring-invisible-thread/?viewAsMember=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  Linkedin
                </a>
                <a
                  href="https://www.youtube.com/@Redstring.connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  Youtube
                </a>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col gap-4">
              <h3 className="text-black dark:text-white font-semibold text-lg font-display">
                Info
              </h3>
              <div className="flex flex-col gap-2">
                <a
                  href="https://docs.google.com/document/d/1se7on8TdC82QbPBHmL1JnDifGbMCWxxdWFk_nyqCYQY/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://docs.google.com/document/d/1Ysptt6UfxyZoXH4SEQJJUPRAs0cHqvSTZyXIRBGSe38/edit?tab=t.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
                >
                  Terms and Condition
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#eaeaeb] dark:border-zinc-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                © 2025 Resumae. All rights reserved
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackModal(true)}
                className="rounded-full gap-1.5 border-[#eaeaeb] dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 text-xs sm:text-sm px-3 py-1.5 h-auto"
              >
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Feedback</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                Powered by
              </span>
              <a
                href="https://redstring.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
              >
                <img
                  src={isDarkMode ? "/redstringDark.svg" : "/redstring.png"}
                  alt="Redstring"
                  className="h-8 mt-1"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
