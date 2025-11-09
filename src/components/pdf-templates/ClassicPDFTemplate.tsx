import { Document, Page, Text, View, StyleSheet, Link, Font } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

Font.register({
  family: 'Times-Roman',
  fonts: [
    { src: 'Times-Roman' },
    { src: 'Times-Bold', fontWeight: 'bold' },
  ],
});

interface TemplateProps {
  data: ResumeData;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#000000',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '2px solid #000000',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contactInfo: {
    fontSize: 11,
    color: '#333333',
    lineHeight: 1.6,
  },
  contactLinks: {
    fontSize: 10,
    color: '#555555',
    marginTop: 4,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
  },
  summary: {
    marginBottom: 20,
    lineHeight: 1.6,
    color: '#222222',
    fontSize: 11,
    textAlign: 'justify',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    borderBottom: '1.5px solid #000000',
    paddingBottom: 6,
  },
  experienceItem: {
    marginBottom: 14,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  positionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  dateRange: {
    fontSize: 11,
    color: '#555555',
    fontStyle: 'italic',
  },
  companyInfo: {
    fontSize: 11,
    color: '#444444',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  description: {
    marginTop: 4,
  },
  bulletPoint: {
    marginBottom: 4,
    paddingLeft: 12,
    lineHeight: 1.5,
    color: '#333333',
    fontSize: 11,
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  skillRow: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#000000',
  },
  skillList: {
    color: '#333333',
  },
});

export default function ClassicPDFTemplate({ data }: TemplateProps) {
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
        {/* Header - Classic Centered Style */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          <View style={styles.contactInfo}>
            <Text>
              {personalInfo.email && <Text>{personalInfo.email}</Text>}
              {personalInfo.email && personalInfo.phone && <Text> | </Text>}
              {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
              {(personalInfo.email || personalInfo.phone) && personalInfo.location && <Text> | </Text>}
              {personalInfo.location && <Text>{personalInfo.location}</Text>}
            </Text>
          </View>
          {(personalInfo.linkedin || personalInfo.website) && (
            <View style={styles.contactLinks}>
              <Text>
                {personalInfo.linkedin && <Link src={personalInfo.linkedin} style={styles.link}>{personalInfo.linkedin}</Link>}
                {personalInfo.linkedin && personalInfo.website && <Text> | </Text>}
                {personalInfo.website && <Link src={personalInfo.website} style={styles.link}>{personalInfo.website}</Link>}
              </Text>
            </View>
          )}
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
                  {exp.company}{exp.location && `, ${exp.location}`}
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
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
                {project.url && (
                  <Text style={styles.bulletPoint}>
                    <Link src={project.url} style={styles.link}>{project.url}</Link>
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
                  {edu.school}{edu.location && `, ${edu.location}`}
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
                {cert.url && (
                  <Text style={styles.bulletPoint}>
                    <Link src={cert.url} style={styles.link}>{cert.url}</Link>
                  </Text>
                )}
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
                  {idx < languages.length - 1 && <Text> • </Text>}
                </Text>
              ))}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

