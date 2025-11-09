import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginButton from '@/components/LoginButton';
import {
  Sparkles,
  LayoutTemplate,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Brain,
  Users,
  Clock3,
  CheckCircle2,
} from 'lucide-react';

const heroStats = [
  { value: '120K+', label: 'Resumes created' },
  { value: '7', label: 'Premium templates' },
  { value: '98%', label: 'Interview success' },
];

const featureHighlights = [
  {
    icon: BarChart3,
    title: 'ATS Optimized Insights',
    description: 'Real-time scoring ensures your resume passes leading applicant tracking systems without the guesswork.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy-First Design',
    description: 'Your data stays yours. Secure autosave and encrypted storage keep every detail protected.',
  },
  {
    icon: Brain,
    title: 'Guided Recommendations',
    description: 'Smart prompts help you articulate wins, metrics, and achievements with clarity and impact.',
  },
];

const experienceSteps = [
  {
    step: '01',
    title: 'Choose a template',
    description: 'Start with one of seven proven designs tailored for modern recruiters and hiring managers.',
  },
  {
    step: '02',
    title: 'Refine every section',
    description: 'Intuitive controls, live preview, and ATS feedback help you iterate quickly and confidently.',
  },
  {
    step: '03',
    title: 'Download instantly',
    description: 'Export a polished PDF in a single click, ready to share with companies and talent platforms.',
  },
];

const templateCards = [
  {
    title: 'Modern Layouts',
    description: 'Bold typography and clean structure designed for product, design, and tech roles.',
  },
  {
    title: 'Professional Suites',
    description: 'Elegant compositions crafted for leadership, finance, and consulting positions.',
  },
  {
    title: 'Creative Canvases',
    description: 'Expressive visuals that capture attention without overwhelming recruiters.',
  },
];

