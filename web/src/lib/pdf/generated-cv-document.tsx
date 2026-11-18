
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

const fontsDirectory = path.join(
  process.cwd(),
  "node_modules",
  "@fontsource",
  "noto-sans",
  "files"
);

Font.register({
  family: "Noto Sans",
  fonts: [
    {
      src: path.join(
        fontsDirectory,
        "noto-sans-latin-ext-400-normal.woff"
      ),
      fontWeight: 400,
    },
    {
      src: path.join(
        fontsDirectory,
        "noto-sans-latin-ext-700-normal.woff"
      ),
      fontWeight: 700,
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Noto Sans",
    fontSize: 9.5,
    color: "#263747",
    paddingTop: 42,
    paddingBottom: 48,
    paddingHorizontal: 46,
    lineHeight: 1.45,
  },
  header: {
    marginBottom: 19,
    borderBottomWidth: 1.3,
    borderBottomColor: "#cfdae4",
    paddingBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    color: "#17344f",
    marginBottom: 6,
  },
  contact: {
    fontSize: 8.7,
    color: "#526778",
    lineHeight: 1.55,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10.2,
    fontWeight: 700,
    color: "#17344f",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "#d3dee8",
  },
  paragraph: {
    lineHeight: 1.55,
  },
  item: {
    marginBottom: 12,
  },
  itemTitle: {
    fontWeight: 700,
    fontSize: 10,
    color: "#1c354c",
    marginBottom: 2,
  },
  company: {
    fontSize: 9.2,
    color: "#324b61",
    marginBottom: 1,
  },
  secondary: {
    color: "#64788b",
    fontSize: 8.3,
    marginBottom: 4,
  },
  description: {
    lineHeight: 1.5,
    marginTop: 3,
  },
  skill: {
    marginBottom: 4,
    lineHeight: 1.45,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 46,
    right: 46,
    borderTopWidth: 0.5,
    borderTopColor: "#e1e8ef",
    paddingTop: 6,
    color: "#8293a1",
    fontSize: 7.5,
    textAlign: "right",
  },
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
        experience: "WORK EXPERIENCE",
        education: "EDUCATION",
        skills: "KEY SKILLS",
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
    personal.email,
    personal.phone,
    personal.city,
  ]
    .filter(Boolean)
    .join("   |   ");

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
            <Text style={styles.sectionTitle} minPresenceAhead={50}>
              {labels.summary}
            </Text>
            <Text style={styles.paragraph}>
              {content.professional_summary}
            </Text>
          </View>
        ) : null}

        {content.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={50}>
              {labels.experience}
            </Text>
            {content.experiences.map((item, index) => (
              <View key={index} style={styles.item}>
                <View wrap={false}>
                  <Text style={styles.itemTitle}>
                    {item.jobTitle}
                  </Text>
                  <Text style={styles.company}>{item.company}</Text>
                  <Text style={styles.secondary}>
                    {item.startDate} –{" "}
                    {item.current
                      ? labels.present
                      : item.endDate}
                  </Text>
                </View>
                {item.description ? (
                  <Text style={styles.description}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {content.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={50}>
              {labels.education}
            </Text>
            {content.education.map((item, index) => (
              <View key={index} style={styles.item} wrap={false}>
                <Text style={styles.itemTitle}>
                  {item.institution}
                </Text>
                <Text style={styles.company}>{item.degree}</Text>
                <Text style={styles.secondary}>
                  {item.startDate} –{" "}
                  {item.ongoing
                    ? labels.present
                    : item.endDate}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {content.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={50}>
              {labels.skills}
            </Text>
            <Text style={styles.paragraph}>{content.skills.join("  |  ")}</Text>
          </View>
        ) : null}

        {content.languages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle} minPresenceAhead={50}>
              {labels.languages}
            </Text>
            {content.languages.map((language, index) => (
              <Text key={index} style={styles.skill}>
                {language.name} — {language.level}
              </Text>
            ))}
          </View>
        ) : null}
        <Text
          style={styles.footer}
          fixed
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
