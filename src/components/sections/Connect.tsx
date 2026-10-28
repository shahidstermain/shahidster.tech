import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Github, Linkedin, FileText } from "lucide-react";

export const Connect = () => {
  return (
    <Section id="connect" className="relative">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Connect
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
            Let's solve hard problems
            <br />
            <span className="text-gradient">together.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you're debugging a production incident, planning a database migration, 
            or just want to talk distributed systems — I'm always up for a conversation.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <a href="mailto:connect2shahidmoosa@gmail.com">
            <Button size="lg" className="font-medium px-8 h-14 text-base group">
              <Mail className="w-5 h-5 mr-2" />
              connect2shahidmoosa@gmail.com
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>

        {/* Secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href="https://github.com/shahidmoosa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/shahidmoosa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors link-underline"
          >
            <FileText className="w-4 h-4" />
            Resume
          </a>
        </motion.div>
      </div>
    </Section>
  );
};