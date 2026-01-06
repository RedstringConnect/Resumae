import {
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResumeData,
  WorkExperience,
  Education,
  Skill,
  Language,
  Certification,
  Project,
  SpacingSettings,
} from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import SpacingControls from "./SpacingControls";

// Curated skill categories and quick suggestions per category
const SKILL_CATEGORIES = [
  "Programming Languages",
  "Technical",
  "Frontend",
  "Backend",
  "DevOps",
  "Data",
  "Cloud",
  "AI/ML",
  "Databases",
  "Product",
  "Methodologies",
  "Soft Skills",
  "Tools",
  "Mobile",
  "Security",
  "Analytics",
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  "Programming Languages": ["JavaScript", "TypeScript", "Python", "Go", "C++"],
  Technical: [
    "System Design",
    "APIs",
    "Microservices",
    "Testing",
    "Design Patterns",
  ],
  Frontend: ["React", "Next.js", "Vue", "Tailwind CSS", "Redux"],
  Backend: ["Node.js", "Express", "Django", "NestJS", "GraphQL"],
  DevOps: ["Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
  Data: ["SQL", "ETL", "Data Modeling", "Pandas", "Spark"],
  Cloud: ["AWS", "GCP", "Azure", "Cloud Architecture", "Serverless"],
  "AI/ML": ["Machine Learning", "LLMs", "TensorFlow", "PyTorch", "MLOps"],
  Databases: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Elasticsearch"],
  Product: [
    "Product Strategy",
    "Roadmapping",
    "Discovery",
    "Prioritization",
    "A/B Testing",
  ],
  Methodologies: ["Agile", "Scrum", "Kanban", "OKRs", "Lean"],
  "Soft Skills": [
    "Leadership",
    "Communication",
    "Collaboration",
    "Stakeholder Management",
    "Mentoring",
  ],
  Tools: ["Git", "Jira", "Figma", "Postman", "Storybook"],
  Mobile: ["React Native", "Swift", "Kotlin", "Flutter", "Mobile CI/CD"],
  Security: [
    "OWASP",
    "Threat Modeling",
    "Zero Trust",
    "IAM",
    "Vulnerability Management",
  ],
  Analytics: [
    "Experimentation",
    "SQL Analytics",
    "Dashboards",
    "Amplitude",
    "Mixpanel",
  ],
};

interface MultiStepResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
  totalSteps: number;
  onComplete?: () => void;
}

