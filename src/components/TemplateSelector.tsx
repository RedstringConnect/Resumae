import { useState } from 'react';
import { TemplateType } from '@/types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles, Briefcase, Code, FileText, Building2, Minimize2, XCircle, GraduationCap, Users, Rocket, TrendingUp, Lock, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/contexts/ReferralContext';
import toast from 'react-hot-toast';

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate: TemplateType;
  onSelectTemplate: (template: TemplateType) => void;
  onOpenRewards?: () => void;
}

interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  features: string[];
  imageUrl: string;
  recommended?: boolean;
  new?: boolean;
  premium?: boolean;
  bestFor: string[];
}

type UseCase = 'all' | 'student' | 'internship' | 'first-job' | 'senior' | 'career-change' | 'tech';

interface UseCaseOption {
  id: UseCase;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const useCaseOptions: UseCaseOption[] = [
  {
    id: 'all',
    label: 'Show All',
    icon: <Sparkles className="h-4 w-4" />,
    description: 'Browse all templates'
  },
  {
    id: 'student',
    label: 'Student / Recent Grad',
    icon: <GraduationCap className="h-4 w-4" />,
    description: 'Perfect for students and recent graduates'
  },
  {
    id: 'internship',
    label: 'Internship',
    icon: <Rocket className="h-4 w-4" />,
    description: 'Land your dream internship'
  },
  {
    id: 'first-job',
    label: 'First Job',
    icon: <Users className="h-4 w-4" />,
    description: 'Starting your career journey'
  },
  {
    id: 'senior',
    label: 'Senior / Executive',
    icon: <Building2 className="h-4 w-4" />,
    description: 'For experienced professionals'
  },
  {
    id: 'career-change',
    label: 'Career Change',
    icon: <TrendingUp className="h-4 w-4" />,
    description: 'Transitioning to a new field'
  },
  {
    id: 'tech',
    label: 'Tech / Developer',
    icon: <Code className="h-4 w-4" />,
    description: 'For technical roles'
  }
];

const templates: TemplateInfo[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with blue accents',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-purple-600',
    features: ['Blue gradient accents', 'Professional layout', 'ATS-friendly'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3f3478d101914b86a94b87e2060148a7~mv2.png',
    recommended: true,
    bestFor: ['student', 'first-job', 'internship', 'career-change']
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated sidebar layout for senior professionals',
    icon: <Building2 className="h-5 w-5" />,
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-600 to-blue-800',
    features: ['Navy sidebar', 'Executive style', 'Leadership roles'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_ede979d665e9417fa087494a38873355~mv2.png',
    premium: true,
    bestFor: ['senior', 'career-change']
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-inspired design perfect for developers',
    icon: <Code className="h-5 w-5" />,
    color: 'text-green-600',
    bgGradient: 'from-green-600 to-teal-600',
    features: ['Terminal style', 'Developer-focused', 'Tech skills'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3dbd1d9927654d0392a47bd075897d8a~mv2.png',
    premium: true,
    bestFor: ['tech', 'first-job', 'internship']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional serif font with timeless elegance',
    icon: <FileText className="h-5 w-5" />,
    color: 'text-gray-800',
    bgGradient: 'from-gray-700 to-gray-900',
    features: ['Serif font', 'Traditional', 'Timeless'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_438ecda1168249db860ce1056c283520~mv2.png',
    bestFor: ['senior', 'career-change']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate layout with structured sections',
    icon: <Briefcase className="h-5 w-5" />,
    color: 'text-slate-700',
    bgGradient: 'from-slate-600 to-slate-800',
    features: ['Corporate style', 'Structured', 'Business-ready'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_cda9004a5dd14b33bc5397fb964ec849~mv2.png',
    bestFor: ['first-job', 'senior', 'career-change']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design with maximum white space',
    icon: <Minimize2 className="h-5 w-5" />,
    color: 'text-gray-600',
    bgGradient: 'from-gray-500 to-gray-700',
    features: ['Minimalist', 'White space', 'Simple'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_3f9e69e6d61f4495a0502193c206bc8e~mv2.png',
    bestFor: ['student', 'internship', 'first-job', 'tech']
  },
  {
    id: 'ugly',
    name: 'I Don\'t Want a Job',
    description: 'Comic Sans, rainbow gradients, and pure chaos',
    icon: <XCircle className="h-5 w-5" />,
    color: 'text-red-600',
    bgGradient: 'from-red-500 to-blue-600',
    features: ['Comic Sans', 'Rainbow chaos', 'NOT ATS-friendly'],
    imageUrl: 'https://static.wixstatic.com/media/5c0589_d3e4e85075154a098fe9ed52cbbcefb6~mv2.png',
    new: true,
    bestFor: []
  },
];

export default function TemplateSelector({
  open,
  onOpenChange,
  selectedTemplate,
  onSelectTemplate,
  onOpenRewards,
}: TemplateSelectorProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>('all');
  const { user } = useAuth();
  const { isTemplateUnlocked, isPremiumTemplate } = useReferral();

  const filteredTemplates = selectedUseCase === 'all' 
    ? templates 
    : templates.filter(template => template.bestFor.includes(selectedUseCase));

  const handleTemplateClick = (template: TemplateInfo) => {
    if (template.premium && !isTemplateUnlocked(template.id)) {
      if (!user) {
        toast.error('Please sign in to unlock premium templates');
        return;
      }
      // Open rewards modal directly for premium templates
      onOpenChange(false);
      onOpenRewards?.();
      return;
    }
    
    onSelectTemplate(template.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose Your Template</DialogTitle>
          <DialogDescription>
            Select a professionally designed template that matches your style and industry
          </DialogDescription>
        </DialogHeader>

        {/* Quick Recommendations */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Recommendations</h3>
          <div className="flex flex-wrap gap-2">
            {useCaseOptions.map((useCase) => (
              <Button
                key={useCase.id}
                variant={selectedUseCase === useCase.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedUseCase(useCase.id)}
                className={cn(
                  "gap-2",
                  selectedUseCase === useCase.id && "shadow-md"
                )}
              >
                {useCase.icon}
                <span className="hidden sm:inline">{useCase.label}</span>
                <span className="sm:hidden">{useCase.label.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
          {selectedUseCase !== 'all' && (
            <p className="text-xs text-gray-500 mt-2">
              {useCaseOptions.find(u => u.id === selectedUseCase)?.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredTemplates.map((template) => {
            const isPremium = isPremiumTemplate(template.id);
            const isUnlocked = isTemplateUnlocked(template.id);
            const isLocked = isPremium && !isUnlocked;

            return (
            <button
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className={cn(
                "relative group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left",
                selectedTemplate === template.id
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-gray-200 hover:border-primary/50",
                isLocked && "opacity-90"
              )}
            >
              {/* Selected Indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {template.recommended && (
                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                    ⭐ Popular
                  </Badge>
                )}
                {isPremium && (
                  <Badge variant="secondary" className={cn(
                    "text-xs",
                    isUnlocked 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800"
                  )}>
                    {isUnlocked ? (
                      <>✓ Unlocked</>
                    ) : (
                      <><Crown className="h-3 w-3 mr-1 inline" /> Premium</>
                    )}
                  </Badge>
                )}
              </div>

              {/* Template Preview Image */}
              <div className={cn(
                "relative w-full aspect-[8.5/11] rounded-lg mb-4 shadow-lg overflow-hidden group-hover:scale-105 transition-transform bg-white border border-gray-200"
              )}>
                <img
                  src={template.imageUrl}
                  alt={`${template.name} template preview`}
                  className={cn(
                    "w-full h-full object-contain transition-all",
                    isLocked && "blur-[2px]"
                  )}
                  loading="lazy"
                />
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg mb-2">
                      <Lock className="h-6 w-6 text-gray-700" />
                    </div>
                    <p className="text-white text-sm font-medium drop-shadow-md">Invite to Unlock</p>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={template.color}>
                    {template.icon}
                  </div>
                  <h3 className="font-bold text-lg">{template.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                  {template.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className={cn(
                "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none",
                "bg-gradient-to-br from-transparent via-transparent to-primary/5"
              )} />
            </button>
          )})}
        </div>

        {/* Info Footer */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">
                All templates are ATS-friendly
              </p>
              <p className="text-blue-700">
                Every template is optimized to pass Applicant Tracking Systems while maintaining beautiful design.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

