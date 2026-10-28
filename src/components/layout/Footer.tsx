import { Link } from "react-router-dom";
import { Database, Rss, ArrowUp } from "lucide-react";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/40 py-12 bg-card/20 backdrop-blur-sm">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/30">
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="font-mono text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
            >
              <span className="text-primary">@</span>shahidster<span className="text-primary">_</span>
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              Cloud Database Support Engineer · SingleStore · Distributed Systems
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <a href="#philosophy" className="hover:text-foreground transition-colors">Philosophy</a>
            <a href="#skills" className="hover:text-foreground transition-colors">Skills</a>
            <a href="#work" className="hover:text-foreground transition-colors">Experience</a>
            <a href="#writing" className="hover:text-foreground transition-colors">Writing (15)</a>
            <Link to="/course" className="text-primary hover:underline font-medium">Database 201</Link>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1">
              <Rss className="w-3 h-3" /> RSS
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-lg border border-border/50 bg-card/40 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground pt-6 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Hostinger MariaDB 11.8 · Vite · React</span>
          </div>
          <div>
            © {new Date().getFullYear()} Shahid Moosa. Designed with @superdesign principles.
          </div>
        </div>
      </div>
    </footer>
  );
};