import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, FileDown, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LiveTerminal } from "@/components/ui/LiveTerminal";
import shahidPhoto from "@/assets/shahid-moosa.jpg";
import singlestoreLogo from "@/assets/logos/singlestore.svg";

// SingleStore brand color
const SINGLESTORE_PURPLE = "#AA8CFF";

export const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden py-20">
      {/* Ambient glow effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
      
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <div className="order-2 lg:order-1">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Active now</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] mb-6"
            >
              I keep databases alive
              <br />
              <span className="text-gradient">at scale.</span>
            </motion.h1>

            {/* Subheading with SingleStore branding */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mb-4">
                Cloud Database Support Engineer at
              </p>
              <a 
                href="https://www.singlestore.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-105 group"
                style={{
                  backgroundColor: "rgba(170, 140, 255, 0.1)",
                  borderColor: "rgba(170, 140, 255, 0.3)",
                  boxShadow: "0 0 20px rgba(170, 140, 255, 0.15)",
                }}
              >
                <img src={singlestoreLogo} alt="SingleStore" className="w-6 h-6" loading="lazy" />
                <span 
                  className="font-semibold text-lg"
                  style={{ color: SINGLESTORE_PURPLE }}
                >
                  SingleStore
                </span>
              </a>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed mt-4">
                I troubleshoot distributed databases across cloud environments with a focus on incident response, root-cause analysis, and performance tuning.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button
                size="lg"
                className="font-medium px-8 h-12 text-base gap-2"
                asChild
              >
                <Link to="/course">
                  <GraduationCap className="w-4 h-4" />
                  Start Database 201
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="font-medium px-8 h-12 text-base"
                onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Let's talk
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="font-medium px-8 h-12 text-base"
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See my work
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="font-medium px-8 h-12 text-base gap-2"
                asChild
              >
                <a href="/resume.pdf" download="Shahid_Moosa_Resume.pdf">
                  <FileDown className="w-4 h-4" />
                  Resume
                </a>
              </Button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4 mb-8"
            >
              <a
                href="https://github.com/shahidmoosa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/shahidmoosa"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:connect2shahidmoosa@gmail.com"
                className="p-3 rounded-full border border-border hover:border-primary hover:text-primary transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Impact stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-3 max-w-sm"
            >
              {[
                { value: "5+ yrs", label: "Support experience" },
                { value: "Tier-2/3", label: "Incident support" },
                { value: "AWS + Azure", label: "Cloud platforms" },
                { value: "SQL + NoSQL", label: "Database focus" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-3 rounded-lg border border-border/50 bg-card/40"
                >
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Photo and Terminal */}
          <div className="order-1 lg:order-2 flex flex-col items-center gap-8">
            {/* Profile photo with glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              {/* Outer glow ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-full blur-md opacity-60 animate-pulse" />
              
              {/* Photo container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary/30">
                <img
                  src={shahidPhoto}
                  alt="Shahid Moosa"
                  className="w-full h-full object-cover"
                  width={256}
                  height={256}
                  fetchpriority="high"
                  decoding="async"
                />
              </div>
              
              {/* Active indicator */}
              <div className="absolute bottom-4 right-4 w-5 h-5 bg-emerald-500 rounded-full border-4 border-background animate-pulse" />
            </motion.div>

            {/* Live Terminal */}
            <LiveTerminal />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};
