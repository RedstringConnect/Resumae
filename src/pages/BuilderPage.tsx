import { useState, useEffect, type MouseEvent as ReactMouseEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Download,
  LayoutTemplate,
  RotateCcw,
  Save,
  Loader2,
  Sparkles,
  Check,
  User,
  Briefcase,
  GraduationCap,
  BrainCog,
  CopyPlus,
  ChevronRight,
  Moon,
  Sun,
  Maximize2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ResumeData, TemplateType } from "@/types";
import MultiStepResumeForm from "@/components/MultiStepResumeForm";
import AdvancedATSScanner from "@/components/AdvancedATSScanner";
import PDFATSUploader from "@/components/PDFATSUploader";
import TemplateSelector from "@/components/TemplateSelector";
import ResumeChatAssistant from "@/components/ResumeChatAssistant";
import { exportToPDF } from "@/utils/pdfExport";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
// Templates
import ModernTemplate from "@/components/templates/ModernTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import TechnicalTemplate from "@/components/templates/TechnicalTemplate";
import UglyTemplate from "@/components/templates/UglyTemplate";
import { useAuth } from "@/contexts/AuthContext";
import { getResumeById, createResume, updateResume } from "@/services/api";

// --- Constants & Animations ---

const GradientOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      className="absolute top-[-10%] -right-[10%] h-[50vh] w-[50vh] rounded-full bg-black/5 dark:bg-white/5 blur-[100px]"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-[-10%] -left-[10%] h-[50vh] w-[50vh] rounded-full bg-black/4 dark:bg-white/6 blur-[100px]"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

// --- Data & Types ---
const STORAGE_KEY_RESUME_DATA = "resumatic_resume_data";
const STORAGE_KEY_TEMPLATE = "resumatic_selected_template";

