import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Award, Target, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { ResumeData, ATSScore } from '../types';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ATSScannerProps {
  data: ResumeData;
}

export default function ATSScanner({ data }: ATSScannerProps) {
  const [score, setScore] = useState<ATSScore>({
    overall: 0,
    contactInfo: 0,
    workExperience: 0,
    education: 0,
    skills: 0,
    formatting: 0,
    keywords: 0,
    suggestions: [],
  });

  useEffect(() => {
    calculateATSScore();
  }, [data]);

  const calculateATSScore = () => {
    const suggestions: string[] = [];
    
    // Contact Info Score (0-100)
    let contactScore = 0;
    if (data.personalInfo.fullName) contactScore += 20;
    if (data.personalInfo.email) contactScore += 20;
    if (data.personalInfo.phone) contactScore += 20;
    if (data.personalInfo.location) contactScore += 20;
    if (data.personalInfo.linkedin || data.personalInfo.website) contactScore += 20;
    
    if (contactScore < 100) {
      suggestions.push('Add all contact information including email, phone, and location for better ATS compatibility.');
    }

    // Work Experience Score (0-100)
    let workScore = 0;
    if (data.workExperience.length > 0) {
      workScore = 40;
      const hasDescriptions = data.workExperience.some(exp => 
        exp.description.some(d => d.trim().length > 0)
      );
      if (hasDescriptions) workScore += 30;
      
      const hasDates = data.workExperience.every(exp => exp.startDate && (exp.endDate || exp.current));
      if (hasDates) workScore += 15;
      
      const hasLocations = data.workExperience.every(exp => exp.location);
      if (hasLocations) workScore += 15;
      
      // Check for action verbs and quantifiable achievements
      const descriptionText = data.workExperience
        .flatMap(exp => exp.description)
        .join(' ')
        .toLowerCase();
      
      const actionVerbs = ['led', 'managed', 'developed', 'created', 'improved', 'increased', 'reduced', 'implemented', 'designed', 'built', 'achieved', 'delivered'];
      const hasActionVerbs = actionVerbs.some(verb => descriptionText.includes(verb));
      
      if (!hasActionVerbs) {
        suggestions.push('Use strong action verbs (led, managed, developed, improved) in your work experience descriptions.');
      }
      
      const hasNumbers = /\d+/.test(descriptionText);
      if (!hasNumbers) {
        suggestions.push('Include quantifiable achievements with numbers and percentages in your experience bullets.');
      }
    } else {
      suggestions.push('Add work experience to improve your resume. Include at least 2-3 relevant positions.');
    }

    // Education Score (0-100)
    let eduScore = 0;
    if (data.education.length > 0) {
      eduScore = 50;
      const hasCompleteInfo = data.education.every(edu => 
        edu.school && edu.degree && edu.field && edu.endDate
      );
      if (hasCompleteInfo) eduScore += 50;
    } else {
      suggestions.push('Add your education information including degree, institution, and graduation date.');
    }

    // Skills Score (0-100)
    let skillsScore = 0;
    const skillCount = data.skills.length;
    if (skillCount > 0) {
      skillsScore = Math.min(100, skillCount * 10);
      
      if (skillCount < 5) {
        suggestions.push('Add more relevant skills. Aim for at least 8-12 skills relevant to your target role.');
      }
      
      const hasCategories = data.skills.some(s => s.category !== 'Technical');
      if (!hasCategories) {
        suggestions.push('Categorize your skills (Technical, Soft Skills, Languages, etc.) for better organization.');
      }
    } else {
      suggestions.push('Add skills relevant to your target position. Include both technical and soft skills.');
    }

    // Formatting Score (0-100)
    let formatScore = 100;
    const summaryLength = data.personalInfo.summary.length;
    if (summaryLength === 0) {
      formatScore -= 20;
      suggestions.push('Add a professional summary to introduce yourself and highlight key qualifications.');
    } else if (summaryLength < 100) {
      formatScore -= 10;
      suggestions.push('Expand your professional summary to 2-3 sentences (150-200 words) for better impact.');
    }

    // Keywords Score (0-100)
    let keywordScore = 70; // Base score
    const allText = [
      data.personalInfo.summary,
      ...data.workExperience.flatMap(exp => exp.description),
      ...data.skills.map(s => s.name),
    ].join(' ').toLowerCase();

    // Check for common professional keywords
    const professionalKeywords = ['team', 'project', 'manage', 'develop', 'lead', 'collaborate', 'analyze', 'design', 'implement'];
    const keywordCount = professionalKeywords.filter(kw => allText.includes(kw)).length;
    keywordScore = Math.min(100, 60 + (keywordCount * 4));

    if (keywordScore < 80) {
      suggestions.push('Include more industry-specific keywords and action-oriented language throughout your resume.');
    }

    // Calculate overall score
    const overall = Math.round(
      (contactScore * 0.15) +
      (workScore * 0.35) +
      (eduScore * 0.15) +
      (skillsScore * 0.15) +
      (formatScore * 0.10) +
      (keywordScore * 0.10)
    );

    // Add general suggestions based on overall score
    if (overall >= 90) {
      suggestions.unshift('Excellent! Your resume is highly ATS-compatible. Make final reviews and you\'re ready to apply.');
    } else if (overall >= 75) {
      suggestions.unshift('Good! Your resume is ATS-friendly. Address the suggestions below for optimization.');
    } else if (overall >= 60) {
      suggestions.unshift('Your resume needs improvement. Focus on the key areas highlighted below.');
    } else {
      suggestions.unshift('Critical: Your resume needs significant work to pass ATS screening. Address all suggestions.');
    }

    setScore({
      overall,
      contactInfo: contactScore,
      workExperience: workScore,
      education: eduScore,
      skills: skillsScore,
      formatting: formatScore,
      keywords: keywordScore,
      suggestions,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">ATS Score Analysis</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Compatibility Check</span>
        </div>
      </div>
      
      {/* Overall Score Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center py-8"
      >
        <div className="relative">
          <svg className="w-44 h-44 transform -rotate-90">
            <defs>
              <linearGradient id="score-gradient-basic" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score.overall >= 80 ? '#22c55e' : score.overall >= 60 ? '#eab308' : '#ef4444'} />
                <stop offset="100%" stopColor={score.overall >= 80 ? '#16a34a' : score.overall >= 60 ? '#ca8a04' : '#dc2626'} />
              </linearGradient>
            </defs>
            <circle
              cx="88"
              cy="88"
              r="80"
              stroke="#e5e7eb"
              strokeWidth="14"
              fill="none"
            />
            <motion.circle
              cx="88"
              cy="88"
              r="80"
              stroke="url(#score-gradient-basic)"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: '502', strokeDashoffset: '502' }}
              animate={{ strokeDashoffset: 502 - (502 * score.overall) / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ strokeDasharray: '502' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-6xl font-bold"
              style={{ color: getScoreColor(score.overall) }}
            >
              {score.overall}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-2 font-medium">out of 100</div>
          </div>
        </div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 flex items-center gap-2"
        >
          {score.overall >= 80 && <Award className="h-6 w-6" style={{ color: getScoreColor(score.overall) }} />}
          <span className="text-2xl font-bold" style={{ color: getScoreColor(score.overall) }}>
            {getScoreLabel(score.overall)}
          </span>
        </motion.div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Contact Info', value: score.contactInfo, icon: Target },
          { label: 'Experience', value: score.workExperience, icon: Award },
          { label: 'Education', value: score.education, icon: CheckCircle2 },
          { label: 'Skills', value: score.skills, icon: Zap },
          { label: 'Formatting', value: score.formatting, icon: Shield },
          { label: 'Keywords', value: score.keywords, icon: TrendingUp },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-blue-200 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      metric.value >= 80 ? 'bg-green-100' : metric.value >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        metric.value >= 80 ? 'text-green-600' : metric.value >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                  </div>
                  <span className="text-xl font-bold tabular-nums" style={{ color: getScoreColor(metric.value) }}>
                    {metric.value}
                  </span>
                </div>
                <div className="relative h-2.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getScoreColor(metric.value) }}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <div className="p-2 rounded-lg bg-blue-100">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <span>Suggestions</span>
          <span className="ml-2 text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{score.suggestions.length}</span>
        </h3>
        <div className="space-y-3">
          {score.suggestions.map((suggestion, index) => {
            const isHighPriority = index === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
              >
                <Card className={`p-4 border-l-4 transition-all hover:shadow-md ${
                  isHighPriority 
                    ? 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-blue-50' 
                    : 'border-l-blue-500 bg-white hover:bg-blue-50/50'
                }`}>
                  {isHighPriority && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                      <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Priority</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-gray-700">{suggestion}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
