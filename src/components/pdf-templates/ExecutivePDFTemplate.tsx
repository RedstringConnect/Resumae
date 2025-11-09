import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#1e3a5f',
    padding: '40 28',
    color: '#ffffff',
  },
  mainContent: {
    width: '65%',
    padding: '40 32',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  sidebarText: {
    fontSize: 10,
    color: '#e5e7eb',
    lineHeight: 1.7,
    marginBottom: 6,
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#93c5fd',
    marginBottom: 4,
  },
  skillList: {
    fontSize: 9,
    color: '#e5e7eb',
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  summary: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 1.7,
    marginBottom: 20,
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  dateRange: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  companyInfo: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
    fontWeight: 'semibold',
  },
  bulletPoint: {
    marginBottom: 3,
    paddingLeft: 12,
    lineHeight: 1.5,
    color: '#4b5563',
    fontSize: 10,
  },
  link: {
    color: '#93c5fd',
    textDecoration: 'none',
  },
});

export default function ExecutivePDFTemplate({ data }: { data: ResumeData }) {
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
        {/* Left Sidebar - Dark Navy */}
        <View style={styles.sidebar}>
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
              <Text style={styles.sidebarTitle}>EXPERTISE</Text>
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
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>

          {/* Summary */}
          {personalInfo.summary && (
            <View style={styles.summary}>
              <Text>{personalInfo.summary}</Text>
            </View>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
              {workExperience.map((exp) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.positionTitle}>{exp.position}</Text>
                    <Text style={styles.dateRange}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
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
              <Text style={styles.sectionTitle}>KEY PROJECTS</Text>
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
                      Technologies: {project.technologies.join(', ')}
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
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
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

          {/* Certifications */}
          {certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={styles.experienceItem}>
                  <Text style={styles.positionTitle}>{cert.name}</Text>
                  <Text style={styles.companyInfo}>{cert.issuer} • {cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

