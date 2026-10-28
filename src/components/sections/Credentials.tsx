import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { GraduationCap, Shield, Cloud } from "lucide-react";

const certifications = [
  {
    icon: Cloud,
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    level: "Associate",
    credentialId: "XZGBNQ6C524E169B",
    status: "Expired" as const,
  },
  {
    icon: Cloud,
    title: "Azure Fundamentals",
    issuer: "Microsoft",
    level: "AZ-900",
    credentialId: "H994-0342",
    status: "Verified" as const,
  },
  {
    icon: Shield,
    title: "Web Application Penetration Testing",
    issuer: "Security Certification",
    level: "Professional",
    credentialId: "C-2c43e6116-1d0c451",
    status: "Verified" as const,
  },
  {
    icon: Shield,
    title: "Introduction to Cyber Security for Business",
    issuer: "Industry Certification",
    level: "Foundational",
    credentialId: "SHQ7RPSR9GTM",
    status: "Verified" as const,
  },
];

const education = {
  degree: "BCA — Cloud Technology & Information Security",
  institution: "Jain University, Bengaluru",
  year: "2020",
};

export const Credentials = () => {
  return (
    <Section id="credentials">
      <SectionHeader
        label="Credentials"
        title="Proof of expertise"
        description="Certifications and education that back up real-world experience."
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card-elevated p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <cert.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold truncate">{cert.title}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {cert.level}
                </span>
                <span className={`text-xs ${cert.status === "Expired" ? "text-amber-500" : "text-emerald-500"}`}>
                  {cert.status}
                </span>
              </div>
              {cert.credentialId && (
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono truncate">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Education + Languages row */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-elevated p-8 flex items-center gap-6 md:col-span-2"
        >
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold">{education.degree}</h3>
            <p className="text-muted-foreground">
              {education.institution} · {education.year}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-elevated p-8"
        >
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Languages
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-medium">English</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
              <span className="font-medium">Hindi</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Section>
  );
};