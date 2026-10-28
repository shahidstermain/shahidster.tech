import { useEffect } from "react";
import { generateSitemap } from "@/lib/sitemap";

export default function Sitemap() {
  useEffect(() => {
    // Generate and display XML
    const sitemap = generateSitemap();
    
    // Create a blob and trigger download or display
    const blob = new Blob([sitemap], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    
    // Redirect to the blob URL to display XML
    window.location.href = url;
    
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground">Generating sitemap...</p>
      </div>
    </div>
  );
}
