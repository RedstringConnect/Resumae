import Groq from "groq-sdk";
import { ResumeData } from "@/types";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("Groq API key not found. Chat features will be disabled.");
}

const groq = GROQ_API_KEY
  ? new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true })
  : null;

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ResumeUpdate {
  success: boolean;
  message: string;
  updatedData?: ResumeData;
  changes?: string[];
}

// Normalize AI response to match expected field names
function normalizeResumeData(data: any): ResumeData {
  return {
    personalInfo: data.personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    spacing: data.spacing || {
      pageMargin: 20,
      sectionSpacing: 8,
      lineSpacing: 1.2,
      bulletSpacing: 4,
      headerSpacing: 6,
    },
    workExperience: (data.workExperience || []).map((exp: any) => ({
      id: String(exp.id || Date.now() + Math.random()),
      company: exp.company || "",
      position: exp.position || exp.title || "",
      location: exp.location || "",
      startDate: exp.startDate || parseDates(exp.dates)?.start || "",
      endDate: exp.endDate || parseDates(exp.dates)?.end || "",
      current: exp.current || false,
      description: Array.isArray(exp.description)
        ? exp.description
        : exp.description
        ? [exp.description]
        : [""],
    })),
    education: (data.education || []).map((edu: any) => ({
      id: String(edu.id || Date.now() + Math.random()),
      school: edu.school || edu.institution || edu.university || "",
      degree: edu.degree || "",
      field: edu.field || edu.major || "",
      location: edu.location || "",
      startDate: edu.startDate || parseDates(edu.dates)?.start || "",
      endDate: edu.endDate || parseDates(edu.dates)?.end || "",
      current: edu.current || false,
      gpa: edu.gpa || "",
      percentage: edu.percentage || "",
    })),
    skills: (data.skills || []).map((skill: any) => ({
      id: String(skill.id || Date.now() + Math.random()),
      name: skill.name || skill.skill || "",
      category: skill.category || "Technical",
    })),
    languages: (data.languages || []).map((lang: any) => ({
      id: String(lang.id || Date.now() + Math.random()),
      name: lang.name || lang.language || "",
      proficiency: lang.proficiency || "Professional",
    })),
    certifications: (data.certifications || []).map((cert: any) => ({
      id: String(cert.id || Date.now() + Math.random()),
      name: cert.name || cert.certification || cert.title || "",
      issuer: cert.issuer || cert.organization || "",
      date: cert.date || "",
      url: cert.url || "",
    })),
    projects: (data.projects || []).map((proj: any) => ({
      id: String(proj.id || Date.now() + Math.random()),
      name: proj.name || proj.project || proj.title || "",
      description: proj.description || "",
      technologies: Array.isArray(proj.technologies)
        ? proj.technologies
        : proj.technology
        ? [proj.technology]
        : proj.tech
        ? [proj.tech]
        : [],
      url: proj.url || proj.link || "",
      date: proj.date || parseDates(proj.dates)?.start || "",
    })),
  };
}

// Helper to parse date ranges like "2004-2008" or "Jan 2020 to Dec 2022"
function parseDates(dateStr: string | undefined): { start: string; end: string } | null {
  if (!dateStr) return null;
  
  // Handle "2004-2008" format
  const yearMatch = dateStr.match(/(\d{4})\s*[-–to]+\s*(\d{4})/i);
  if (yearMatch) {
    return { start: yearMatch[1], end: yearMatch[2] };
  }
  
  // Handle "Jan 2020 to Dec 2022" format
  const monthYearMatch = dateStr.match(/([A-Za-z]+\s+\d{4})\s*[-–to]+\s*([A-Za-z]+\s+\d{4})/i);
  if (monthYearMatch) {
    return { start: monthYearMatch[1], end: monthYearMatch[2] };
  }
  
  return null;
}

export async function processResumeChat(
  userMessage: string,
  currentResumeData: ResumeData
): Promise<ResumeUpdate> {
  if (!groq) {
    return {
      success: false,
      message:
        "AI service not available. Please check your API key configuration.",
    };
  }

  try {
    const prompt = `You are a resume assistant. The user wants to update their resume data based on their message.

Current Resume Data (JSON):
${JSON.stringify(currentResumeData, null, 2)}

User Message: "${userMessage}"

Your task:
1. Understand what the user wants to add/update/remove from their resume
2. Parse the information from their message
3. Update the appropriate section(s) of the resume data
4. Return ONLY a valid JSON object in this exact format:

{
  "success": true,
  "message": "A friendly confirmation message about what was updated",
  "changes": ["List of changes made"],
  "updatedData": { /* The complete updated resume data object */ }
}

Examples of what to handle:
- "I did my btech from XYZ College from 2004-2008" -> Update education section
- "Add Python and JavaScript to my skills" -> Add to skills
- "I worked at Google as Software Engineer from Jan 2020 to Dec 2022" -> Add work experience
- "Remove my certification from AWS" -> Remove specific certification
- "Change my email to newemail@example.com" -> Update personal info
- "Add a project called E-commerce Website built with React" -> Add project

Important rules:
- Keep ALL existing data unless explicitly asked to remove or change it
- Add new items to arrays (workExperience, education, skills, etc.) with proper IDs (use timestamp-based IDs)
- For date ranges, parse formats like "2004-2008", "Jan 2020 to Dec 2022", etc.
- Infer reasonable defaults when information is partial
- If the request is unclear, set success to false and ask for clarification in the message

Return ONLY the JSON object, no markdown formatting, no explanations outside the JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "";

    console.log("Groq Response:", responseText);

    // Clean up the response - remove markdown code blocks if present
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.substring(7);
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.substring(3);
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.substring(
        0,
        cleanedResponse.length - 3
      );
    }
    cleanedResponse = cleanedResponse.trim();

    console.log("Cleaned Response:", cleanedResponse);

    const parsedResponse = JSON.parse(cleanedResponse);

    if (parsedResponse.success && parsedResponse.updatedData) {
      // Normalize the AI response to match expected field names
      const normalizedData = normalizeResumeData(parsedResponse.updatedData);
      
      return {
        success: true,
        message: parsedResponse.message || "Resume updated successfully!",
        updatedData: normalizedData,
        changes: parsedResponse.changes || [],
      };
    } else {
      return {
        success: false,
        message:
          parsedResponse.message ||
          "Could not understand your request. Please try again.",
      };
    }
  } catch (error: any) {
    console.error("Error processing chat message:", error);
    console.error("Error details:", error.message || error);
    return {
      success: false,
      message:
        error.message ||
        "Sorry, I had trouble understanding that. Could you please rephrase?",
    };
  }
}

export async function getChatSuggestions(
  resumeData: ResumeData
): Promise<string[]> {
  const suggestions: string[] = [];

  if (!resumeData.personalInfo.fullName) {
    suggestions.push("Add your full name");
  }
  if (!resumeData.personalInfo.email) {
    suggestions.push("Add your email address");
  }
  if (resumeData.workExperience.length === 0) {
    suggestions.push("Add your work experience");
  }
  if (resumeData.education.length === 0) {
    suggestions.push("Add your education details");
  }
  if (resumeData.skills.length === 0) {
    suggestions.push("Add your skills");
  }
  if (!resumeData.personalInfo.summary) {
    suggestions.push("Add a professional summary");
  }

  return suggestions;
}
