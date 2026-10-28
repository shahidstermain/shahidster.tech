import { motion } from "framer-motion";
import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgressBar() {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-[60]">
      <motion.div
        className="h-full bg-gradient-to-r from-primary via-primary to-primary/70"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
      />
    </div>
  );
}
