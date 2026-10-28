import { useState, useEffect, useCallback, useRef } from "react";

export function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  const updateProgress = useCallback(() => {
    // Skip if scroll position hasn't changed
    if (window.scrollY === lastScrollY.current) {
      rafRef.current = null;
      return;
    }
    
    lastScrollY.current = window.scrollY;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    setProgress(Math.min(100, Math.max(0, scrollPercent)));
    rafRef.current = null;
  }, []);

  const handleScroll = useCallback(() => {
    // Throttle using requestAnimationFrame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  }, [updateProgress]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, updateProgress]);

  return progress;
}
