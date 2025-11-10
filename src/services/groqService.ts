import Groq from 'groq-sdk';
import { ResumeData } from '@/types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn('Groq API key not found. AI-powered features will be disabled.');
}

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true }) : null;

export interface GeminiATSAnalysis {
  overallScore: number;
  detailedScores: {
    contactInfo: number;
    workExperience: number;
    education: number;
    skills: number;
    formatting: number;
    keywords: number;
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  industryAlignment: {
    detectedIndustry: string;
    confidence: number;
    relevantKeywords: string[];
    missingKeywords: string[];
  };
  atsCompatibility: {
    workday: number;
    taleo: number;
    greenhouse: number;
    lever: number;
  };
  actionableInsights: string[];
}

export async function analyzeResumeWithGemini(
  resumeData: ResumeData,
  jobTitle?: string,
  industry?: string
): Promise<GeminiATSAnalysis | null> {
  if (!groq) {
    console.warn('Groq AI not initialized');
    return null;
  }

  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. Analyze the following resume data and provide a comprehensive ATS score and actionable feedback.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

${jobTitle ? `Target Job Title: ${jobTitle}` : ''}
${industry ? `Target Industry: ${industry}` : ''}

Provide a detailed analysis in the following JSON format (respond ONLY with valid JSON, no markdown or extra text):
{
  "overallScore": <number 0-100>,
  "detailedScores": {
    "contactInfo": <number 0-100>,
    "workExperience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>,
    "keywords": <number 0-100>
  },
  "strengths": [<array of 3-5 specific strengths>],
  "weaknesses": [<array of 3-5 specific weaknesses>],
  "suggestions": [<array of 5-10 actionable suggestions>],
  "industryAlignment": {
    "detectedIndustry": "<detected industry>",
    "confidence": <number 0-100>,
    "relevantKeywords": [<array of keywords found in resume>],
    "missingKeywords": [<array of important keywords missing>]
  },
  "atsCompatibility": {
    "workday": <number 0-100>,
    "taleo": <number 0-100>,
    "greenhouse": <number 0-100>,
    "lever": <number 0-100>
  },
  "actionableInsights": [<array of 3-5 high-priority action items>]
}

Focus on:
1. ATS compatibility and keyword optimization
2. Quantifiable achievements and impact metrics
3. Action verb usage and power words
4. Industry-specific terminology
5. Formatting and structure for ATS parsing
6. Missing critical information
7. Relevance to target job/industry`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    const analysis: GeminiATSAnalysis = JSON.parse(cleanedText);
    return analysis;
  } catch (error) {
    console.error('Error analyzing resume with Groq:', error);
    return null;
  }
}

export async function getResumeSuggestions(
  resumeData: ResumeData,
  specificArea?: 'summary' | 'experience' | 'skills' | 'education'
): Promise<string[]> {
  if (!groq) {
    return [];
  }

  try {
    const areaPrompt = specificArea
      ? `Focus specifically on the ${specificArea} section.`
      : 'Provide general improvements.';

    const prompt = `As a professional resume writer, provide 5-7 specific, actionable suggestions to improve this resume. ${areaPrompt}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Respond with a JSON array of strings (respond ONLY with valid JSON array, no markdown):
["suggestion 1", "suggestion 2", ...]`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let text = completion.choices[0]?.message?.content?.trim() || '[]';

    // Clean markdown if present
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    const suggestions: string[] = JSON.parse(text);
    return suggestions;
  } catch (error) {
    console.error('Error getting suggestions from Groq:', error);
    return [];
  }
}

export async function optimizeResumeForJob(
  resumeData: ResumeData,
  jobDescription: string
): Promise<{
  matchScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
} | null> {
  if (!groq) {
    return null;
  }

  try {
    const prompt = `Compare this resume against the job description and provide optimization recommendations.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Respond with JSON only (no markdown):
{
  "matchScore": <number 0-100>,
  "matchingKeywords": [<keywords from job description found in resume>],
  "missingKeywords": [<important keywords from job description missing in resume>],
  "suggestions": [<5-8 specific suggestions to optimize resume for this job>]
}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    let text = completion.choices[0]?.message?.content?.trim() || '';

    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Error optimizing resume for job:', error);
    return null;
  }
}

export async function extractResumeFromPDF(_pdfFile: File, _retryCount = 0): Promise<ResumeData | null> {
  if (!groq) {
    console.warn('Groq AI not initialized');
    return null;
  }

  // Note: Groq's Llama models don't support vision/PDF processing yet
  // This feature requires vision-capable models
  console.warn('PDF extraction not yet supported with Groq/Llama models. Vision capabilities coming soon.');
  return null;
}