const testimonials = [
  {
    quote:
      '“Resumatic helped me land two interviews in the first week. The ATS tips and instant preview made it ridiculously easy.”',
    name: 'Priya Deshmukh',
    role: 'Product Manager @ Segmently',
  },
  {
    quote:
      '“I rebuilt my resume in under 30 minutes. Recruiters immediately noticed the difference in clarity and structure.”',
    name: 'Jason Wu',
    role: 'Senior Data Analyst @ Flowwave',
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
      className="absolute top-[-12rem] -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-3xl"
      animate={{
        y: [0, 40, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[-14rem] -left-24 h-[30rem] w-[30rem] rounded-full bg-purple-500/10 blur-3xl"
      animate={{
        y: [0, -50, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),rgba(255,255,255,0))]" />
  </>
);

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallax = useTransform(scrollY, [0, 400], [0, -80]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  const processRef = useRef<HTMLDivElement>(null);
  const processInView = useInView(processRef, { once: true, amount: 0.2 });

  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/40 text-gray-900">
      <GradientOrbs />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/10'
            : 'bg-white/50 backdrop-blur-md'
        } fixed top-0 left-0 right-0 z-50 border-b border-white/20 transition-all duration-300`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <motion.div className="flex items-center gap-2" variants={staggerContainer} initial="hidden" animate="show">
            <motion.img
              src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png"
              alt="Resumatic"
              className="h-9 w-auto"
              variants={fadeInUp}
            />
            <motion.span className="text-lg font-semibold tracking-tight" variants={fadeInUp}>
              Resumatic
            </motion.span>
          </motion.div>
          <div className="flex items-center gap-3">
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
            className="mx-auto flex max-w-5xl flex-col items-center text-center"
          >
            <motion.div 
              variants={fadeInUp}
              className="mb-6 sm:mb-8 flex flex-col items-center"
            >
              <img 
                src="https://static.wixstatic.com/media/5c0589_e30e6ff390554063b3ccb163b93366aa~mv2.png" 
                alt="Resumatic Logo" 
                className="h-32 sm:h-40 md:h-48 lg:h-56 w-auto animate-float-logo"
              />
              <img 
                src="https://static.wixstatic.com/media/5c0589_473db15555bf4a269b856527b650e913~mv2.png" 
                alt="Shadow" 
                className="w-32 sm:w-40 md:w-48 lg:w-56 h-auto -mt-2 sm:-mt-3 opacity-60 animate-float-shadow"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Crafted for high-impact career growth</span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="relative text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="block">Build Your Perfect</span>
              <span className="block">
                <span className="text-gray-900">Resume in </span>
                <span className="relative inline-flex flex-col items-center text-blue-600">
                  Minutes
                  <motion.span
                    className="mt-2 h-1 w-full rounded-full bg-blue-500/60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
                  />
                </span>
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl md:text-2xl"
            >
              Create professional, ATS-friendly resumes with our intuitive builder. Choose from premium templates and land your dream job faster.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link to="/builder">
                <Button size="lg" className="h-14 rounded-full bg-blue-600 px-10 text-lg shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-1 hover:bg-blue-700">
                  Start Building for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                No credit card required
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 rounded-2xl border border-blue-100/50 bg-white/80 p-6 shadow-lg shadow-blue-500/5 backdrop-blur sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-blue-600">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating preview illustration */}
        <motion.div
          className="pointer-events-none mx-auto mt-20 w-full max-w-5xl"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-500/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent)]" />
            <div className="relative grid gap-6 p-8 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-600">Real-time preview</span>
                </div>
                <div className="space-y-4 text-left text-sm text-gray-600">
                  <p>Adjust spacing, choose templates, and watch your resume update instantly.</p>
                  <p>Every tweak is reflected in milliseconds with printer-ready precision.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white p-6">
                <div className="grid gap-4 text-left text-gray-600">
                  <div className="h-3 rounded bg-gray-200/80" />
                  <div className="h-3 rounded bg-gray-200/70" />
                  <div className="h-3 rounded bg-gray-200/60" />
                  <div className="mt-6 grid gap-3">
                    <div className="h-2 rounded bg-blue-200/80" />
                    <div className="h-2 rounded bg-blue-200/70" />
                    <div className="h-2 rounded bg-blue-200/60" />
                  </div>
                  <div className="mt-6 grid gap-3">
                    <div className="h-2 rounded bg-gray-200/80" />
                    <div className="h-2 rounded bg-gray-200/70" />
                    <div className="h-2 rounded bg-gray-200/60" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="relative mt-32">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={featuresInView ? 'show' : 'hidden'}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Built to impress hiring teams
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">Everything you need to succeed</h2>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Resumatic combines beautiful design, guided strategy, and ATS intelligence so you can ship a resume that stands out in every stack.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? 'show' : 'hidden'}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {featureHighlights.map(({ icon: Icon, title, description }) => (
              <motion.div key={title} variants={fadeInUp}>
                <Card className="group h-full border border-blue-100/60 bg-white/80 shadow-xl shadow-blue-500/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
                    <CardDescription className="mt-2 text-sm text-gray-600">{description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section ref={processRef} className="relative mt-32">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={processInView ? 'show' : 'hidden'}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Guided Experience
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              A seamless journey from idea to polished resume
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={processInView ? 'show' : 'hidden'}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {experienceSteps.map((step) => (
              <motion.div key={step.title} variants={fadeInUp}>
                <div className="relative h-full rounded-2xl border border-blue-100/60 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-200">
                  <div className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section className="relative mt-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Templates
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Premium templates built for every industry</h2>
              <p className="mt-4 text-base text-gray-600">
                From modern tech to executive leadership, pick the style that mirrors the role you want. Customize headers, accents, and sections in seconds.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {templateCards.map((card) => (
                  <div key={card.title} className="rounded-2xl border border-blue-100/70 bg-white/70 p-5 text-sm text-gray-600 shadow-sm shadow-blue-500/5">
                    <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
                    <p className="mt-3 text-xs text-gray-500">{card.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                Instant preview across all templates
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-md">
                <motion.div
                  className="absolute left-6 top-10 h-72 w-48 rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-500/20"
                  initial={{ rotate: -8, opacity: 0, y: 40 }}
                  animate={{ rotate: -6, opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div className="h-full rounded-3xl bg-gradient-to-br from-blue-50 to-white p-5" />
                </motion.div>
                <motion.div
                  className="relative z-10 h-80 rounded-3xl border border-blue-100 bg-white shadow-2xl shadow-blue-500/20"
                  initial={{ rotate: 6, opacity: 0, y: 60 }}
                  animate={{ rotate: 3, opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                >
                  <div className="h-full rounded-3xl bg-gradient-to-br from-white via-blue-50 to-blue-100/60 p-6">
                    <div className="mb-4 h-4 rounded bg-blue-200/80" />
                    <div className="space-y-2">
                      <div className="h-2 rounded bg-blue-200/70" />
                      <div className="h-2 rounded bg-blue-200/60" />
                      <div className="h-2 rounded bg-blue-200/50" />
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-2 rounded bg-gray-200/70" />
                      <div className="h-2 rounded bg-gray-200/70" />
                      <div className="h-2 rounded bg-gray-200/60" />
                    </div>
                    <div className="mt-6 grid gap-2">
                      <div className="h-2 rounded bg-blue-200/70" />
                      <div className="h-2 rounded bg-blue-200/60" />
                      <div className="h-2 rounded bg-blue-200/50" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="relative mt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 p-10 text-white shadow-2xl shadow-blue-500/30"
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                  Proof
                </div>
                <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
                  Trusted by job seekers across product, design, data, and operations teams globally.
                </h2>
                <p className="mt-4 max-w-xl text-sm text-blue-100">
                  Join thousands of ambitious professionals who rely on Resumatic to build resumes that convert interviews into offers.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Users, label: 'Teams upskilled', value: '4.8/5 Avg. rating' },
                  { icon: Clock3, label: 'Faster delivery', value: '30 min to polished' },
                  { icon: LayoutTemplate, label: 'Template swaps', value: 'Unlimited variations' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <Icon className="h-5 w-5 text-white/80" />
                    <p className="mt-3 text-xs uppercase tracking-wider text-white/70">{label}</p>
                    <p className="mt-2 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="relative mt-32 mb-32">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={testimonialsInView ? 'show' : 'hidden'}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
              Community Voices
            </div>
            <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">Stories from builders who trusted Resumatic</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={testimonialsInView ? 'show' : 'hidden'}
            className="mt-10 grid gap-6 md:grid-cols-2"
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.name} variants={fadeInUp}>
                <div className="h-full rounded-3xl border border-blue-100/60 bg-white/80 p-6 text-left shadow-xl shadow-blue-500/5 backdrop-blur">
                  <p className="text-sm italic text-gray-600">{testimonial.quote}</p>
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

