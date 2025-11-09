import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '../../types';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Courier',
    fontSize: 10,
    color: '#1f2937',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    border: '2px solid #1e293b',
  },
  terminalPrompt: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 10,
  },
  promptGreen: {
    color: '#22c55e',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#10b981',
    letterSpacing: -0.5,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 10,
    color: '#94a3b8',
  },
  contactItem: {
    marginRight: 12,
  },
  contactLabel: {
    color: '#38bdf8',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: '1px solid #e2e8f0',
  },
  sectionPrompt: {
    fontSize: 9,
    color: '#22c55e',
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.6,
    marginBottom: 16,
    fontFamily: 'Courier',
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  positionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0ea5e9',
    flex: 1,
  },
  dateRange: {
    fontSize: 9,
    color: '#64748b',
  },
  companyInfo: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 5,
  },
  bulletPoint: {
    marginBottom: 3,
    paddingLeft: 12,
    lineHeight: 1.5,
    color: '#334155',
    fontSize: 9.5,
  },
  skillsContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  skillRow: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  skillCategory: {
    color: '#0ea5e9',
    marginRight: 4,
  },
  skillList: {
    color: '#475569',
  },
  codeBlock: {
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 4,
    border: '1px solid #cbd5e1',
    marginTop: 4,
  },
  link: {
    color: '#0ea5e9',
    textDecoration: 'none',
  },
});

export default function TechnicalPDFTemplate({ data }: { data: ResumeData }) {
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
        {/* Header with Terminal Style */}
        <View style={styles.header}>
          <View style={styles.terminalPrompt}>
            <Text>
              <Text style={styles.promptGreen}>~/portfolio/resume</Text>
              <Text> $ cat personal_info.txt</Text>
            </Text>
          </View>
          <Text style={styles.name}>{personalInfo.fullName || '> Your_Name'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>email:</Text> {personalInfo.email}
              </Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>phone:</Text> {personalInfo.phone}
              </Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactItem}>
                <Text style={styles.contactLabel}>location:</Text> {personalInfo.location}
              </Text>
            )}
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
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>cat summary.md</Text>
            </View>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>ls work_experience/</Text>
            </View>
            {workExperience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.positionTitle}>{exp.position}</Text>
                  <Text style={styles.dateRange}>
                    [{exp.startDate} - {exp.current ? 'Present' : exp.endDate}]
                  </Text>
                </View>
                <Text style={styles.companyInfo}>
                  @ {exp.company} | {exp.location}
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

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>cat skills.json</Text>
            </View>
            <View style={styles.skillsContainer}>
              {Object.entries(groupedSkills).map(([category, skillList]) => (
                <Text key={category} style={styles.skillRow}>
                  <Text style={styles.skillCategory}>"{category}":</Text>
                  <Text style={styles.skillList}> [{skillList.join(', ')}]</Text>
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>ls projects/</Text>
            </View>
            {projects.map((project) => (
              <View key={project.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.positionTitle}>{project.name}</Text>
                  <Text style={styles.dateRange}>[{project.date}]</Text>
                </View>
                {project.description && (
                  <Text style={styles.companyInfo}>{project.description}</Text>
                )}
                {project.technologies.length > 0 && (
                  <Text style={styles.bulletPoint}>
                    Stack: {project.technologies.join(', ')}
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>cat education.log</Text>
            </View>
            {education.map((edu) => (
              <View key={edu.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.positionTitle}>
                    {edu.degree}{edu.field && ` in ${edu.field}`}
                  </Text>
                  <Text style={styles.dateRange}>
                    [{edu.startDate} - {edu.current ? 'Present' : edu.endDate}]
                  </Text>
                </View>
                <Text style={styles.companyInfo}>
                  @ {edu.school} | {edu.location}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>ls certificates/</Text>
            </View>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.experienceItem}>
                <Text style={styles.positionTitle}>{cert.name}</Text>
                <Text style={styles.companyInfo}>
                  @ {cert.issuer} | {cert.date}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionPrompt}>$</Text>
              <Text style={styles.sectionTitle}>cat languages.txt</Text>
            </View>
            <Text style={styles.skillRow}>
              {languages.map((lang, idx) => (
                <Text key={lang.id}>
                  <Text style={styles.skillCategory}>{lang.name}:</Text>
                  <Text style={styles.skillList}> {lang.proficiency}</Text>
                  {idx < languages.length - 1 && <Text> | </Text>}
                </Text>
              ))}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

