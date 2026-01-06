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
    skills: (() => {
      const skillsData = data.skills || [];

      // If skills is an object with categories (like {Technical: [...], Design: [...]})
      if (typeof skillsData === "object" && !Array.isArray(skillsData)) {
        const skillsArray: any[] = [];
        Object.entries(skillsData).forEach(
          ([category, skills]: [string, any]) => {
            if (Array.isArray(skills) && skills.length > 0) {
              skillsArray.push({
                id: `${Date.now()}-${Math.random()}-${category}`,
                name: skills.join(", "),
                category: category,
              });
            }
          }
        );
        return skillsArray;
      }

      // If skills is already an array
      if (Array.isArray(skillsData)) {
        return skillsData.map((skill: any) => ({
          id: String(skill.id || Date.now() + Math.random()),
          name: skill.name || skill.skill || "",
          category: skill.category || "Technical",
        }));
      }

      return [];
    })(),
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
function parseDates(
  dateStr: string | undefined
): { start: string; end: string } | null {
  if (!dateStr) return null;

  // Handle "2004-2008" format
  const yearMatch = dateStr.match(/(\d{4})\s*[-–to]+\s*(\d{4})/i);
  if (yearMatch) {
    return { start: yearMatch[1], end: yearMatch[2] };
  }

  // Handle "Jan 2020 to Dec 2022" format
  const monthYearMatch = dateStr.match(
    /([A-Za-z]+\s+\d{4})\s*[-–to]+\s*([A-Za-z]+\s+\d{4})/i
  );
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

  // Dynamic suggestions based on resume state
  if (!resumeData.personalInfo.fullName) {
    suggestions.push("Add your full name");
  }
  if (!resumeData.personalInfo.email) {
    suggestions.push("Add your email address");
  }
  if (resumeData.workExperience.length === 0) {
    suggestions.push("Add your work experience");
  } else {
    suggestions.push("Improve my work experience descriptions");
  }

  if (resumeData.education.length === 0) {
    suggestions.push("Add your education details");
  }

  if (resumeData.skills.length === 0) {
    suggestions.push("Add your skills");
  } else if (resumeData.skills.length < 10) {
    suggestions.push("Suggest more relevant skills");
  }

  if (!resumeData.personalInfo.summary) {
    suggestions.push("Add a professional summary");
  } else {
    suggestions.push("Improve my professional summary");
  }

  // Always show these helpful suggestions
  if (suggestions.length < 3) {
    suggestions.push("Make my resume more ATS-friendly");
    suggestions.push("Add action verbs to my descriptions");
    suggestions.push("Quantify my achievements");
  }

  return suggestions.slice(0, 3);
}

export async function tailorResumeToJobDescription(
  jobDescription: string,
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
    const prompt = `You are an expert resume writer and ATS optimization specialist. Your task is to comprehensively tailor the user's resume to match the provided job description, making substantial updates while maintaining truthfulness.

Current Resume Data (JSON):
${JSON.stringify(currentResumeData, null, 2)}

Job Description:
${jobDescription}

Your task is to COMPLETELY REWRITE the resume to perfectly match this job description:

1. **Professional Summary**: Write a NEW compelling summary (2-3 sentences) that directly addresses the job requirements and highlights the most relevant skills and experiences for THIS specific role.

2. **Work Experience**: 
   - Completely rewrite ALL bullet points to emphasize achievements and responsibilities that match the job description
   - Use specific keywords and terminology from the job description
   - Add quantifiable metrics where possible (%, numbers, scale)
   - Focus on relevant accomplishments that demonstrate the required skills
   - Use strong action verbs from the job posting
   - Each bullet should be 1-2 lines and demonstrate impact

3. **Skills**: 
   - Reorganize and prioritize skills to match the "Required Skills" and "Good to Have" sections
   - Add any missing relevant skills from the job description that the candidate would reasonably have
   - Group skills by category (Technical, Design Tools, Frontend, etc.) as mentioned in the job
   - Put the most important skills for this role first

4. **Projects/Portfolio** (if applicable):
   - Highlight or add projects that demonstrate the required skills
   - Ensure project descriptions use terminology from the job description

5. **Overall Optimization**:
   - Ensure heavy use of keywords from the job description throughout
   - Match the tone and language style of the job posting
   - Make the resume feel like it was written specifically for this exact position
   - Focus on the experience level mentioned (e.g., 0-3 years for freshers)

IMPORTANT RULES:
- Return ONLY valid JSON with "resumeData" and "explanation"
- Be AGGRESSIVE in rewriting - this should look like a completely tailored resume
- Keep company names, job titles, dates, and education credentials unchanged
- You CAN add new skills if they're reasonably related to existing experience
- You CAN completely rewrite experience descriptions to be more relevant
- Every section should scream "perfect fit for this role"
- Don't fabricate job positions or education, but DO maximize relevance

Return format:
{
  "resumeData": { /* complete updated resume with all sections fully rewritten */ },
  "explanation": "Summary of major changes: new summary focus, key experience rewrites, skills added/prioritized, overall optimization for [role name]"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 8000,
    });

    const response = completion.choices[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.resumeData && parsed.explanation) {
      const updatedData = normalizeResumeData(parsed.resumeData);
      return {
        success: true,
        message: ` Resume tailored successfully!\n\n${parsed.explanation}\n\nYour resume now highlights relevant experiences and uses keywords from the job description to improve ATS compatibility.`,
        updatedData,
      };
    }

    throw new Error("Invalid response format");
  } catch (error: any) {
    console.error("Error tailoring resume:", error);

    if (error?.error?.code === "rate_limit_exceeded") {
      return {
        success: false,
        message: "Rate limit exceeded. Please wait a moment and try again.",
      };
    }

    return {
      success: false,
      message:
        "Failed to tailor resume. Please try again or make manual adjustments.",
    };
  }
}
