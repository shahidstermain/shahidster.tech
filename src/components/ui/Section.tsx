import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const Section = ({ children, className, id }: SectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ 
        type: "tween",
        ease: "easeOut",
        duration: 0.5,
      }}
      className={cn("py-24 md:py-32 gpu-accelerated", className)}
    >
      <div className="section-container">
        {children}
      </div>
    </motion.section>
  );
};

export const SectionHeader = ({ 
  label, 
  title, 
  description 
}: { 
  label?: string; 
  title: string; 
  description?: string;
}) => {
  return (
    <div className="mb-16 max-w-2xl">
      {label && (
        <motion.span 
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block"
        >
          {label}
        </motion.span>
      )}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 leading-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className="text-muted-foreground text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};
