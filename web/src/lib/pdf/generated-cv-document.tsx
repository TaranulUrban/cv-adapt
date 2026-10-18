
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
    fontSize: 9,
    color: "#202a35",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 40,
    lineHeight: 1.35,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: "#172334",
    marginBottom: 3,
  },
  contact: {
    fontSize: 8.5,
    color: "#475569",
  },
  section: {
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#172334",
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#cbd5e1",
  },
  paragraph: {
    lineHeight: 1.4,
  },
  item: {
    marginBottom: 6,
  },
  itemTitle: {
    fontWeight: 700,
    fontSize: 9.5,
  },
  secondary: {
    color: "#475569",
    fontSize: 8.5,
    marginBottom: 2,
  },
  description: {
    lineHeight: 1.35,
    marginTop: 2,
  },
  skill: {
    marginBottom: 2,
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
        summary: "Professional Summary",
        experience: "Work Experience",
        education: "Education",
        skills: "Skills",
        languages: "Languages",
        present: "Present",
      }
    : {
        summary: "Rezumat profesional",
        experience: "Experiență profesională",
        education: "Educație și studii",
        skills: "Competențe profesionale",
        languages: "Limbi străine",
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
            <Text style={styles.sectionTitle}>
              {labels.summary}
            </Text>
            <Text style={styles.paragraph}>
              {content.professional_summary}
            </Text>
          </View>
        ) : null}

        {content.experiences.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {labels.experience}
            </Text>
            {content.experiences.map((item, index) => (
              <View key={index} style={styles.item}>
                <View wrap={false}>
                  <Text style={styles.itemTitle}>
                    {item.jobTitle}
                  </Text>
                  <Text>{item.company}</Text>
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
            <Text style={styles.sectionTitle}>
              {labels.education}
            </Text>
            {content.education.map((item, index) => (
              <View key={index} style={styles.item} wrap={false}>
                <Text style={styles.itemTitle}>
                  {item.institution}
                </Text>
                <Text>{item.degree}</Text>
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
            <Text style={styles.sectionTitle}>
              {labels.skills}
            </Text>
            {content.skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        ) : null}

        {content.languages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {labels.languages}
            </Text>
            {content.languages.map((language, index) => (
              <Text key={index} style={styles.skill}>
                {language.name} — {language.level}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