const emptyData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "",
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
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.dev",
    summary:
      "Results-driven Software Engineer with 5+ years of experience building scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality solutions that drive business growth and improve user experience. Passionate about clean code, system architecture, and mentoring junior developers.",
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
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "",
      current: true,
      description: [
        "Led development of microservices architecture serving 2M+ users, improving system reliability by 40% and reducing latency by 35%",
        "Architected and implemented RESTful APIs and GraphQL services using Node.js and Express, handling 10K+ requests per second",
        "Mentored team of 5 junior developers, conducting code reviews and establishing best practices that improved code quality by 50%",
        "Collaborated with product managers and designers to deliver 15+ features on time, resulting in 25% increase in user engagement",
        "Implemented CI/CD pipelines using Jenkins and Docker, reducing deployment time from 2 hours to 15 minutes",
      ],
    },
    {
      id: "2",
      company: "Digital Innovation Labs",
      position: "Full Stack Developer",
      location: "San Jose, CA",
      startDate: "Jun 2019",
      endDate: "Dec 2020",
      current: false,
      description: [
        "Built responsive web applications using React, TypeScript, and Redux, serving 500K+ monthly active users",
        "Developed backend services with Python Django and PostgreSQL, optimizing database queries to reduce response time by 60%",
        "Integrated third-party APIs including Stripe, Twilio, and AWS S3 for payment processing, notifications, and file storage",
        "Implemented automated testing using Jest and Pytest, achieving 85% code coverage and reducing bugs by 40%",
        "Participated in agile ceremonies and collaborated with cross-functional teams to deliver projects in 2-week sprints",
      ],
    },
    {
      id: "3",
      company: "StartupHub",
      position: "Junior Software Engineer",
      location: "Palo Alto, CA",
      startDate: "Jul 2018",
      endDate: "May 2019",
      current: false,
      description: [
        "Developed and maintained features for an e-commerce platform using JavaScript, HTML5, and CSS3",
        "Collaborated with senior engineers to implement new features and fix bugs in production environment",
        "Wrote technical documentation and user guides for internal tools and APIs",
        "Participated in daily standups and sprint planning meetings to ensure timely delivery of features",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.8",
    },
    {
      id: "2",
      school: "Stanford University",
      degree: "Certificate",
      field: "Machine Learning Specialization",
      location: "Stanford, CA",
      startDate: "2020",
      endDate: "2021",
      gpa: "",
    },
  ],
  skills: [
    { id: "1", name: "JavaScript", category: "Programming Languages" },
    { id: "2", name: "TypeScript", category: "Programming Languages" },
    { id: "3", name: "Python", category: "Programming Languages" },
    { id: "4", name: "Java", category: "Programming Languages" },
    { id: "5", name: "React", category: "Frontend" },
    { id: "6", name: "Vue.js", category: "Frontend" },
    { id: "7", name: "HTML5", category: "Frontend" },
    { id: "8", name: "CSS3", category: "Frontend" },
    { id: "9", name: "Tailwind CSS", category: "Frontend" },
    { id: "10", name: "Node.js", category: "Backend" },
    { id: "11", name: "Express.js", category: "Backend" },
    { id: "12", name: "Django", category: "Backend" },
    { id: "13", name: "PostgreSQL", category: "Databases" },
    { id: "14", name: "MongoDB", category: "Databases" },
    { id: "15", name: "Redis", category: "Databases" },
    { id: "16", name: "Docker", category: "DevOps" },
    { id: "17", name: "Kubernetes", category: "DevOps" },
    { id: "18", name: "AWS", category: "Cloud" },
    { id: "19", name: "Git", category: "Tools" },
    { id: "20", name: "REST APIs", category: "Tools" },
    { id: "21", name: "GraphQL", category: "Tools" },
  ],
  languages: [
    { id: "1", name: "English", proficiency: "Native" },
    { id: "2", name: "Spanish", proficiency: "Professional Working" },
    { id: "3", name: "Mandarin", proficiency: "Limited Working" },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2022",
      url: "https://aws.amazon.com/certification/",
    },
    {
      id: "2",
      name: "Professional Scrum Master I (PSM I)",
      issuer: "Scrum.org",
      date: "2021",
      url: "https://www.scrum.org/",
    },
    {
      id: "3",
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2023",
      url: "https://cloud.google.com/certification",
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce application with React, Node.js, and MongoDB, featuring user authentication, product catalog, shopping cart, and payment integration",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API", "Redux"],
      url: "https://github.com/johndoe/ecommerce",
      startDate: "2022",
      endDate: "2023",
    },
    {
      id: "2",
      name: "Real-Time Chat Application",
      description:
        "Developed a real-time chat application using WebSocket technology, supporting group chats, direct messages, file sharing, and message encryption",
      technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL", "AWS S3"],
      url: "https://github.com/johndoe/chat-app",
      startDate: "2021",
      endDate: "2022",
    },
    {
      id: "3",
      name: "Task Management Dashboard",
      description:
        "Created a Kanban-style task management tool with drag-and-drop functionality, user collaboration, and real-time updates using Firebase",
      technologies: ["React", "TypeScript", "Firebase", "Material-UI"],
      url: "https://github.com/johndoe/task-manager",
      startDate: "2020",
      endDate: "2021",
    },
  ],
};

// --- Helper Functions ---
const loadResumeData = (): ResumeData => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY_RESUME_DATA);
    return savedData ? JSON.parse(savedData) : emptyData;
  } catch (error) {
    return emptyData;
  }
};

const loadTemplate = (): TemplateType => {
  return (
    (localStorage.getItem(STORAGE_KEY_TEMPLATE) as TemplateType) || "modern"
  );
};

