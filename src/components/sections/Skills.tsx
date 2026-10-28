import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Database, Cloud, Terminal, Activity } from "lucide-react";

const skillCategories = [
  {
    icon: Database,
    title: "Databases",
    description: "Distributed & relational engines",
    skills: ["SingleStore", "PostgreSQL", "Amazon Aurora", "Amazon RDS", "MySQL", "DynamoDB", "Distributed SQL", "Query Optimization"],
  },
  {
    icon: Cloud,
    title: "Cloud & Infrastructure",
    description: "Multi-cloud architecture & storage",
    skills: ["AWS (EC2, RDS, VPC, IAM)", "Microsoft Azure", "SingleStore Helios", "Linux Kernel", "Docker", "S3 Storage"],
  },
  {
    icon: Terminal,
    title: "Languages & Tooling",
    description: "Diagnostics, automation & telemetry",
    skills: ["Python", "Shell/Bash", "CloudWatch", "Datadog", "Wireshark", "PowerShell", "SCCM", "Git"],
  },
  {
    icon: Activity,
    title: "SRE & Operations",
    description: "Incident management & reliability",
    skills: ["High-Sev Incidents", "Root Cause Analysis (RCA)", "Disaster Recovery", "ITIL Framework", "Memory & OOM Tuning", "Replication Health"],
  },
];

export const Skills = () => {
  return (
    <Section id="skills" className="relative overflow-hidden">
      <SectionHeader
        label="Expertise"
        title="Technical arsenal"
        description="The distributed systems, cloud platforms, and diagnostic tooling I use daily to solve production issues."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.08 }}
            className="p-6 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm flex flex-col justify-between group hover:border-primary/40 transition-all duration-300 shadow-card"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <category.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                {category.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/40">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-md bg-secondary/50 text-foreground text-xs font-mono font-medium border border-border/40 hover:border-primary/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};