import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowUpRight } from "lucide-react";
import singlestoreLogo from "@/assets/logos/singlestore.svg";
import awsLogo from "@/assets/logos/aws.png";
import infosysLogo from "@/assets/logos/infosys.svg";

// Brand colors for each company
const brandColors = {
  singlestore: {
    primary: "#AA8CFF", // Purple/lavender
    bg: "rgba(170, 140, 255, 0.1)",
    border: "rgba(170, 140, 255, 0.3)",
    glow: "rgba(170, 140, 255, 0.2)",
  },
  aws: {
    primary: "#FF9900", // AWS Orange
    bg: "rgba(255, 153, 0, 0.1)",
    border: "rgba(255, 153, 0, 0.3)",
    glow: "rgba(255, 153, 0, 0.2)",
  },
  infosys: {
    primary: "#007CC3", // Infosys Blue
    bg: "rgba(0, 124, 195, 0.1)",
    border: "rgba(0, 124, 195, 0.3)",
    glow: "rgba(0, 124, 195, 0.2)",
  },
};

const experiences = [
  {
    company: "SingleStore",
    brandKey: "singlestore" as const,
    logo: singlestoreLogo,
    role: "Database Cloud Support Engineer",
    period: "Jan 2024 — Present",
    current: true,
    description: "Delivered Tier-2/3 support for distributed columnar clusters across cloud-native and hybrid SingleStore deployments.",
    impact: [
      "Delivered Tier-2/3 support for distributed columnar clusters",
      "Diagnosed replication, ingest pipeline, node health, and performance issues",
      "Led high-severity incident management aligned with ITIL practices",
    ],
    skills: ["SingleStore", "Distributed SQL", "Linux", "AWS", "Python"],
  },
  {
    company: "Amazon Web Services",
    brandKey: "aws" as const,
    logo: awsLogo,
    role: "Cloud Support Associate",
    period: "Jul 2022 — Jan 2024",
    current: false,
    description: "Troubleshot Aurora PostgreSQL, RDS, and AWS DMS replication and failover events, including IAM and network constraints.",
    impact: [
      "Troubleshot Aurora PostgreSQL, RDS, DMS replication, and failover events",
      "Investigated latency, backup/restore, cross-region replication, and IAM/network constraints",
      "Authored internal KBAs for RDS, disaster recovery planning, and IAM configuration",
    ],
    skills: ["AWS RDS", "Aurora", "PostgreSQL", "DMS", "IAM"],
  },
  {
    company: "Infosys",
    brandKey: "infosys" as const,
    logo: infosysLogo,
    role: "Senior System Associate",
    period: "Apr 2020 — Jul 2022",
    current: false,
    description: "Administered SCCM and Windows infrastructure for enterprise environments supporting 100+ users.",
    impact: [
      "Administered SCCM and Windows infrastructure for 100+ users",
      "Completed structured training in Linux, PowerShell, Python, networking, and Windows administration",
      "Ensured secure document control aligned with EDF standards",
    ],
    skills: ["SCCM", "Windows Server", "Linux", "PowerShell"],
  },
];

export const Work = () => {
  return (
    <Section id="work">
      <SectionHeader
        label="Experience"
        title="Where I've made impact"
        description="A track record of solving hard problems in production environments."
      />

      <div className="space-y-8">
        {experiences.map((exp, index) => {
          const colors = brandColors[exp.brandKey];
          
          return (
            <motion.article
              key={exp.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative card-elevated p-8 md:p-10 group overflow-hidden"
              style={{
                borderColor: colors.border,
              }}
            >
              {/* Brand glow effect */}
              <div 
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50"
                style={{ backgroundColor: colors.primary }}
              />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    {/* Company logo with brand styling */}
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2.5 border transition-all duration-300 group-hover:scale-105"
                      style={{ 
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        boxShadow: `0 0 20px ${colors.glow}`,
                      }}
                    >
                      <img 
                        src={exp.logo} 
                        alt={`${exp.company} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold flex items-center gap-2">
                        <span style={{ color: exp.current ? colors.primary : undefined }}>
                          {exp.company}
                        </span>
                        {exp.current && (
                          <span 
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: colors.bg,
                              color: colors.primary,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            Current
                          </span>
                        )}
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p 
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {exp.role}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground md:text-right shrink-0">
                    {exp.period}
                  </span>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {exp.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
                    Key Impact
                  </h4>
                  <ul className="space-y-2">
                    {exp.impact.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-foreground/90">
                        <span 
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ backgroundColor: colors.primary }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-sm rounded-full transition-colors"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.primary,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
};