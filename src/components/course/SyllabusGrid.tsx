import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowUpRight, FlaskConical } from "lucide-react";
import { MODULES } from "@/lib/course";

export function SyllabusGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {MODULES.map((module, i) => (
        <motion.div
          key={module.slug}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
        >
          <Link
            to={`/blog/${module.slug}`}
            className="group flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/40 transition-colors h-full"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-mono text-sm font-semibold text-primary">
                {String(module.number).padStart(2, "0")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-medium text-primary/80">{module.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.readTime}
                </span>
                {module.hasProLab && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-400/90">
                    <FlaskConical className="w-3 h-3" />
                    Pro lab
                  </span>
                )}
              </div>
              <h3 className="font-medium leading-snug group-hover:text-primary transition-colors">
                {module.title}
              </h3>
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
