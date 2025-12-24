import { Plus, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Language, Certification, Project, SpacingSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import SpacingControls from './SpacingControls';

// Curated skill categories and quick suggestions per category
const SKILL_CATEGORIES = [
  'Programming Languages',
  'Technical',
  'Frontend',
  'Backend',
  'DevOps',
  'Data',
  'Cloud',
  'AI/ML',
  'Databases',
  'Product',
  'Methodologies',
  'Soft Skills',
  'Tools',
  'Mobile',
  'Security',
  'Analytics',
];

const SKILL_SUGGESTIONS: Record<string, string[]> = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Go', 'C++'],
  Technical: ['System Design', 'APIs', 'Microservices', 'Testing', 'Design Patterns'],
  Frontend: ['React', 'Next.js', 'Vue', 'Tailwind CSS', 'Redux'],
  Backend: ['Node.js', 'Express', 'Django', 'NestJS', 'GraphQL'],
  DevOps: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Linux'],
  Data: ['SQL', 'ETL', 'Data Modeling', 'Pandas', 'Spark'],
  Cloud: ['AWS', 'GCP', 'Azure', 'Cloud Architecture', 'Serverless'],
  'AI/ML': ['Machine Learning', 'LLMs', 'TensorFlow', 'PyTorch', 'MLOps'],
  Databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Elasticsearch'],
  Product: ['Product Strategy', 'Roadmapping', 'Discovery', 'Prioritization', 'A/B Testing'],
  Methodologies: ['Agile', 'Scrum', 'Kanban', 'OKRs', 'Lean'],
  'Soft Skills': ['Leadership', 'Communication', 'Collaboration', 'Stakeholder Management', 'Mentoring'],
  Tools: ['Git', 'Jira', 'Figma', 'Postman', 'Storybook'],
  Mobile: ['React Native', 'Swift', 'Kotlin', 'Flutter', 'Mobile CI/CD'],
  Security: ['OWASP', 'Threat Modeling', 'Zero Trust', 'IAM', 'Vulnerability Management'],
  Analytics: ['Experimentation', 'SQL Analytics', 'Dashboards', 'Amplitude', 'Mixpanel'],
};

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  // Track technology input values locally to prevent cursor jumping
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const [skillSectionInputs, setSkillSectionInputs] = useState<Record<string, string>>({});
  const [customCategoryInputs, setCustomCategoryInputs] = useState<Record<string, string>>({});
  const [showCustomCategory, setShowCustomCategory] = useState<Record<string, boolean>>({});

  // Normalize skills on mount and when data changes from outside
  useEffect(() => {
    // Check if skills are in old format (individual skills) and convert to new format (grouped)
    const needsConversion = data.skills.some(skill => 
      skill.name && !skill.name.includes(',') && 
      data.skills.filter(s => s.category === skill.category).length > 1
    );

    if (needsConversion) {
      // Group skills by category
      const grouped = data.skills.reduce<Record<string, string[]>>((acc, skill) => {
        const category = skill.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        if (skill.name) acc[category].push(skill.name);
        return acc;
      }, {});

      // Convert to new format
      const newSkills = Object.entries(grouped).map(([category, names]) => ({
        id: Date.now().toString() + Math.random(),
        name: names.join(', '),
        category,
      }));

      onChange({ ...data, skills: newSkills });
    }
  }, []);

  // Update local state when data changes (e.g., switching projects or data updates)
  useEffect(() => {
    const newTechInputs: Record<string, string> = {};
    data.projects.forEach(project => {
      // Only update if the input isn't currently focused (being edited)
      const currentValue = techInputs[project.id];
      const dataValue = project.technologies.join(', ');
      // Update if it's a new project or if the data changed from outside this component
      if (currentValue === undefined || document.activeElement?.id !== `project-tech-${project.id}`) {
        newTechInputs[project.id] = dataValue;
      } else {
        newTechInputs[project.id] = currentValue;
      }
    });
    setTechInputs(newTechInputs);
  }, [data.projects]);

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [''],
    };
    onChange({ ...data, workExperience: [...data.workExperience, newExp] });
  };

  const updateWorkExperience = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const updateWorkDescription = (id: string, index: number, value: string) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              description: exp.description.map((desc, i) =>
                i === index ? value : desc
              ),
            }
          : exp
      ),
    });
  };

  const addWorkDescriptionBullet = (id: string) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map((exp) =>
        exp.id === id ? { ...exp, description: [...exp.description, ''] } : exp
      ),
    });
  };

  const removeWorkDescriptionBullet = (id: string, index: number) => {
    onChange({
      ...data,
      workExperience: data.workExperience.map((exp) =>
        exp.id === id
          ? {
              ...exp,
              description: exp.description.filter((_, i) => i !== index),
            }
          : exp
      ),
    });
  };

  const removeWorkExperience = (id: string) => {
    onChange({
      ...data,
      workExperience: data.workExperience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkillSection = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      category: SKILL_CATEGORIES[0],
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkillCategory = (id: string, category: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id ? { ...skill, category } : skill
      ),
    });
  };

  const addSkillToSection = (sectionId: string, skillName: string, category: string) => {
    const trimmedName = skillName.trim();
    if (!trimmedName) return;

    const section = data.skills.find((s) => s.id === sectionId);
    if (!section) return;

    const existingSkills = section.name.split(',').map((s) => s.trim()).filter(Boolean);
    
    if (existingSkills.some((s) => s.toLowerCase() === trimmedName.toLowerCase())) {
      setSkillSectionInputs((prev) => ({ ...prev, [sectionId]: '' }));
      return;
    }

    const updatedSkills = [...existingSkills, trimmedName].join(', ');
    
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === sectionId ? { ...skill, name: updatedSkills, category } : skill
      ),
    });
    
    setSkillSectionInputs((prev) => ({ ...prev, [sectionId]: '' }));
  };

  const removeSkillFromSection = (sectionId: string, skillToRemove: string) => {
    const section = data.skills.find((s) => s.id === sectionId);
    if (!section) return;

    const existingSkills = section.name.split(',').map((s) => s.trim()).filter(Boolean);
    const updatedSkills = existingSkills.filter((s) => s !== skillToRemove).join(', ');
    
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === sectionId ? { ...skill, name: updatedSkills } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    });
  };

  // Language functions
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Intermediate',
    };
    onChange({ ...data, languages: [...data.languages, newLanguage] });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      languages: data.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter((lang) => lang.id !== id),
    });
  };

  // Certification functions
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      url: '',
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      certifications: data.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((cert) => cert.id !== id),
    });
  };

  // Project functions
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      date: '',
    };
    onChange({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      projects: data.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    });
  };

  const updateProjectTechnologies = (id: string, value: string) => {
    // Split by comma, trim each item, and filter out empty strings
    const technologies = value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    updateProject(id, 'technologies', technologies);
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((proj) => proj.id !== id),
    });
  };

  const updateSpacing = (spacing: SpacingSettings) => {
    onChange({
      ...data,
      spacing,
    });
  };



  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
        <div className="space-y-4">
    <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
            type="text"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="John Doe"
          />
        </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
              type="tel"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
            type="text"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
              type="url"
              value={data.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
            <div>
              <Label htmlFor="website">Website/Portfolio</Label>
              <Input
                id="website"
              type="url"
              value={data.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="johndoe.com"
            />
          </div>
        </div>
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            placeholder="Brief overview of your professional background and career objectives..."
              rows={4}
          />
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
        <div className="space-y-4">
          {data.workExperience.map((exp) => (
            <Card key={exp.id} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor={`company-${exp.id}`}>Company</Label>
                  <Input
                    id={`company-${exp.id}`}
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateWorkExperience(exp.id, 'company', e.target.value)
                }
                placeholder="Company Name"
              />
            </div>
                <div>
                  <Label htmlFor={`position-${exp.id}`}>Position</Label>
                  <Input
                    id={`position-${exp.id}`}
                type="text"
                value={exp.position}
                onChange={(e) =>
                  updateWorkExperience(exp.id, 'position', e.target.value)
                }
                placeholder="Job Title"
              />
            </div>
                <div>
                  <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                  <Input
                    id={`exp-location-${exp.id}`}
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateWorkExperience(exp.id, 'location', e.target.value)
                }
                placeholder="City, State"
              />
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`startDate-${exp.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${exp.id}`}
                  type="text"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateWorkExperience(exp.id, 'startDate', e.target.value)
                  }
                  placeholder="MM/YYYY"
                />
              </div>
                  <div>
                    <Label htmlFor={`endDate-${exp.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${exp.id}`}
                  type="text"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateWorkExperience(exp.id, 'endDate', e.target.value)
                  }
                  placeholder="MM/YYYY"
                  disabled={exp.current}
                />
              </div>
            </div>
                <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  updateWorkExperience(exp.id, 'current', e.target.checked)
                }
                id={`current-${exp.id}`}
                    className="h-4 w-4 rounded border-gray-300"
              />
                  <Label htmlFor={`current-${exp.id}`} className="font-normal cursor-pointer">
                    Currently working here
                  </Label>
            </div>
                <div className="space-y-2">
                  <Label>Job Responsibilities</Label>
              {exp.description.map((desc, index) => (
                    <div key={`${exp.id}-${index}`} className="flex gap-2">
                      <Input
                    type="text"
                    value={desc}
                    onChange={(e) =>
                      updateWorkDescription(exp.id, index, e.target.value)
                    }
                    placeholder="Describe your achievement or responsibility..."
                        autoComplete="off"
                  />
                  {exp.description.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                      onClick={() => removeWorkDescriptionBullet(exp.id, index)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 size={16} />
                        </Button>
                  )}
                </div>
              ))}
                  <Button
                    variant="outline"
                    size="sm"
                onClick={() => addWorkDescriptionBullet(exp.id)}
                    className="gap-2"
              >
                <Plus size={16} />
                Add Bullet Point
                  </Button>
            </div>
                <Button
                  variant="outline"
              onClick={() => removeWorkExperience(exp.id)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 size={16} />
              Remove Experience
                </Button>
              </CardContent>
            </Card>
        ))}
          <Button onClick={addWorkExperience} className="gap-2 w-full">
          <Plus size={18} />
          Add Work Experience
          </Button>
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Education</h2>
        <div className="space-y-4">
        {data.education.map((edu) => (
            <Card key={edu.id} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor={`school-${edu.id}`}>School/University</Label>
                  <Input
                    id={`school-${edu.id}`}
                type="text"
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                placeholder="University Name"
              />
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                    <Input
                      id={`degree-${edu.id}`}
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
                  <div>
                    <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                    <Input
                      id={`field-${edu.id}`}
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`edu-location-${edu.id}`}>Location</Label>
                    <Input
                      id={`edu-location-${edu.id}`}
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
                  <div>
                    <Label htmlFor={`startDate-${edu.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${edu.id}`}
                      type="text"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, 'startDate', e.target.value)
                      }
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${edu.id}`}>End Date (or leave blank if current)</Label>
                    <Input
                      id={`endDate-${edu.id}`}
                  type="text"
                      value={edu.endDate}
                  onChange={(e) =>
                        updateEducation(edu.id, 'endDate', e.target.value)
                  }
                      placeholder="YYYY"
                />
              </div>
            </div>
                <div>
                  <Label htmlFor={`gpa-${edu.id}`}>GPA (Optional)</Label>
                  <Input
                    id={`gpa-${edu.id}`}
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
            </div>
                <Button
                  variant="outline"
              onClick={() => removeEducation(edu.id)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 size={16} />
              Remove Education
                </Button>
              </CardContent>
            </Card>
        ))}
          <Button onClick={addEducation} className="gap-2 w-full">
          <Plus size={18} />
          Add Education
          </Button>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Skills</h2>
        <div className="space-y-4">
          {data.skills.map((skillSection) => {
            const currentSuggestions = SKILL_SUGGESTIONS[skillSection.category] || [];
            const sectionSkills = (skillSection.name || '').split(',').map((s) => s.trim()).filter(Boolean);
            const sectionInput = skillSectionInputs[skillSection.id] || '';

            return (
              <Card key={skillSection.id} className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`skill-category-${skillSection.id}`}>Category</Label>
                    {showCustomCategory[skillSection.id] ? (
                      <div className="space-y-2">
                        <Input
                          id={`custom-category-${skillSection.id}`}
                          value={customCategoryInputs[skillSection.id] || ''}
                          onChange={(e) => setCustomCategoryInputs((prev) => ({ ...prev, [skillSection.id]: e.target.value }))}
                          placeholder="Enter custom category"
                          autoComplete="off"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const customCategory = customCategoryInputs[skillSection.id]?.trim();
                              if (customCategory) {
                                updateSkillCategory(skillSection.id, customCategory);
                                setShowCustomCategory((prev) => ({ ...prev, [skillSection.id]: false }));
                                setCustomCategoryInputs((prev) => ({ ...prev, [skillSection.id]: '' }));
                              }
                            }}
                            disabled={!customCategoryInputs[skillSection.id]?.trim()}
                            className="flex-1"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCustomCategory((prev) => ({ ...prev, [skillSection.id]: false }))}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <select
                          id={`skill-category-${skillSection.id}`}
                          value={SKILL_CATEGORIES.includes(skillSection.category) ? skillSection.category : 'custom'}
                          onChange={(e) => {
                            if (e.target.value === 'custom') {
                              setShowCustomCategory((prev) => ({ ...prev, [skillSection.id]: true }));
                              setCustomCategoryInputs((prev) => ({ ...prev, [skillSection.id]: skillSection.category }));
                            } else {
                              updateSkillCategory(skillSection.id, e.target.value);
                            }
                          }}
                          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                        >
                          {SKILL_CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                          {!SKILL_CATEGORIES.includes(skillSection.category) && (
                            <option value="custom">{skillSection.category}</option>
                          )}
                          <option value="custom">+ Custom Category</option>
                        </select>
                        {!SKILL_CATEGORIES.includes(skillSection.category) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowCustomCategory((prev) => ({ ...prev, [skillSection.id]: true }));
                              setCustomCategoryInputs((prev) => ({ ...prev, [skillSection.id]: skillSection.category }));
                            }}
                            className="w-full"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`skill-input-${skillSection.id}`}>Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`skill-input-${skillSection.id}`}
                        value={sectionInput}
                        onChange={(e) => setSkillSectionInputs((prev) => ({ ...prev, [skillSection.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkillToSection(skillSection.id, sectionInput, skillSection.category);
                          }
                        }}
                        placeholder="Add a skill for this category"
                        autoComplete="off"
                      />
                      <Button
                        onClick={() => addSkillToSection(skillSection.id, sectionInput, skillSection.category)}
                        disabled={!sectionInput.trim()}
                        size="sm"
                        className="gap-2"
                      >
                        <Plus size={16} />
                        Add
                      </Button>
                    </div>
                  </div>

                  {currentSuggestions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Suggestions</p>
                      <div className="flex flex-wrap gap-2">
                        {currentSuggestions.map((suggestion) => {
                          const alreadyAdded = sectionSkills.some(
                            (s) => s.toLowerCase() === suggestion.toLowerCase()
                          );

                          return (
                            <Button
                              key={suggestion}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`rounded-full transition ${
                                alreadyAdded
                                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-[#f5f9ff]'
                              }`}
                              onClick={() => addSkillToSection(skillSection.id, suggestion, skillSection.category)}
                              disabled={alreadyAdded}
                            >
                              + {suggestion}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {sectionSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {sectionSkills.map((skill, index) => (
                          <span
                            key={`${skillSection.id}-${index}`}
                            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-800 hover:border-gray-300"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              aria-label={`Remove ${skill}`}
                              onClick={() => removeSkillFromSection(skillSection.id, skill)}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-red-100 hover:text-red-600"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => removeSkill(skillSection.id)}
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2 size={16} />
                    Remove Section
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <Button onClick={addSkillSection} className="gap-2 w-full">
            <Plus size={18} />
            Add Skill Section
          </Button>
        </div>
      </div>

      {/* Languages */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Languages</h2>
        <div className="space-y-4">
          {data.languages.map((language) => (
            <Card key={language.id} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`language-name-${language.id}`}>Language</Label>
                    <Input
                      id={`language-name-${language.id}`}
                      type="text"
                      value={language.name}
                      onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                      placeholder="English, Spanish..."
                    />
                  </div>
                  <div>
                    <Label htmlFor={`language-proficiency-${language.id}`}>Proficiency</Label>
                    <Input
                      id={`language-proficiency-${language.id}`}
                      type="text"
                      value={language.proficiency}
                      onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                      placeholder="Native, Fluent, Intermediate..."
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeLanguage(language.id)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 size={16} />
                  Remove Language
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addLanguage} className="gap-2 w-full">
            <Plus size={18} />
            Add Language
          </Button>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Certifications</h2>
        <div className="space-y-4">
          {data.certifications.map((cert) => (
            <Card key={cert.id} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                  <Input
                    id={`cert-name-${cert.id}`}
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Solutions Architect..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                    <Input
                      id={`cert-issuer-${cert.id}`}
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cert-date-${cert.id}`}>Date Obtained</Label>
                    <Input
                      id={`cert-date-${cert.id}`}
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`cert-url-${cert.id}`}>Credential URL (Optional)</Label>
                  <Input
                    id={`cert-url-${cert.id}`}
                    type="url"
                    value={cert.url || ''}
                    onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeCertification(cert.id)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 size={16} />
                  Remove Certification
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addCertification} className="gap-2 w-full">
            <Plus size={18} />
            Add Certification
          </Button>
        </div>
      </div>

      {/* Projects */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="space-y-4">
          {data.projects.map((project) => (
            <Card key={project.id} className="border-2">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor={`project-name-${project.id}`}>Project Name</Label>
                  <Input
                    id={`project-name-${project.id}`}
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="E-commerce Platform"
                  />
                </div>
                <div>
                  <Label htmlFor={`project-desc-${project.id}`}>Description</Label>
                  <Textarea
                    id={`project-desc-${project.id}`}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Describe what the project does and your role..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`project-tech-${project.id}`}>Technologies (comma-separated)</Label>
                    <Input
                      id={`project-tech-${project.id}`}
                      value={techInputs[project.id] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Update local state for smooth typing
                        setTechInputs(prev => ({ ...prev, [project.id]: value }));
                        // Update data immediately for live preview
                        updateProjectTechnologies(project.id, value);
                      }}
                      placeholder="React, Node.js, MongoDB"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`project-date-${project.id}`}>Date</Label>
                    <Input
                      id={`project-date-${project.id}`}
                      type="text"
                      value={project.date}
                      onChange={(e) => updateProject(project.id, 'date', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`project-url-${project.id}`}>Project URL (Optional)</Label>
                  <Input
                    id={`project-url-${project.id}`}
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeProject(project.id)}
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <Trash2 size={16} />
                  Remove Project
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button onClick={addProject} className="gap-2 w-full">
            <Plus size={18} />
            Add Project
          </Button>
        </div>
      </div>

      {/* Spacing Controls */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Spacing & Layout</h2>
        <SpacingControls 
          spacing={data.spacing || {
            pageMargin: 20,
            sectionSpacing: 8,
            lineSpacing: 1.2,
            bulletSpacing: 4,
            headerSpacing: 6,
          }}
          onChange={updateSpacing}
        />
      </div>
    </div>
  );
}
