import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowUpRight, Calendar, Sparkles } from "lucide-react";
import singlestoreLogo from "@/assets/logos/singlestore.svg";
import awsLogo from "@/assets/logos/aws.png";
import infosysLogo from "@/assets/logos/infosys.svg";

const experiences = [
  {
    company: "SingleStore",
    logo: singlestoreLogo,
    role: "Database Cloud Support Engineer",
    period: "Jan 2024 — Present",
    current: true,
    description: "Delivering Tier-2/3 support for distributed columnar clusters across cloud-native (AWS, Azure, GCP) and hybrid SingleStore deployments.",
    impact: [
      "Diagnosed high-severity replication, ingest pipeline, and node health degradation across multi-node clusters",
      "Analyzed slow query plans, memory pressure (OOMs), and disk spill events to optimize production throughput",
      "Led high-severity incident bridges aligned with ITIL practices, reducing mean-time-to-resolution (MTTR)",
    ],
    skills: ["SingleStore", "Distributed SQL", "Linux", "AWS", "Python", "Performance Tuning"],
  },
  {
    company: "Amazon Web Services",
    logo: awsLogo,
    role: "Cloud Support Associate",
    period: "Jul 2022 — Jan 2024",
    current: false,
    description: "Troubleshot Aurora PostgreSQL, RDS, and AWS DMS replication and failover events under complex IAM and VPC network constraints.",
    impact: [
      "Resolved mission-critical Aurora PostgreSQL and RDS replication lag, read-replica failovers, and storage bottlenecks",
      "Investigated latency spikes, cross-region replication failures, and point-in-time snapshot restore operations",
      "Authored widely referenced internal KBAs on disaster recovery planning, query optimization, and IAM security",
    ],
    skills: ["AWS RDS", "Aurora", "PostgreSQL", "DMS", "IAM", "CloudWatch"],
  },
  {
    company: "Infosys",
    logo: infosysLogo,
    role: "Senior System Associate",
    period: "Apr 2020 — Jul 2022",
    current: false,
    description: "Administered enterprise infrastructure and systems automation for 100+ business users.",
    impact: [
      "Managed system configurations and updates using SCCM, PowerShell, and automated deployment scripts",
      "Completed rigorous internal training in Linux kernel fundamentals, network protocols, and Python automation",
      "Enforced document control and compliance aligned with enterprise security standards",
    ],
    skills: ["SCCM", "Windows Server", "Linux", "PowerShell", "Networking"],
  },
];

export const Work = () => {
  return (
    <Section id="work">
      <SectionHeader
        label="Experience"
        title="Where I've made impact"
        description="A track record of stabilizing distributed systems and solving high-stakes outages in enterprise production environments."
      />

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <motion.article
            key={exp.company}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="card-elevated p-6 md:p-8 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 group"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
              <div className="flex items-start gap-4">
                {/* Clean monochrome logo container */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-border/60 flex items-center justify-center shrink-0 p-2.5 group-hover:border-primary/40 transition-colors">
                  <img 
                    src={exp.logo} 
                    alt={`${exp.company} logo`}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {exp.company}
                    </h3>
                    {exp.current && (
                      <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Current Role
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">
                    {exp.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground shrink-0 md:text-right">
                <Calendar className="w-3.5 h-3.5 text-primary/70" />
                <span>{exp.period}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {exp.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" /> Key Impact
              </h4>
              <ul className="space-y-2">
                {exp.impact.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
              {exp.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-mono rounded-md bg-secondary/50 text-secondary-foreground border border-border/40 group-hover:border-primary/20 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
};