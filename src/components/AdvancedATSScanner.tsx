import { useState, useEffect } from 'react';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { ResumeData } from '@/types';
import { analyzeResumeWithGemini, GeminiATSAnalysis } from '@/services/groqService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-medium text-gray-700">Analyzing your resume with AI...</p>
        <p className="mt-2 text-sm text-gray-500">Powered by Groq Llama 3.3 70B</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</h3>
        <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
          {error || 'Unable to analyze resume. Please try again.'}
        </p>
        <Button
          onClick={handleAIAnalysis}
          className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          <TrendingUp className="h-4 w-4" />
          Retry Analysis
        </Button>
      </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Powered ATS Analysis
          </h3>
          <p className="text-sm text-gray-500">Powered by Groq Llama 3.3 70B</p>
        </div>
        <Button
          onClick={handleAIAnalysis}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Re-analyze
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-8 ${getScoreColor(analysis.overallScore)}`}>
            <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </div>
            <div className="text-xs text-gray-600">out of 100</div>
          </div>
          <div className={`mt-3 text-lg font-semibold ${getScoreColor(analysis.overallScore)}`}>
            {getScoreLabel(analysis.overallScore)}
          </div>
        </div>
      </Card>

      {/* Detailed Scores */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(analysis.detailedScores).map(([key, value]) => (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className={`text-lg font-bold ${getScoreColor(value)}`}>
                {value}
              </span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  value >= 80 ? 'bg-green-600' : value >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <Card className="p-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <Card className="p-4 border-yellow-200 bg-yellow-50/50">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">⚠</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <Card className="p-4 border-blue-200 bg-blue-50/50">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Actionable Suggestions
          </h4>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Industry Alignment */}
      {analysis.industryAlignment && (
        <Card className="p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Industry Alignment</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Detected Industry:</span>
              <span className="ml-2 font-semibold text-gray-900">{analysis.industryAlignment.detectedIndustry}</span>
              <span className="ml-2 text-sm text-gray-500">({analysis.industryAlignment.confidence}% confidence)</span>
            </div>
            {analysis.industryAlignment.relevantKeywords.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Relevant Keywords Found:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.industryAlignment.relevantKeywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.industryAlignment.missingKeywords.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Missing Important Keywords:</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {analysis.industryAlignment.missingKeywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* ATS Compatibility */}
      {analysis.atsCompatibility && (
        <Card className="p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">ATS System Compatibility</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(analysis.atsCompatibility).map(([system, score]) => (
              <div key={system} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700 capitalize">{system}</span>
                <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actionable Insights */}
      {analysis.actionableInsights.length > 0 && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            High-Priority Action Items
          </h4>
          <ul className="space-y-2">
            {analysis.actionableInsights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-purple-600 mt-0.5 font-bold">{index + 1}.</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
