import { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Target, Award, Zap, Shield, Brain, Lightbulb } from 'lucide-react';
import { ResumeData } from '@/types';
import { analyzeResumeWithGemini, GeminiATSAnalysis } from '@/services/groqService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedATSScannerProps {
  data: ResumeData;
}

export default function AdvancedATSScanner({ data }: AdvancedATSScannerProps) {
  const [analysis, setAnalysis] = useState<GeminiATSAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleAIAnalysis();
  }, [data]);

  const handleAIAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeResumeWithGemini(data);
      if (result) {
        setAnalysis(result);
      } else {
        setError('AI analysis failed. Please check your Groq API key and try again.');
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      setError('Failed to analyze resume with AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 blur-2xl opacity-20 animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
            <Loader2 className="h-12 w-12 animate-spin text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-2"
        >
          <p className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Analyzing your resume with AI</p>
          <p className="text-sm text-gray-500 flex items-center gap-2 justify-center">
            <Brain className="h-4 w-4 text-purple-500" />
            Powered by Groq Llama 3.1 8B
          </p>
          <div className="flex gap-1 justify-center pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h3>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-md leading-relaxed">
          {error || 'Unable to analyze resume. Please try again.'}
        </p>
        <Button
          onClick={handleAIAnalysis}
          className="gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
        >
          <TrendingUp className="h-4 w-4" />
          Retry Analysis
        </Button>
      </motion.div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-600';
    if (score >= 60) return 'text-yellow-600 border-yellow-600';
    return 'text-red-600 border-red-600';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-6 w-6 text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text" style={{ fill: 'url(#sparkle-gradient)' }} />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent">AI-Powered ATS Analysis</span>
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Brain className="h-3.5 w-3.5 text-purple-500" />
            Powered by Groq Llama 3.1 8B
          </p>
        </div>
        <Button
          onClick={handleAIAnalysis}
          variant="outline"
          size="sm"
          className="gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all group"
        >
          <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
          Re-analyze
        </Button>
      </div>

      {/* Overall Score */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border-2 border-purple-200/50 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5" />
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1, delay: 0.2 }}
              className="relative"
            >
              <svg className="w-40 h-40 transform -rotate-90">
                <defs>
                  <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={analysis.overallScore >= 80 ? '#22c55e' : analysis.overallScore >= 60 ? '#eab308' : '#ef4444'} />
                    <stop offset="100%" stopColor={analysis.overallScore >= 80 ? '#16a34a' : analysis.overallScore >= 60 ? '#ca8a04' : '#dc2626'} />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#score-gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '440', strokeDashoffset: '440' }}
                  animate={{ strokeDashoffset: 440 - (440 * analysis.overallScore) / 100 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                  style={{ strokeDasharray: '440' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: 'spring' }}
                  className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}
                >
                  {analysis.overallScore}
                </motion.div>
                <div className="text-xs text-gray-500 mt-1 font-medium">out of 100</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className={`mt-4 text-xl font-bold ${getScoreColor(analysis.overallScore)} flex items-center gap-2`}
            >
              {analysis.overallScore >= 80 && <Award className="h-5 w-5" />}
              {getScoreLabel(analysis.overallScore)}
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(analysis.detailedScores).map(([key, value], index) => {
          const icons: Record<string, any> = {
            contentQuality: Target,
            keywordOptimization: Zap,
            formatting: Shield,
            experienceRelevance: Award,
            skillsAlignment: CheckCircle2,
            education: Brain
          };
          const Icon = icons[key] || Target;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-purple-200 bg-white/80 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      value >= 80 ? 'bg-green-100' : value >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className={`text-xl font-bold ${getScoreColor(value)} tabular-nums`}>
                    {value}
                  </span>
                </div>
                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      value >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      value >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">Strengths</span>
              <span className="ml-auto text-xs font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-full">{analysis.strengths.length}</span>
            </h4>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="text-sm text-gray-700 flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 font-bold text-xs mt-0.5">✓</span>
                  <span className="flex-1 leading-relaxed">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-5 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-100">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <span className="bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">Areas for Improvement</span>
              <span className="ml-auto text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full">{analysis.weaknesses.length}</span>
            </h4>
            <ul className="space-y-3">
              {analysis.weaknesses.map((weakness, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="text-sm text-gray-700 flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 font-bold text-xs mt-0.5">⚠</span>
                  <span className="flex-1 leading-relaxed">{weakness}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Lightbulb className="h-5 w-5 text-blue-600" />
              </div>
              <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Actionable Suggestions</span>
              <span className="ml-auto text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{analysis.suggestions.length}</span>
            </h4>
            <ul className="space-y-3">
              {analysis.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="text-sm text-gray-700 flex items-start gap-3 p-3 rounded-lg hover:bg-white/70 transition-colors border border-transparent hover:border-blue-200"
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-bold text-xs mt-0.5">→</span>
                  <span className="flex-1 leading-relaxed">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Industry Alignment */}
      {analysis.industryAlignment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-5 bg-white border-gray-200 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <span>Industry Alignment</span>
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Detected Industry</span>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{analysis.industryAlignment.detectedIndustry}</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-purple-200">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-semibold text-purple-700">{analysis.industryAlignment.confidence}% confidence</span>
                  </div>
                </div>
              </div>
              {analysis.industryAlignment.relevantKeywords.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Relevant Keywords Found</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{analysis.industryAlignment.relevantKeywords.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.industryAlignment.relevantKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.03 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-medium rounded-full border border-green-200 hover:shadow-md transition-shadow"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
              {analysis.industryAlignment.missingKeywords.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-gray-700">Missing Important Keywords</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{analysis.industryAlignment.missingKeywords.length}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.industryAlignment.missingKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.03 }}
                        className="px-3 py-1.5 bg-gradient-to-r from-red-100 to-rose-100 text-red-800 text-xs font-medium rounded-full border border-red-200 hover:shadow-md transition-shadow"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ATS Compatibility */}
      {analysis.atsCompatibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-5 bg-white border-gray-200 shadow-lg">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <span>ATS System Compatibility</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(analysis.atsCompatibility).map(([system, score], index) => (
                <motion.div
                  key={system}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <span className="text-sm font-semibold text-gray-700 capitalize">{system}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 1 + index * 0.05, duration: 0.5 }}
                        className={`h-full ${
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(score)} min-w-[3rem] text-right`}>{score}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Actionable Insights */}
      {analysis.actionableInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-5 bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50 border-2 border-purple-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
            <div className="relative">
              <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-fuchsia-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <span className="bg-gradient-to-r from-purple-700 to-fuchsia-700 bg-clip-text text-transparent">High-Priority Action Items</span>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full">{analysis.actionableInsights.length}</span>
              </h4>
              <ul className="space-y-3">
                {analysis.actionableInsights.map((insight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="text-sm text-gray-700 flex items-start gap-3 p-3 rounded-xl bg-white/70 backdrop-blur border border-purple-200/50 hover:bg-white hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white font-bold text-xs shadow-lg">{index + 1}</span>
                    <span className="flex-1 leading-relaxed font-medium">{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
