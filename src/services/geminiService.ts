import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from '@/types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. AI-powered features will be disabled.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

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
  if (!genAI) {
    console.warn('Gemini AI not initialized');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

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
    console.error('Error analyzing resume with Gemini:', error);
    return null;
  }
}

export async function getResumeSuggestions(
  resumeData: ResumeData,
  specificArea?: 'summary' | 'experience' | 'skills' | 'education'
): Promise<string[]> {
  if (!genAI) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const areaPrompt = specificArea
      ? `Focus specifically on the ${specificArea} section.`
      : 'Provide general improvements.';

    const prompt = `As a professional resume writer, provide 5-7 specific, actionable suggestions to improve this resume. ${areaPrompt}

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Respond with a JSON array of strings (respond ONLY with valid JSON array, no markdown):
["suggestion 1", "suggestion 2", ...]`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    // Clean markdown if present
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    const suggestions: string[] = JSON.parse(text);
    return suggestions;
  } catch (error) {
    console.error('Error getting suggestions from Gemini:', error);
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
  if (!genAI) {
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

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

export async function extractResumeFromPDF(pdfFile: File, retryCount = 0): Promise<ResumeData | null> {
  if (!genAI) {
    console.warn('Gemini AI not initialized');
    return null;
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Convert PDF to base64
    const base64Data = await fileToBase64(pdfFile);

    const prompt = `Extract all information from this resume PDF and structure it in the following JSON format. Be thorough and extract ALL information present in the resume.

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "personalInfo": {
    "fullName": "<full name>",
    "email": "<email>",
    "phone": "<phone>",
    "location": "<location/city>",
    "linkedin": "<linkedin URL if present>",
    "website": "<personal website/portfolio if present>",
    "summary": "<professional summary or objective>"
  },
  "spacing": {
    "pageMargin": 20,
    "sectionSpacing": 8,
    "lineSpacing": 1.2,
    "bulletSpacing": 4,
    "headerSpacing": 6
  },
  "workExperience": [
    {
      "company": "<company name>",
      "position": "<job title>",
      "location": "<location>",
      "startDate": "<start date>",
      "endDate": "<end date or empty if current>",
      "current": <true if currently working, false otherwise>,
      "description": ["<bullet point 1>", "<bullet point 2>", ...]
    }
  ],
  "education": [
    {
      "school": "<institution name>",
      "degree": "<degree type>",
      "field": "<field of study>",
      "location": "<location>",
      "startDate": "<start date>",
      "endDate": "<graduation date>",
      "gpa": "<GPA if mentioned>",
      "description": ["<achievement 1>", "<achievement 2>", ...]
    }
  ],
  "skills": [
    {
      "name": "<skill name>",
      "category": "<Technical/Soft Skills/Languages/Tools>",
      "level": "<Beginner/Intermediate/Advanced/Expert>"
    }
  ],
  "languages": [
    {
      "name": "<language>",
      "proficiency": "<Native/Fluent/Professional/Basic>"
    }
  ],
  "certifications": [
    {
      "name": "<certification name>",
      "issuer": "<issuing organization>",
      "date": "<date obtained>",
      "expiryDate": "<expiry date if applicable>",
      "credentialId": "<credential ID if present>"
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<project description>",
      "technologies": ["<tech 1>", "<tech 2>", ...],
      "link": "<project link if present>",
      "startDate": "<start date>",
      "endDate": "<end date>"
    }
  ]
}

Important:
- Extract ALL information from the resume
- If a field is not present in the resume, use empty string "" or empty array []
- For dates, use the format as written in the resume
- For skills, categorize them appropriately
- Include all bullet points and descriptions
- Be accurate and preserve the original information`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: pdfFile.type,
          data: base64Data,
        },
      },
      { text: prompt },
    ]);

    const response = result.response;
    let text = response.text().trim();

    // Clean markdown code blocks if present
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }

    const extractedData: ResumeData = JSON.parse(text);
    return extractedData;
  } catch (error: any) {
    console.error('Error extracting resume from PDF:', error);
    
    // Check if it's a rate limit error (429)
    if (error?.message?.includes('429') || error?.message?.includes('Resource exhausted')) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Rate limit hit. Retrying in ${RETRY_DELAY}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        
        // Retry the request
        return extractResumeFromPDF(pdfFile, retryCount + 1);
      } else {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
    }
    
    return null;
  }
}

// Helper function to convert file to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

