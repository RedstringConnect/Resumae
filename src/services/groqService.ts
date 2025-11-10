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

export async function extractResumeFromPDF(pdfFile: File, retryCount = 0): Promise<ResumeData | null> {
  if (!groq) {
    console.warn('Groq AI not initialized');
    return null;
  }

  try {
    console.log('Starting PDF extraction for:', pdfFile.name);
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    
    console.log('File size:', arrayBuffer.byteLength, 'bytes');
    
    // Dynamically import pdfjs-dist (browser-compatible)
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source to use unpkg CDN with correct version
    const pdfjsVersion = pdfjsLib.version || '4.0.379';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
    
    console.log('PDF.js loaded, parsing document...');
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log('PDF loaded, pages:', pdf.numPages);
    
    // Extract text from all pages
    let extractedText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      extractedText += pageText + '\n\n';
    }

    console.log('Text extracted, length:', extractedText?.length || 0);

    if (!extractedText || extractedText.trim().length < 50) {
      console.error('Insufficient text extracted from PDF');
      throw new Error('Could not extract enough text from PDF. The file might be image-based or corrupted.');
    }

    console.log('Extracted text preview:', extractedText.substring(0, 200));

    // Send extracted text to Llama for structured extraction
    const prompt = `You are an expert resume parser. Extract and structure the following resume text into a JSON format.

Resume Text:
${extractedText}

Extract and return ONLY valid JSON in this exact structure (no markdown, no extra text):
{
  "personalInfo": {
    "fullName": "<full name>",
    "email": "<email>",
    "phone": "<phone>",
    "location": "<location>",
    "linkedin": "<linkedin URL if present>",
    "website": "<website/portfolio URL if present>",
    "summary": "<professional summary or objective>"
  },
  "workExperience": [
    {
      "company": "<company name>",
      "position": "<job title>",
      "location": "<location>",
      "startDate": "<start date>",
      "endDate": "<end date or 'Present'>",
      "description": ["<achievement or responsibility 1>", "<achievement or responsibility 2>", "..."]
    }
  ],
  "education": [
    {
      "institution": "<school/university name>",
      "degree": "<degree type and major>",
      "location": "<location>",
      "graduationDate": "<graduation date>",
      "gpa": "<GPA if mentioned>"
    }
  ],
  "skills": ["<skill1>", "<skill2>", ...],
  "certifications": [
    {
      "name": "<certification name>",
      "issuer": "<issuing organization>",
      "date": "<date obtained>"
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<brief project description>",
      "technologies": ["<tech1>", "<tech2>", "<tech3>"],
      "link": "<project link if available>"
    }
  ],
  "languages": [
    {
      "language": "<language name>",
      "proficiency": "<proficiency level>"
    }
  ]
}

Important:
- Extract all information accurately from the resume text
- Use empty arrays [] if sections are not found
- Use empty strings "" for missing fields
- For workExperience.description: ALWAYS return an array of strings (bullet points)
- For projects.description: Return a single string summary
- For projects.technologies: ALWAYS return an array of technology names
- Split lengthy descriptions into multiple bullet points
- Ensure valid JSON format
- Include default spacing values`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more accurate extraction
      max_tokens: 3000,
    });

    let responseText = completion.choices[0]?.message?.content?.trim() || '';

    // Clean markdown code blocks if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(responseText);

    // Add default spacing if not present
    const resumeData: ResumeData = {
      ...parsedData,
      spacing: {
        pageMargin: 20,
        sectionSpacing: 8,
        lineSpacing: 1.2,
        bulletSpacing: 4,
        headerSpacing: 6,
      },
    };

    return resumeData;
  } catch (error: any) {
    console.error('Error extracting resume from PDF:', error);
    
    // Retry logic
    if (retryCount < 2) {
      console.log(`Retrying PDF extraction (attempt ${retryCount + 2}/3)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return extractResumeFromPDF(pdfFile, retryCount + 1);
    }
    
    return null;
  }
}
