import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

// Register standard fonts
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
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
    letterSpacing: -0.5,
    lineHeight: 1.2,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#6b7280',
    alignItems: 'center',
    lineHeight: 1.6,
    marginTop: 4,
  },
  contactItem: {
    marginRight: 4,
  },
  separator: {
    marginHorizontal: 4,
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
  summary: {
    marginBottom: 16,
    lineHeight: 1.5,
    color: '#4b5563',
    fontSize: 10.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  dateRange: {
    fontSize: 9,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  companyInfo: {
    fontSize: 10.5,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: 'semibold',
  },
  description: {
    marginTop: 4,
  },
  bulletPoint: {
    marginBottom: 3,
    paddingLeft: 12,
    lineHeight: 1.4,
    color: '#4b5563',
    fontSize: 10,
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  skillRow: {
    flexDirection: 'row',
    fontSize: 10,
    lineHeight: 1.5,
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#1f2937',
    marginRight: 6,
  },
  skillList: {
    color: '#4b5563',
    flex: 1,
  },
  certificationItem: {
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  certificationInfo: {
    flex: 1,
    fontSize: 10,
  },
  certificationName: {
    fontWeight: 'bold',
    color: '#1f2937',
    fontSize: 11,
  },
  certificationIssuer: {
    color: '#6b7280',
    marginLeft: 6,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageItem: {
    fontSize: 10,
  },
  languageName: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
  languageProficiency: {
    color: '#4b5563',
  },
  projectItem: {
    marginBottom: 10,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  projectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  projectDescription: {
    color: '#4b5563',
    marginBottom: 3,
    lineHeight: 1.5,
    fontSize: 10,
  },
  projectTech: {
    fontSize: 9,
    color: '#6b7280',
  },
  techLabel: {
    fontWeight: 'bold',
  },
});

export default function ModernPDFTemplate({ data }: TemplateProps) {
  const { personalInfo, workExperience, education, skills, languages, certifications, projects } = data;

  // Group skills by category
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <>
                <Text style={styles.contactItem}>{personalInfo.email}</Text>
                {(personalInfo.phone || personalInfo.location || personalInfo.linkedin || personalInfo.website) && (
                  <Text style={styles.separator}>•</Text>
                )}
              </>
            )}
            {personalInfo.phone && (
              <>
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
                {(personalInfo.location || personalInfo.linkedin || personalInfo.website) && (
                  <Text style={styles.separator}>•</Text>
                )}
              </>
            )}
            {personalInfo.location && (
              <>
                <Text style={styles.contactItem}>{personalInfo.location}</Text>
                {(personalInfo.linkedin || personalInfo.website) && (
                  <Text style={styles.separator}>•</Text>
                )}
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <Link src={personalInfo.linkedin} style={[styles.contactItem, styles.link]}>
                  {personalInfo.linkedin}
                </Link>
                {personalInfo.website && <Text style={styles.separator}>•</Text>}
              </>
            )}
            {personalInfo.website && (
              <Link src={personalInfo.website} style={[styles.contactItem, styles.link]}>
                {personalInfo.website}
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.summary}>
            <Text>{personalInfo.summary}</Text>
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
                  {exp.company}{exp.location && ` • ${exp.location}`}
                </Text>
                {exp.description.some(d => d.trim()) && (
                  <View style={styles.description}>
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
              <View key={project.id} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Text style={styles.dateRange}>{project.date}</Text>
                </View>
                {project.description && (
                  <Text style={styles.projectDescription}>{project.description}</Text>
                )}
                <View style={styles.projectTech}>
                  {project.technologies.length > 0 && (
                    <Text>
                      <Text style={styles.techLabel}>Tech:</Text> {project.technologies.join(', ')}
                    </Text>
                  )}
                  {project.url && project.technologies.length > 0 && <Text> • </Text>}
                  {project.url && (
                    <Link src={project.url} style={styles.link}>{project.url}</Link>
                  )}
                </View>
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
                  {edu.school}{edu.location && ` • ${edu.location}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                  {edu.percentage && ` • Percentage: ${edu.percentage}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillsContainer}>
              {Object.entries(groupedSkills).map(([category, skillList]) => (
                <View key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>{category}:</Text>
                  <Text style={styles.skillList}>{skillList.join(' • ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certificationItem}>
                <View style={styles.certificationInfo}>
                  <Text>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationIssuer}> • {cert.issuer}</Text>
                    {cert.url && (
                      <Text style={styles.certificationIssuer}> • <Link src={cert.url} style={styles.link}>{cert.url}</Link></Text>
                    )}
                  </Text>
                </View>
                <Text style={styles.dateRange}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LANGUAGES</Text>
            <View style={styles.languagesContainer}>
              {languages.map((lang) => (
                <Text key={lang.id} style={styles.languageItem}>
                  <Text style={styles.languageName}>{lang.name}:</Text>{' '}
                  <Text style={styles.languageProficiency}>{lang.proficiency}</Text>
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

