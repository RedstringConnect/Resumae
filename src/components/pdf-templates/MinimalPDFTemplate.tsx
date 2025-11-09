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
    padding: '32 40',
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'light',
    marginBottom: 8,
    color: '#000000',
    letterSpacing: -0.5,
  },
  contactInfo: {
    fontSize: 10.5,
    color: '#666666',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contactItem: {
    marginRight: 8,
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
  },
  summary: {
    marginBottom: 24,
    lineHeight: 1.6,
    color: '#333333',
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'semibold',
    color: '#000000',
    flex: 1,
  },
  dateRange: {
    fontSize: 10,
    color: '#999999',
  },
  companyInfo: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },
  description: {
    marginTop: 6,
  },
  bulletPoint: {
    marginBottom: 3,
    paddingLeft: 12,
    lineHeight: 1.5,
    color: '#444444',
    fontSize: 11,
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  skillRow: {
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#000000',
  },
  skillList: {
    color: '#444444',
  },
});

export default function MinimalPDFTemplate({ data }: TemplateProps) {
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
        {/* Header - Ultra Minimal */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={[styles.contactItem, styles.link]}>
                {personalInfo.linkedin}
              </Link>
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
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </Text>
                </View>
                <Text style={styles.companyInfo}>
                  {exp.company} · {exp.location}
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
                    {project.technologies.join(', ')}
                  </Text>
                )}
                {project.url && (
                  <Link src={project.url} style={[styles.bulletPoint, styles.link]}>
                    {project.url}
                  </Link>
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
                    {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                  </Text>
                </View>
                <Text style={styles.companyInfo}>
                  {edu.school} · {edu.location}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                  {edu.percentage && ` · ${edu.percentage}`}
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
                <Text key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>{category}: </Text>
                  <Text style={styles.skillList}>{skillList.join(', ')}</Text>
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.positionTitle}>{cert.name}</Text>
                  <Text style={styles.dateRange}>{cert.date}</Text>
                </View>
                <Text style={styles.companyInfo}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LANGUAGES</Text>
            <Text style={styles.skillRow}>
              {languages.map((lang, idx) => (
                <Text key={lang.id}>
                  <Text style={styles.skillCategory}>{lang.name}: </Text>
                  <Text style={styles.skillList}>{lang.proficiency}</Text>
                  {idx < languages.length - 1 && <Text> · </Text>}
                </Text>
              ))}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

