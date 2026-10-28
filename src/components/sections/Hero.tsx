import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Github, Linkedin, Mail, FileDown, GraduationCap, MapPin, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiveTerminal } from "@/components/ui/LiveTerminal";
import singlestoreLogo from "@/assets/logos/singlestore.svg";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-24 md:py-32">
      {/* Restrained single-accent ambient lighting */}
      <div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)"
        }}
      />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Left Column — Editorial Narrative (7 cols) */}
          <div className="lg:col-span-7">
            {/* Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Cloud Database Support Engineer
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="font-heading text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] mb-6 text-foreground"
            >
              I keep distributed databases{" "}
              <span className="text-gradient">alive at scale.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mb-8"
            >
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Database Cloud Support Engineer at{" "}
                <a
                  href="https://www.singlestore.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium inline-flex items-center gap-1.5 hover:text-primary transition-colors underline decoration-border/80 underline-offset-4"
                >
                  <img src={singlestoreLogo} alt="SingleStore" className="w-4 h-4 inline-block" />
                  SingleStore
                </a>
                . Troubleshooting distributed columnar clusters, query plan bottlenecks, and high-severity incidents across AWS, Azure, and hybrid deployments.
              </p>
            </motion.div>

            {/* Focused 2-Tier CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <Button
                size="lg"
                className="font-medium px-6 h-12 text-sm gap-2"
                asChild
              >
                <Link to="/course">
                  <GraduationCap className="w-4 h-4" />
                  Start Database 201
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-medium px-6 h-12 text-sm gap-2 border-border/80 bg-card/30 hover:bg-card/70"
                asChild
              >
                <a href="/resume.pdf" download="Shahid_Moosa_Resume.pdf">
                  <FileDown className="w-4 h-4" />
                  Resume
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="font-medium px-4 h-12 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's talk
              </Button>
            </motion.div>

            {/* Impact Metrics (Strict 8px Spatial Grid) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl pt-6 border-t border-border/40"
            >
              {[
                { value: "5+ Yrs", label: "Production Support" },
                { value: "Tier-2/3", label: "Incident Escalations" },
                { value: "Distributed", label: "SingleStore & AWS" },
                { value: "15 Modules", label: "Free Database Course" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3.5 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm"
                >
                  <div className="text-base font-bold font-mono text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Bento Terminal & Profile Console (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Verified Profile Card with Prominent Headshot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-5 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md shadow-card hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                {/* Headshot with ambient glow matching the image halo */}
                <div className="relative shrink-0">
                  <div 
                    className="absolute -inset-1 rounded-2xl blur-md opacity-40 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 70%)"
                    }}
                  />
                  <img
                    src="/shahid-moosa.jpg"
                    alt="Shahid Moosa"
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-border/60 shadow-xl"
                    width={112}
                    height={112}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
                </div>

                {/* Profile Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-heading font-semibold text-lg text-foreground truncate">
                      Shahid Moosa
                    </h2>
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-medium mb-1 truncate">
                    Cloud Database Support Engineer
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5 text-primary/80 shrink-0" />
                    <span className="truncate">Bengaluru, India · SingleStore</span>
                  </div>

                  {/* Quick Social & Direct Contact Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href="https://github.com/shahidmoosa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-border/60 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://linkedin.com/in/shahidmoosa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-border/60 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="mailto:connect2shahidmoosa@gmail.com"
                      className="p-1.5 rounded-lg border border-border/60 bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md ml-auto">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Live Interactive Terminal */}
            <LiveTerminal />
          </div>
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-muted-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};
