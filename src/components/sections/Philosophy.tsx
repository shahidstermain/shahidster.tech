import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Database, Zap, Shield, Users } from "lucide-react";

const principles = [
  {
    icon: Database,
    title: "Data is the product",
    description: "Every query matters. I treat each database interaction as if revenue depends on it—because it usually does.",
  },
  {
    icon: Zap,
    title: "Fast debugging saves companies",
    description: "In distributed systems, every minute of downtime costs. I've developed intuition for finding root causes fast.",
  },
  {
    icon: Shield,
    title: "Reliability over features",
    description: "I'd rather ship something boring that works than something clever that fails at 3 AM.",
  },
  {
    icon: Users,
    title: "Teach, don't just fix",
    description: "The best support interaction leaves the engineer more capable than before. Documentation is a force multiplier.",
  },
];

export const Philosophy = () => {
  return (
    <Section id="philosophy" className="relative">
      <SectionHeader
        label="Philosophy"
        title="How I think about systems"
        description="After years of debugging production incidents across AWS, SingleStore, and countless customer environments, these principles guide my work."
      />

      <div className="grid md:grid-cols-2 gap-6">
        {principles.map((principle, index) => (
          <motion.div
            key={principle.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card-elevated p-8 group hover:border-primary/30 transition-colors duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <principle.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-3">
              {principle.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {principle.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};