export default function MultiStepResumeForm({
  data,
  onChange,
  currentStep,
  onStepChange,
  totalSteps,
  onComplete,
}: MultiStepResumeFormProps) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const [skillSectionInputs, setSkillSectionInputs] = useState<
    Record<string, string>
  >({});
  const [customCategoryInputs, setCustomCategoryInputs] = useState<
    Record<string, string>
  >({});
  const [showCustomCategory, setShowCustomCategory] = useState<
    Record<string, boolean>
  >({});
  const [newSkillInputs, setNewSkillInputs] = useState<Record<string, string>>(
    {}
  );
  const [direction, setDirection] = useState(0);
  const [parentHeight, setParentHeight] = useState(0);

  // Normalize skills on mount and when data changes from outside
  useEffect(() => {
    const needsConversion = data.skills.some(
      (skill) =>
        skill.name &&
        !skill.name.includes(",") &&
        data.skills.filter((s) => s.category === skill.category).length > 1
    );

    if (needsConversion) {
      const grouped = data.skills.reduce<Record<string, string[]>>(
        (acc, skill) => {
          const category = skill.category || "Uncategorized";
          if (!acc[category]) acc[category] = [];
          if (skill.name) acc[category].push(skill.name);
          return acc;
        },
        {}
      );

      const newSkills = Object.entries(grouped).map(([category, names]) => ({
        id: Date.now().toString() + Math.random(),
        name: names.join(", "),
        category,
      }));

      onChange({ ...data, skills: newSkills });
    }
  }, []);

  useEffect(() => {
    const newTechInputs: Record<string, string> = {};
    data.projects.forEach((project) => {
      const currentValue = techInputs[project.id];
      const dataValue = (project.technologies || []).join(", ");
      if (
        currentValue === undefined ||
        document.activeElement?.id !== `project-tech-${project.id}`
      ) {
        newTechInputs[project.id] = dataValue;
      } else {
        newTechInputs[project.id] = currentValue;
      }
    });
    setTechInputs(newTechInputs);
  }, [
    data.projects.length,
    data.projects.map((p) => (p.technologies || []).join(",")).join("|"),
  ]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const handleSpacingChange = (newSpacing: SpacingSettings) => {
    onChange({ ...data, spacing: newSpacing });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    onChange({ ...data, workExperience: [...data.workExperience, newExp] });
  };

  const updateWorkExperience = (
    id: string,
    field: keyof WorkExperience,
    value: any
  ) => {
    const updated = data.workExperience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, workExperience: updated });
  };

  const removeWorkExperience = (id: string) => {
    const filtered = data.workExperience.filter((exp) => exp.id !== id);
    onChange({ ...data, workExperience: filtered });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    const filtered = data.education.filter((edu) => edu.id !== id);
    onChange({ ...data, education: filtered });
  };

  const addSkillSection = (category: string) => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      category,
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
    setShowCustomCategory({ ...showCustomCategory, [category]: false });
    setCustomCategoryInputs({ ...customCategoryInputs, [category]: "" });
  };

  const updateSkillSection = (id: string, value: string) => {
    setSkillSectionInputs({ ...skillSectionInputs, [id]: value });
    const updated = data.skills.map((skill) =>
      skill.id === id ? { ...skill, name: value } : skill
    );
    onChange({ ...data, skills: updated });
  };

  const removeSkillSection = (id: string) => {
    const filtered = data.skills.filter((skill) => skill.id !== id);
    onChange({ ...data, skills: filtered });
    const { [id]: removed, ...rest } = skillSectionInputs;
    setSkillSectionInputs(rest);
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: "",
      proficiency: "Professional",
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    const updated = data.languages.map((lang) =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onChange({ ...data, languages: updated });
  };

  const removeLanguage = (id: string) => {
    const filtered = data.languages.filter((lang) => lang.id !== id);
    onChange({ ...data, languages: filtered });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (
    id: string,
    field: keyof Certification,
    value: string
  ) => {
    const updated = data.certifications.map((cert) =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (id: string) => {
    const filtered = data.certifications.filter((cert) => cert.id !== id);
    onChange({ ...data, certifications: filtered });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      date: "",
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
    setTechInputs({ ...techInputs, [newProject.id]: "" });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.projects.map((proj) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    onChange({ ...data, projects: updated });
  };

  const removeProject = (id: string) => {
    const filtered = data.projects.filter((proj) => proj.id !== id);
    onChange({ ...data, projects: filtered });
    const { [id]: removed, ...rest } = techInputs;
    setTechInputs(rest);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      onStepChange(currentStep - 1);
    }
  };

  // Step 0: Personal Information
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="fullName"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Full Name *
        </Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={data.personalInfo.fullName}
          onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)}
          className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={data.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
            className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
          />
        </div>

        <div>
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Phone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={data.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
            className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="location"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Location
        </Label>
        <Input
          id="location"
          placeholder="San Francisco, CA"
          value={data.personalInfo.location}
          onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
          className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label
            htmlFor="linkedin"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={data.personalInfo.linkedin}
            onChange={(e) =>
              handlePersonalInfoChange("linkedin", e.target.value)
            }
            className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
          />
        </div>

        <div>
          <Label
            htmlFor="website"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Website/Portfolio
          </Label>
          <Input
            id="website"
            placeholder="johndoe.dev"
            value={data.personalInfo.website}
            onChange={(e) =>
              handlePersonalInfoChange("website", e.target.value)
            }
            className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="summary"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Professional Summary
        </Label>
        <Textarea
          id="summary"
          placeholder="Results-driven professional with X years of experience..."
          value={data.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
          className="mt-1.5 min-h-[100px] bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollbarWidth: "thin" }}
        />
      </div>
    </div>
  );

  // Step 1: Work Experience
  const renderWorkExperience = () => (
    <div className="space-y-4">
      {data.workExperience.map((exp, index) => (
        <Card
          key={exp.id}
          className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
        >
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Experience {index + 1}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeWorkExperience(exp.id)}
                className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Company *
                  </Label>
                  <Input
                    placeholder="Tech Solutions Inc."
                    value={exp.company}
                    onChange={(e) =>
                      updateWorkExperience(exp.id, "company", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Position *
                  </Label>
                  <Input
                    placeholder="Senior Software Engineer"
                    value={exp.position}
                    onChange={(e) =>
                      updateWorkExperience(exp.id, "position", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Location
                </Label>
                <Input
                  placeholder="San Francisco, CA"
                  value={exp.location}
                  onChange={(e) =>
                    updateWorkExperience(exp.id, "location", e.target.value)
                  }
                  className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Start Date
                  </Label>
                  <Input
                    placeholder="Jan 2021"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateWorkExperience(exp.id, "startDate", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    End Date
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input
                      placeholder="Dec 2023"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateWorkExperience(exp.id, "endDate", e.target.value)
                      }
                      disabled={exp.current}
                      className="flex-1 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => {
                          updateWorkExperience(
                            exp.id,
                            "current",
                            e.target.checked
                          );
                          if (e.target.checked) {
                            updateWorkExperience(exp.id, "endDate", "");
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      Current
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Responsibilities & Achievements
                </Label>
                <div className="mt-1.5 space-y-2">
                  {exp.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <Textarea
                        placeholder="Led development of..."
                        value={desc}
                        onChange={(e) => {
                          const newDesc = [...exp.description];
                          newDesc[descIndex] = e.target.value;
                          updateWorkExperience(exp.id, "description", newDesc);
                        }}
                        className="min-h-[60px] bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                        style={{ scrollbarWidth: "thin" }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newDesc = exp.description.filter(
                            (_, i) => i !== descIndex
                          );
                          updateWorkExperience(exp.id, "description", newDesc);
                        }}
                        className="h-8 w-8 shrink-0 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateWorkExperience(exp.id, "description", [
                        ...exp.description,
                        "",
                      ]);
                    }}
                    className="mt-2 w-full border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Bullet Point
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addWorkExperience}
        variant="outline"
        className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Work Experience
      </Button>
    </div>
  );

  // Step 2: Education
  const renderEducation = () => (
    <div className="space-y-4">
      {data.education.map((edu, index) => (
        <Card
          key={edu.id}
          className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
        >
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Education {index + 1}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  School/University *
                </Label>
                <Input
                  placeholder="University of California, Berkeley"
                  value={edu.school}
                  onChange={(e) =>
                    updateEducation(edu.id, "school", e.target.value)
                  }
                  className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Degree
                  </Label>
                  <Input
                    placeholder="Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Field of Study
                  </Label>
                  <Input
                    placeholder="Computer Science"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Location
                </Label>
                <Input
                  placeholder="Berkeley, CA"
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Start Year
                  </Label>
                  <Input
                    placeholder="2015"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "startDate", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    End Year
                  </Label>
                  <Input
                    placeholder="2019"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducation(edu.id, "endDate", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    GPA (Optional)
                  </Label>
                  <Input
                    placeholder="3.8"
                    value={edu.gpa}
                    onChange={(e) =>
                      updateEducation(edu.id, "gpa", e.target.value)
                    }
                    className="mt-1.5 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={addEducation}
        variant="outline"
        className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );

  // Step 3: Skills
  const renderSkills = () => {
    const addIndividualSkill = (sectionId: string) => {
      const newSkillValue = newSkillInputs[sectionId]?.trim();
      if (!newSkillValue) return;

      const skillSection = data.skills.find((s) => s.id === sectionId);
      if (!skillSection) return;

      const currentSkills = skillSection.name
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!currentSkills.includes(newSkillValue)) {
        const newValue = [...currentSkills, newSkillValue].join(", ");
        updateSkillSection(sectionId, newValue);
      }
      setNewSkillInputs({ ...newSkillInputs, [sectionId]: "" });
    };

    const removeIndividualSkill = (
      sectionId: string,
      skillToRemove: string
    ) => {
      const skillSection = data.skills.find((s) => s.id === sectionId);
      if (!skillSection) return;

      const currentSkills = skillSection.name
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const newValue = currentSkills
        .filter((s) => s !== skillToRemove)
        .join(", ");
      updateSkillSection(sectionId, newValue);
    };

    return (
      <div className="space-y-4">
        {data.skills.map((skillSection) => {
          const currentSkills = skillSection.name
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          return (
            <Card
              key={skillSection.id}
              className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
            >
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Category
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkillSection(skillSection.id)}
                      className="h-8 px-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300 text-xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Remove Section
                    </Button>
                  </div>

                  <select
                    size={1}
                    value={
                      showCustomCategory[skillSection.id]
                        ? "__custom__"
                        : skillSection.category
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setShowCustomCategory({
                          ...showCustomCategory,
                          [skillSection.id]: true,
                        });
                      } else {
                        setShowCustomCategory({
                          ...showCustomCategory,
                          [skillSection.id]: false,
                        });
                        const updated = data.skills.map((skill) =>
                          skill.id === skillSection.id
                            ? { ...skill, category: e.target.value }
                            : skill
                        );
                        onChange({ ...data, skills: updated });
                      }
                    }}
                    style={{ maxHeight: "300px" }}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-[#2c2c2d] rounded-md text-base bg-white/85 dark:bg-zinc-900/80 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  >
                    {[...SKILL_CATEGORIES, skillSection.category]
                      .filter((v, i, a) => a.indexOf(v) === i)
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    <option value="__custom__">+ Custom Category</option>
                  </select>

                  {showCustomCategory[skillSection.id] && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter custom category name"
                        value={customCategoryInputs[skillSection.id] || ""}
                        onChange={(e) =>
                          setCustomCategoryInputs({
                            ...customCategoryInputs,
                            [skillSection.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            customCategoryInputs[skillSection.id]?.trim()
                          ) {
                            e.preventDefault();
                            const newCategory =
                              customCategoryInputs[skillSection.id].trim();
                            const updated = data.skills.map((skill) =>
                              skill.id === skillSection.id
                                ? { ...skill, category: newCategory }
                                : skill
                            );
                            onChange({ ...data, skills: updated });
                            setShowCustomCategory({
                              ...showCustomCategory,
                              [skillSection.id]: false,
                            });
                            setCustomCategoryInputs({
                              ...customCategoryInputs,
                              [skillSection.id]: "",
                            });
                          }
                        }}
                        className="flex-1 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                      />
                      <Button
                        onClick={() => {
                          if (customCategoryInputs[skillSection.id]?.trim()) {
                            const newCategory =
                              customCategoryInputs[skillSection.id].trim();
                            const updated = data.skills.map((skill) =>
                              skill.id === skillSection.id
                                ? { ...skill, category: newCategory }
                                : skill
                            );
                            onChange({ ...data, skills: updated });
                            setShowCustomCategory({
                              ...showCustomCategory,
                              [skillSection.id]: false,
                            });
                            setCustomCategoryInputs({
                              ...customCategoryInputs,
                              [skillSection.id]: "",
                            });
                          }
                        }}
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setShowCustomCategory({
                            ...showCustomCategory,
                            [skillSection.id]: false,
                          });
                          setCustomCategoryInputs({
                            ...customCategoryInputs,
                            [skillSection.id]: "",
                          });
                        }}
                        size="sm"
                        variant="outline"
                        className="border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                      Add Skills
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill for this category"
                        value={newSkillInputs[skillSection.id] || ""}
                        onChange={(e) =>
                          setNewSkillInputs({
                            ...newSkillInputs,
                            [skillSection.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addIndividualSkill(skillSection.id);
                          }
                        }}
                        className="flex-1 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                      />
                      <Button
                        onClick={() => addIndividualSkill(skillSection.id)}
                        size="sm"
                        className="bg-black dark:bg-white text-white dark:text-black 6px-6"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {SKILL_SUGGESTIONS[skillSection.category] && (
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                        Suggestions
                      </Label>
                      <div className="flex flex-wrap gap-1.5">
                        {SKILL_SUGGESTIONS[skillSection.category].map(
                          (suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => {
                                if (!currentSkills.includes(suggestion)) {
                                  const newValue = [
                                    ...currentSkills,
                                    suggestion,
                                  ].join(", ");
                                  updateSkillSection(skillSection.id, newValue);
                                }
                              }}
                              disabled={currentSkills.includes(suggestion)}
                              className={`px-2.5 py-1 text-xs rounded-full transition-colors border ${
                                currentSkills.includes(suggestion)
                                  ? "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-zinc-700 cursor-not-allowed"
                                  : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 border-gray-300 dark:border-[#2c2c2d]"
                              }`}
                            >
                              + {suggestion}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {currentSkills.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        Skills
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {currentSkills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-black border border-gray-300 dark:border-[#2c2c2d] rounded-lg text-sm text-gray-700 dark:text-gray-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() =>
                                removeIndividualSkill(skillSection.id, skill)
                              }
                              className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Button
          onClick={() => addSkillSection(SKILL_CATEGORIES[0])}
          variant="outline"
          className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Skill Section
        </Button>
      </div>
    );
  };

  // Step 4: Additional Sections (Languages, Certifications, Projects)
  const renderAdditionalSections = () => (
    <div className="space-y-6">
      {/* Languages */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold ">Languages</h3>
        {data.languages.map((lang) => (
          <Card
            key={lang.id}
            className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Language"
                  value={lang.name}
                  onChange={(e) =>
                    updateLanguage(lang.id, "name", e.target.value)
                  }
                  className="flex-1 bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
                <select
                  size={1}
                  value={lang.proficiency}
                  onChange={(e) =>
                    updateLanguage(lang.id, "proficiency", e.target.value)
                  }
                  style={{ maxHeight: "200px" }}
                  className="rounded-md border border-gray-200 dark:border-[#2c2c2d] px-4 py-3 text-base bg-white/85 dark:bg-zinc-900/80 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Professional">Professional</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(lang.id)}
                  className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          onClick={addLanguage}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Language
        </Button>
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold ">Certifications</h3>
        {data.certifications.map((cert, index) => (
          <Card
            key={cert.id}
            className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
          >
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Certification {index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(cert.id, "name", e.target.value)
                  }
                  className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
                <Input
                  placeholder="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) =>
                    updateCertification(cert.id, "issuer", e.target.value)
                  }
                  className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Date (e.g., Mar 2023)"
                    value={cert.date}
                    onChange={(e) =>
                      updateCertification(cert.id, "date", e.target.value)
                    }
                    className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={cert.url}
                    onChange={(e) =>
                      updateCertification(cert.id, "url", e.target.value)
                    }
                    className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          onClick={addCertification}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      </div>

      {/* Projects */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold ">Projects</h3>
        {data.projects.map((project, index) => (
          <Card
            key={project.id}
            className="border-gray-200 dark:border-[#2c2c2d] bg-white/50 dark:bg-black/50"
          >
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Project {index + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="h-8 w-8 p-0 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="Project Name"
                  value={project.name}
                  onChange={(e) =>
                    updateProject(project.id, "name", e.target.value)
                  }
                  className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
                <Textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    updateProject(project.id, "description", e.target.value)
                  }
                  className="min-h-[80px] bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                  style={{ scrollbarWidth: "thin" }}
                />
                <Input
                  id={`project-tech-${project.id}`}
                  placeholder="Technologies (comma-separated, e.g., React, Node.js, MongoDB)"
                  value={techInputs[project.id] ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTechInputs({ ...techInputs, [project.id]: value });
                    const techArray = value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    updateProject(project.id, "technologies", techArray);
                  }}
                  className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Date (e.g., Jan 2023 - Jun 2023)"
                    value={project.date}
                    onChange={(e) =>
                      updateProject(project.id, "date", e.target.value)
                    }
                    className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                  <Input
                    placeholder="URL (optional)"
                    value={project.url}
                    onChange={(e) =>
                      updateProject(project.id, "url", e.target.value)
                    }
                    className="bg-white/85 dark:bg-zinc-900/80 border-gray-200 dark:border-[#2c2c2d]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button
          onClick={addProject}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-gray-300 dark:border-[#2c2c2d] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {/* Spacing Controls */}
      <div className="pt-4 ">
        <SpacingControls
          spacing={
            data.spacing || {
              pageMargin: 20,
              sectionSpacing: 8,
              lineSpacing: 1.2,
              bulletSpacing: 4,
              headerSpacing: 6,
            }
          }
          onChange={handleSpacingChange}
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderWorkExperience();
      case 2:
        return renderEducation();
      case 3:
        return renderSkills();
      case 4:
        return renderAdditionalSections();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div
        className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar relative"
        animate={{ height: parentHeight || "auto" }}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      >
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <StepContent
            key={currentStep}
            direction={direction}
            onHeightReady={setParentHeight}
          >
            {renderCurrentStep()}
          </StepContent>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-[#151517] backdrop-blur-sm px-4 py-4 mt-4  border-gray-200 dark:border-[#2c2c2d]">
        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex-1 rounded-xl bg-white dark:bg-black gap-2 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={handleNext}
              className="flex-1 rounded-xl gap-2 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              className="flex-1 rounded-xl gap-2 bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <Check className="h-4 w-4" />
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Slide transition component
function StepContent({
  children,
  direction,
  onHeightReady,
}: {
  children: React.ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={{
        enter: (dir: number) => ({
          x: dir > 0 ? "100%" : "-100%",
          opacity: 0,
        }),
        center: {
          x: "0%",
          opacity: 1,
        },
        exit: (dir: number) => ({
          x: dir > 0 ? "-50%" : "50%",
          opacity: 0,
        }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}
