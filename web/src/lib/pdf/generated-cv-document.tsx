
import path from "node:path";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type PersonalInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
};

type Experience = {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

type Education = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
};

type Language = {
  name: string;
  level: string;
};

type GeneratedContent = {
  professional_summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
};

type Props = {
  personal: PersonalInfo;
  content: GeneratedContent;
  cvLanguage: string;
};

const fontsDirectory = path.join(process.cwd(), "src", "lib", "pdf", "fonts");

Font.register({
  family: "CV Serif",
  fonts: [
    {
      src: path.join(fontsDirectory, "LiberationSerif-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(fontsDirectory, "LiberationSerif-Bold.ttf"),
      fontWeight: 700,
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: "CV Serif",
    fontSize: 10,
    color: "#202020",
    paddingTop: 38,
    paddingBottom: 42,
    paddingHorizontal: 34,
    lineHeight: 1.22,
  },
  header: {
    marginBottom: 17,
    alignItems: "center",
  },
  name: {
    fontSize: 13.5,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },
  contact: {
    fontSize: 9.2,
    textAlign: "center",
  },
  section: {
    marginBottom: 13,
    paddingTop: 8,
    borderTopWidth: 0.8,
    borderTopColor: "#303030",
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1.1,
    width: "25%",
    paddingRight: 12,
  },
  paragraph: {
    lineHeight: 1.23,
  },
  item: {
    marginBottom: 11,
  },
  itemTitle: {
    fontWeight: 700,
    fontSize: 10,
    marginBottom: 2,
  },
  company: {
    fontSize: 9.5,
    marginBottom: 2,
  },
  secondary: {
    fontSize: 9,
    marginBottom: 3,
  },
  description: {
    lineHeight: 1.23,
    marginTop: 3,
  },
  skill: {
    marginBottom: 4,
    lineHeight: 1.23,
  },
  footer: {
    position: "absolute",
    bottom: 19,
    right: 34,
    fontSize: 8,
    textAlign: "right",
  },
  sectionRow: { flexDirection: "row" },
  sectionBody: { width: "75%" },
  experienceRow: { flexDirection: "row", marginBottom: 10 },
  dateColumn: { width: "25%", paddingRight: 12, fontSize: 9 },
  experienceBody: { width: "75%" },
  skillColumn: { width: "50%", paddingRight: 10, marginBottom: 4 },
});

export default function GeneratedCVDocument({
  personal,
  content,
  cvLanguage,
}: Props) {
  const en = cvLanguage === "en";

  const labels = en
    ? {
        summary: "PROFESSIONAL SUMMARY",
        experience: "EMPLOYMENT HISTORY",
        education: "EDUCATION",
        skills: "AREAS OF EXPERTISE",
        languages: "LANGUAGES",
        present: "Present",
      }
    : {
        summary: "REZUMAT PROFESIONAL",
        experience: "EXPERIENȚĂ PROFESIONALĂ",
        education: "EDUCAȚIE ȘI STUDII",
        skills: "COMPETENȚE PROFESIONALE",
        languages: "LIMBI STRĂINE",
        present: "Prezent",
      };

  const name =
    [personal.firstName, personal.lastName]
      .filter(Boolean)
      .join(" ") || "Curriculum Vitae";

  const contact = [
    personal.city,
    personal.phone,
    personal.email,
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <Document title={`CV - ${name}`} author="CV Adapt">
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          {contact ? (
            <Text style={styles.contact}>{contact}</Text>
          ) : null}
        </View>

        {content.professional_summary.trim() ? (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{labels.summary}</Text>
              <View style={styles.sectionBody}>
                <Text style={styles.paragraph}>{content.professional_summary}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {content.skills.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{labels.skills}</Text>
              <View style={[styles.sectionBody, { flexDirection: "row", flexWrap: "wrap" }]}>
                {content.skills.map((skill, index) => (
                  <Text key={index} style={styles.skillColumn}>{skill}</Text>
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {content.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { width: "100%", marginBottom: 9 }]} minPresenceAhead={50}>
              {labels.experience}
            </Text>
            {content.experiences.map((item, index) => (
              <View key={index} style={styles.experienceRow}>
                <Text style={styles.dateColumn}>
                    {item.startDate} –{" "}
                    {item.current
                      ? labels.present
                      : item.endDate}
                </Text>
                <View style={styles.experienceBody}>
                  <View wrap={false}>
                    <Text style={styles.itemTitle}>{item.company}</Text>
                    <Text style={styles.company}>{item.jobTitle}</Text>
                  </View>
                  {item.description ? (
                    <Text style={styles.description}>{item.description}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {content.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { width: "100%", marginBottom: 9 }]} minPresenceAhead={50}>
              {labels.education}
            </Text>
            {content.education.map((item, index) => (
              <View key={index} style={styles.experienceRow} wrap={false}>
                <Text style={styles.dateColumn}>
                  {item.startDate} –{" "}
                  {item.ongoing
                    ? labels.present
                    : item.endDate}
                </Text>
                <View style={styles.experienceBody}>
                  <Text style={styles.itemTitle}>{item.degree}</Text>
                  <Text style={styles.company}>{item.institution}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {content.languages.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{labels.languages}</Text>
              <View style={styles.sectionBody}>
                {content.languages.map((language, index) => (
                  <Text key={index} style={styles.skill}>
                    {language.name} — {language.level}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ) : null}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber }) => `Page ${pageNumber}`}
        />
      </Page>
    </Document>
  );
}
