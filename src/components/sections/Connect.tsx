import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Github, Linkedin, FileText, Check, Copy } from "lucide-react";

export const Connect = () => {
  const [copied, setCopied] = useState(false);
  const email = "connect2shahidmoosa@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="connect" className="relative">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-primary font-mono text-xs tracking-widest uppercase mb-4 block font-semibold">
            Connect
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight text-foreground">
            Let's solve hard problems{" "}
            <span className="text-gradient">together.</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Whether you're troubleshooting a distributed database outage, planning a major cloud migration, 
            or want to talk database internals — my inbox is always open.
          </p>
        </motion.div>

        {/* Primary CTA with Copy & Mail Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-10"
        >
          <a href={`mailto:${email}`}>
            <Button size="lg" className="font-medium px-6 h-12 text-sm gap-2 group">
              <Mail className="w-4 h-4" />
              <span>Send an Email</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <Button
            variant="outline"
            size="lg"
            onClick={handleCopy}
            className="font-medium px-6 h-12 text-sm gap-2 border-border/60 bg-card/40 hover:bg-card/70"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-muted-foreground" />
                <span>Copy {email}</span>
              </>
            )}
          </Button>
        </motion.div>

        {/* Secondary links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <a
            href="https://github.com/shahidmoosa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/shahidmoosa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            download="Shahid_Moosa_Resume.pdf"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors link-underline"
          >
            <FileText className="w-4 h-4" />
            Download Resume
          </a>
        </motion.div>
      </div>
    </Section>
  );
};