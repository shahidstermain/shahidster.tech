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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col justify-between hover:border-primary/40 transition-all duration-300 shadow-card"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mb-4">
                <cert.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-base text-foreground mb-1 leading-snug">{cert.title}</h3>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
            </div>
            
            <div className="pt-4 border-t border-border/40 mt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary/60 text-secondary-foreground border border-border/40">
                  {cert.level}
                </span>
                <span className={`text-[11px] font-mono font-medium ${cert.status === "Expired" ? "text-amber-500/80" : "text-emerald-400"}`}>
                  {cert.status}
                </span>
              </div>
              {cert.credentialId && (
                <p className="text-[11px] text-muted-foreground/60 mt-2 font-mono truncate">
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
          className="p-6 sm:p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex items-center gap-6 md:col-span-2 hover:border-primary/40 transition-all duration-300 shadow-card"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="text-xs font-mono text-primary font-medium uppercase tracking-wider block mb-1">Degree & Alma Mater</span>
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-foreground">{education.degree}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {education.institution} · {education.year}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 sm:p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 shadow-card"
        >
          <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Spoken Languages
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="font-medium">English</span>
              <span className="text-xs text-muted-foreground font-mono ml-auto">Professional</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              <span className="font-medium">Hindi</span>
              <span className="text-xs text-muted-foreground font-mono ml-auto">Native/Fluent</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Section>
  );
};