// --- Main Component ---
export default function BuilderPage() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get("resumeId");
  const isNewResume = searchParams.get("new") === "true";
  const isUploaded = searchParams.get("uploaded") === "true";

  // State
  const [resumeData, setResumeData] = useState<ResumeData>(
    resumeId ? emptyData : loadResumeData
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>(loadTemplate);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(
    resumeId
  );
  const [resumeTitle, setResumeTitle] = useState("");

  // UI Flags
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(!!resumeId);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [showATSModal, setShowATSModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatAssistant, setShowChatAssistant] = useState(true);
  const [activeTab, setActiveTab] = useState("builder");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [showMobileChatModal, setShowMobileChatModal] = useState(false);
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Login flow handling
  const [loginAction, setLoginAction] = useState<
    "save" | "download" | "ats" | null
  >(null);
  const [pendingActionAfterLogin, setPendingActionAfterLogin] = useState(false);

  // Form Steps
  const [currentStep, setCurrentStep] = useState(0);
  const formSteps = [
    { id: "personal", label: "Personal", icon: <User className="w-4 h-4" /> },
    {
      id: "experience",
      label: "Work",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    { id: "skills", label: "Skills", icon: <BrainCog className="w-4 h-4" /> },
    {
      id: "additional",
      label: "Extras",
      icon: <CopyPlus className="w-4 h-4" />,
    },
  ];

  // --- Effects ---

  // Scroll detection for header blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 1. Initial Data Loading
  useEffect(() => {
    if (isNewResume) {
      setResumeData(sampleData);
      setCurrentResumeId(null);
      setResumeTitle("");
      localStorage.removeItem(STORAGE_KEY_RESUME_DATA);
      toast.success("Sample resume loaded!");
    } else if (isUploaded) {
      const uploadedData = localStorage.getItem("resumatic_uploaded_data");
      if (uploadedData) {
        setResumeData(JSON.parse(uploadedData));
        setCurrentResumeId(null);
        localStorage.removeItem("resumatic_uploaded_data");
        localStorage.setItem(STORAGE_KEY_RESUME_DATA, uploadedData);
        toast.success("Uploaded resume loaded!");
      }
    } else if (resumeId) {
      const loadResume = async () => {
        try {
          setIsLoadingResume(true);
          const resume = await getResumeById(resumeId);
          setResumeData(resume.resumeData);
          setSelectedTemplate(resume.templateType);
          setCurrentResumeId(resume._id);
          setResumeTitle(resume.title);
        } catch (error) {
          toast.error("Failed to load resume");
        } finally {
          setIsLoadingResume(false);
        }
      };
      loadResume();
    }
  }, [resumeId, isNewResume, isUploaded]);

  // 2. Auto-save to LocalStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_RESUME_DATA, JSON.stringify(resumeData));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEMPLATE, selectedTemplate);
  }, [selectedTemplate]);

  // 3. Post-Login Actions
  useEffect(() => {
    if (user && pendingActionAfterLogin && loginAction) {
      setPendingActionAfterLogin(false);
      if (loginAction === "save")
        currentResumeId ? handleSaveResume() : setShowSaveDialog(true);
      else if (loginAction === "download") setShowSaveDialog(true);
      else if (loginAction === "ats") setShowATSModal(true);
      setLoginAction(null);
    }
  }, [user, pendingActionAfterLogin, loginAction, currentResumeId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // --- Handlers ---

  const handleDataChange = (data: ResumeData) => setResumeData(data);

  const handleUploadComplete = (data: ResumeData) => {
    localStorage.removeItem("resumatic_uploaded_data");
    setResumeData(data);
    setActiveTab("builder");
    toast.success("Resume loaded successfully!");
  };

  const handleExportPDF = async () => {
    if (!user) {
      setLoginAction("download");
      setShowLoginModal(true);
      return;
    }
    setIsExporting(true);
    try {
      await exportToPDF(resumeData, selectedTemplate);
      toast.success("PDF downloaded!");
      if (!currentResumeId) setShowSaveDialog(true);
    } catch (e) {
      toast.error("Export failed.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    if (confirm("Clear all data? This cannot be undone.")) {
      setResumeData(emptyData);
      setCurrentResumeId(null);
      setResumeTitle("");
      localStorage.removeItem(STORAGE_KEY_RESUME_DATA);
      toast.success("Cleared!");
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      setLoginAction("save");
      setShowLoginModal(true);
      return;
    }
    currentResumeId ? handleSaveResume() : setShowSaveDialog(true);
  };

  const handleSaveResume = async () => {
    try {
      setIsSaving(true);
      const title =
        resumeTitle || resumeData.personalInfo.fullName || "Untitled Resume";

      if (currentResumeId) {
        await updateResume(currentResumeId, {
          title,
          resumeData,
          templateType: selectedTemplate,
        });
        toast.success("Resume updated!");
      } else {
        const created = await createResume(
          user!.uid,
          user!.email!,
          title,
          resumeData,
          selectedTemplate
        );
        setCurrentResumeId(created._id);
        setResumeTitle(created.title);
        toast.success("Resume saved!");
      }
      setShowSaveDialog(false);

      // Navigate to dashboard after successful save
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (e) {
      toast.error("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginAndContinue = async () => {
    try {
      await signInWithGoogle();
      setShowLoginModal(false);
      setPendingActionAfterLogin(true);
    } catch (e) {
      toast.error("Login failed.");
    }
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

  // --- Render Helpers ---
  const getTemplateName = (t: TemplateType) => {
    const names = {
      modern: "Modern",
      classic: "Classic",
      minimal: "Minimal",
      professional: "Professional",
      executive: "Executive",
      technical: "Technical",
      ugly: "Plain",
    };
    return names[t] || "Modern";
  };

  const renderTemplate = () => {
    const props = { data: resumeData };
    switch (selectedTemplate) {
      case "classic":
        return <ClassicTemplate {...props} />;
      case "minimal":
        return <MinimalTemplate {...props} />;
      case "professional":
        return <ProfessionalTemplate {...props} />;
      case "executive":
        return <ExecutiveTemplate {...props} />;
      case "technical":
        return <TechnicalTemplate {...props} />;
      case "ugly":
        return <UglyTemplate {...props} />;
      default:
        return <ModernTemplate {...props} />;
    }
  };

  const heroBaseColor = isDarkMode ? "#050505" : "#f7f7fb";
  const heroGridLineColor = isDarkMode
    ? "rgba(255, 255, 255, 0.05)"
    : "rgba(0, 0, 0, 0.05)";

  if (isLoadingResume) {
    return (
      <div className="flex h-screen items-center justify-center dark:bg-black bg-white dark:text-gray-200 text-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin " />
          <p className="font-medium">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    // MAIN LAYOUT FIX: Fixed height screen, flex column
    <div
      className="fixed inset-0 flex flex-col text-black dark:text-white font-sans overflow-hidden"
      style={{
        backgroundColor: heroBaseColor,
        backgroundImage: `
          linear-gradient(${heroGridLineColor} 1px, transparent 1px),
          linear-gradient(90deg, ${heroGridLineColor} 1px, transparent 1px)
        `,
        backgroundSize: "72px 72px",
      }}
    >
      <GradientOrbs />

      {/* --- Header (Fixed Height) --- */}
      <header
        className={`flex-none z-50 transition-all duration-300 ${
          isScrolled ? "bg-transparent backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to={"/dashboard"}
              className="flex items-center gap-2 sm:gap-3"
            >
              <img
                src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
                alt="Resumae"
                className="h-7 sm:h-9 w-auto hidden sm:block"
              />
              <div className="flex flex-col">
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
                    className="w-12 md:w-16 mt-1"
                  />
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 dark:border-[#2c2c2d] bg-white dark:bg-black text-black dark:text-white transition hover:-translate-y-0.5 hover:bg-gray-100 dark:hover:bg-gray-900"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplateSelector(true)}
              className="gap-2 rounded-xl border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white bg-white/80 dark:bg-black/80"
            >
              <LayoutTemplate className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Templates</span>
            </Button>

            <Button
              size="sm"
              onClick={() =>
                user
                  ? setShowATSModal(true)
                  : (setLoginAction("ats"), setShowLoginModal(true))
              }
              className="gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100 border border-gray-900 dark:border-white"
            >
              <Sparkles className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">ATS Check</span>
            </Button>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveClick}
                disabled={isSaving}
                className="gap-2 rounded-xl border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white bg-white/80 dark:bg-black/80 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden md:inline">Save</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="hidden md:inline">Download</span>
            </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content Area (Fills remaining space) --- */}
      <main className="flex-1 min-h-0 relative z-10 w-full max-w-[1920px] mx-auto p-2 sm:p-4">
        {/* Mobile View Toggle */}
        <div className="lg:hidden flex justify-center pb-2">
          <div className="bg-white/90 dark:bg-black/80 rounded-full p-1 border border-gray-200 dark:border-[#2c2c2d] flex gap-1">
            <button
              onClick={() => setMobileView("editor")}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                mobileView === "editor"
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                mobileView === "preview"
                  ? "bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {activeTab === "builder" ? (
          <div
            className={`h-full grid gap-4 transition-all duration-300 ${
              showChatAssistant
                ? "lg:grid-cols-[1fr_1.4fr_22rem]"
                : "lg:grid-cols-[1fr_1.5fr]"
            }`}
          >
            {/* 1. EDITOR COLUMN */}
            <div
              className={`hover-glow flex flex-col h-[85vh] lg:h-full  bg-white/85 dark:bg-zinc-900/80 border border-dashed border-gray-200/80 dark:border-[#2c2c2d] rounded-2xl overflow-hidden ${
                mobileView === "preview" ? "hidden lg:flex" : "flex"
              }`}
              onMouseMove={updateHoverPosition}
              onMouseLeave={resetHoverPosition}
            >
              {/* Editor Header */}
              <div className="flex-none flex items-center justify-between px-4 py-3 ">
                <h2 className="font-semibold text-gray-800 dark:text-white">
                  Editor
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 w-8 p-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Steps */}
              <div className="flex-none px-2 py-2  overflow-x-auto no-scrollbar">
                <div className="flex items-center min-w-max px-2">
                  {formSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <button
                        onClick={() => setCurrentStep(idx)}
                        className={`flex flex-col items-center gap-1 min-w-[3.5rem] transition-colors ${
                          idx === currentStep
                            ? "text-black dark:text-white"
                            : idx < currentStep
                            ? "text-black dark:text-white"
                            : "text-gray-400 dark:text-zinc-500"
                        }`}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            idx === currentStep
                              ? "bg-black dark:bg-white text-white dark:text-black"
                              : idx < currentStep
                              ? "bg-black dark:bg-white text-white dark:text-black"
                              : "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                          }`}
                          animate={{
                            scale: idx === currentStep ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {idx < currentStep ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span className="text-base">{step.icon}</span>
                          )}
                        </motion.div>
                        <span className="text-[10px] font-medium">
                          {step.label}
                        </span>
                      </button>
                      {idx < formSteps.length - 1 && (
                        <div className="flex-1 h-0.5 mx-0.5 relative">
                          <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                          <motion.div
                            className="absolute inset-0 bg-black dark:bg-white origin-left rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: idx < currentStep ? 1 : 0,
                            }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scrollable Form Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <MultiStepResumeForm
                  data={resumeData}
                  onChange={handleDataChange}
                  currentStep={currentStep}
                  onStepChange={setCurrentStep}
                  totalSteps={formSteps.length}
                  onComplete={handleSaveClick}
                />
              </div>
            </div>

            {/* 2. PREVIEW COLUMN */}
            <div
              className={`hover-glow flex  flex-col h-[85vh] lg:h-full overflow-hidden bg-white/85 dark:bg-zinc-900/80 border border-dashed border-gray-200/80 dark:border-[#2c2c2d] rounded-2xl relative ${
                mobileView === "editor" ? "hidden lg:flex" : "flex"
              }`}
              onMouseMove={updateHoverPosition}
              onMouseLeave={resetHoverPosition}
            >
              <div className="flex-none rounded-2xl flex items-center justify-between px-4 py-3   z-10">
                <h2 className="font-semibold text-black dark:text-white">
                  Preview
                </h2>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium text-black dark:text-white px-2 py-1 bg-white dark:bg-zinc-900/80 rounded border border-gray-200 dark:border-[#2c2c2d]">
                    {getTemplateName(selectedTemplate)} Template
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowFullView(true)}
                    className="gap-1.5 border-gray-300 dark:border-[#2c2c2d] bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Full View</span>
                  </Button>
                </div>
              </div>

              {/* Scrollable Preview Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-gray-50/50 dark:bg-zinc-900/80">
                <div className="bg-white min-h-[297mm] max-w-[180mm] shadow-2xl mx-auto transition-transform origin-top">
                  {renderTemplate()}
                </div>
              </div>
            </div>

            {/* 3. CHAT ASSISTANT COLUMN (Desktop Only) */}
            {showChatAssistant && (
              <div
                className="hover-glow hidden lg:flex flex-col h-full bg-white dark:bg-zinc-900/80 border border-dashed border-gray-200 dark:border-[#2c2c2d] rounded-2xl overflow-hidden relative"
                onMouseMove={updateHoverPosition}
                onMouseLeave={resetHoverPosition}
              >
                <div className="flex-none p-3  flex items-center justify-between bg-white dark:bg-zinc-900/80">
                  <span className="font-semibold text-sm flex items-center gap-2 text-black dark:text-white">
                    <Sparkles className="w-4 h-4 text-gray-700 dark:text-gray-300" />{" "}
                    AI Assistant
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-xl"
                    onClick={() => setShowChatAssistant(false)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <ResumeChatAssistant
                    resumeData={resumeData}
                    onResumeUpdate={handleDataChange}
                  />
                </div>
              </div>
            )}

            {/* Chat Toggle Fab */}
            {!showChatAssistant && (
              <div className="absolute bottom-6 right-6 z-50 hidden lg:block">
                <Button
                  onClick={() => setShowChatAssistant(true)}
                  className="rounded-xl h-12 w-12 bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100 hover:scale-105 transition-transform p-0 flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6" />
                </Button>
              </div>
            )}

            {/* Mobile Chat FAB */}
            <div className="fixed bottom-24 right-4 z-50 lg:hidden">
              <Button
                onClick={() => setShowMobileChatModal(true)}
                className="rounded-full h-12 w-12 bg-black dark:bg-white text-white dark:text-black hover:bg-[#0b0b0a] dark:hover:bg-gray-100 shadow-lg p-0 flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          // Upload Tab View
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex items-center justify-center"
          >
            <div
              className="hover-glow w-full max-w-2xl bg-white dark:bg-black rounded-3xl p-8 border border-gray-200 dark:border-[#2c2c2d]"
              onMouseMove={updateHoverPosition}
              onMouseLeave={resetHoverPosition}
            >
              <PDFATSUploader onParseComplete={handleUploadComplete} />
            </div>
          </motion.div>
        )}
      </main>

      {/* --- Hidden Print Container --- */}
      <div id="resume-preview" className="fixed left-[-9999px] top-0">
        <div style={{ width: "210mm", backgroundColor: "#ffffff" }}>
          {renderTemplate()}
        </div>
      </div>

      {/* --- Modals (Keep these as they were, just organized) --- */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in Required</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-600">
            Please sign in with Google to{" "}
            {loginAction === "save" ? "save your resume" : "continue"}.
          </div>
          <Button
            onClick={handleLoginAndContinue}
            className="w-full gap-2"
            variant="outline"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Resume Title (e.g. Software Engineer)"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSaveResume();
                if (loginAction === "download") handleExportPDF();
              }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save & Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showATSModal} onOpenChange={setShowATSModal}>
        <DialogContent className="max-w-4xl bg-white/95 dark:bg-black/90 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <AdvancedATSScanner data={resumeData} />
        </DialogContent>
      </Dialog>

      {/* Mobile Chat Modal (Bottom Sheet) */}
      <AnimatePresence>
        {showMobileChatModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
              onClick={() => setShowMobileChatModal(false)}
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-black rounded-t-3xl z-[101] lg:hidden flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex-none p-4 flex items-center justify-between border-b border-gray-200 dark:border-[#2c2c2d]">
                <span className="font-semibold text-base flex items-center gap-2 text-black dark:text-white">
                  <Sparkles className="w-5 h-5" /> AI Assistant
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowMobileChatModal(false)}
                >
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </Button>
              </div>
              {/* Chat Content */}
              <div className="flex-1 overflow-hidden">
                <ResumeChatAssistant
                  resumeData={resumeData}
                  onResumeUpdate={handleDataChange}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
      />
      {/* Full View Resume Modal */}
      <Dialog open={showFullView} onOpenChange={setShowFullView}>
        <DialogContent className="max-w-[95vw] w-fit h-[90vh] p-0 bg-gray-100/95 dark:bg-black/95 backdrop-blur-sm border-none overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shrink-0">
            <h2 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
              <Maximize2 className="w-4 h-4" /> Full Preview
            </h2>
            <div className="flex items-center gap-2 pr-8">
              <Button
                size="sm"
                onClick={() => exportToPDF(resumeData, selectedTemplate)}
                className="gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center custom-scrollbar">
            <div
              className="bg-white shadow-2xl transition-transform origin-top mb-8"
              style={{
                width: "210mm",
                minHeight: "297mm",
                transform: "scale(0.85)",
                marginBottom: "-100px",
              }}
            >
              {renderTemplate()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
