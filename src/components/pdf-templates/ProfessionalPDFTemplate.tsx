import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

interface TemplateProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
    lineHeight: 1.5,
  },
  sidebar: {
    width: '30%',
    backgroundColor: '#f8fafc',
    padding: '32 20',
    borderRight: '3px solid #e2e8f0',
  },
  mainContent: {
    width: '70%',
    padding: '32 24',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sidebarText: {
    fontSize: 9.5,
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: 6,
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  skillList: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  positionTitle: {
    fontSize: 11.5,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  dateRange: {
    fontSize: 9.5,
    color: '#64748b',
  },
  companyInfo: {
    fontSize: 10.5,
    color: '#475569',
    marginBottom: 5,
  },
  bulletPoint: {
    marginBottom: 3,
    paddingLeft: 12,
    lineHeight: 1.5,
    color: '#334155',
    fontSize: 10,
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
});

export default function ProfessionalPDFTemplate({ data }: TemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects } = data;

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>

          {/* Contact Info */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>CONTACT</Text>
            {personalInfo.email && <Text style={styles.sidebarText}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.sidebarText}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.sidebarText}>{personalInfo.location}</Text>}
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={[styles.sidebarText, styles.link]}>
                {personalInfo.linkedin}
              </Link>
            )}
            {personalInfo.website && (
              <Link src={personalInfo.website} style={[styles.sidebarText, styles.link]}>
                {personalInfo.website}
              </Link>
            )}
          </View>

          {/* Skills */}
          {skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>SKILLS</Text>
              {Object.entries(groupedSkills).map(([category, skillList]) => (
                <View key={category} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{category}</Text>
                  <Text style={styles.skillList}>{skillList.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>LANGUAGES</Text>
              {languages.map((lang) => (
                <View key={lang.id} style={{ marginBottom: 6 }}>
                  <Text style={styles.skillCategoryTitle}>{lang.name}</Text>
                  <Text style={styles.skillList}>{lang.proficiency}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>CERTIFICATIONS</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={{ marginBottom: 8 }}>
                  <Text style={styles.skillCategoryTitle}>{cert.name}</Text>
                  <Text style={styles.skillList}>{cert.issuer}</Text>
                  <Text style={styles.skillList}>{cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {personalInfo.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROFILE</Text>
              <Text style={{ fontSize: 10.5, color: '#334155', lineHeight: 1.6 }}>
                {personalInfo.summary}
              </Text>
            </View>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EXPERIENCE</Text>
              {workExperience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.positionTitle}>{exp.position}</Text>
                    <Text style={styles.dateRange}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                  <Text style={styles.companyInfo}>
                    {exp.company} • {exp.location}
                  </Text>
                  {exp.description.some(d => d.trim()) && (
                    <View>
                      {exp.description.filter(d => d.trim()).map((desc, idx) => (
                        <Text key={idx} style={styles.bulletPoint}>
                          • {desc}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROJECTS</Text>
              {projects.map((project) => (
                <View key={project.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.positionTitle}>{project.name}</Text>
                    <Text style={styles.dateRange}>{project.date}</Text>
                  </View>
                  {project.description && (
                    <Text style={styles.companyInfo}>{project.description}</Text>
                  )}
                  {project.technologies.length > 0 && (
                    <Text style={styles.bulletPoint}>
                      Tech: {project.technologies.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>EDUCATION</Text>
              {education.map((edu) => (
                <View key={edu.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.positionTitle}>
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </Text>
                    <Text style={styles.dateRange}>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </Text>
                  </View>
                  <Text style={styles.companyInfo}>
                    {edu.school} • {edu.location}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

