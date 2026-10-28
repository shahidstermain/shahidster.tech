import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Sparkles, BookOpen, Code, Target, Music2, Fish, Cpu } from "lucide-react";

const nowItems = [
  {
    icon: Target,
    title: "Building expertise in HTAP systems",
    description: "Diving deep into hybrid transactional/analytical processing architectures and how they fail at scale.",
  },
  {
    icon: Code,
    title: "Writing technical content",
    description: "Sharing production learnings through detailed technical briefs and architectural deep-dives.",
  },
  {
    icon: BookOpen,
    title: "Exploring observability",
    description: "Improving distributed system debugging with better tracing, metrics, and alerting patterns.",
  },
];

const beyondWorkItems = [
  {
    icon: Music2,
    label: "DJing & Music Production",
  },
  {
    icon: Fish,
    label: "Fishing & Outdoor Adventures",
  },
  {
    icon: Cpu,
    label: "DIY Tech Projects",
  },
];

export const Now = () => {
  return (
    <Section id="now" className="relative">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
      
      <SectionHeader
        label="Now"
        title="What I'm focused on"
        description="A snapshot of my current interests and projects. Updated regularly."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {nowItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="card-elevated p-6 h-full hover:border-primary/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Beyond work */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 p-6 rounded-xl border border-border/50 bg-card/30"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Beyond the screen</p>
        <div className="flex flex-wrap gap-4">
          {beyondWorkItems.map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <item.icon className="w-4 h-4 text-primary/70 shrink-0" />
              {item.label}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Last updated */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <Sparkles className="w-4 h-4" />
        <span>Last updated: October 2026</span>
      </motion.div>
    </Section>
  );
};