import { useEffect } from "react";
import { generateRSSFeed } from "@/lib/rss";

export default function RSSFeed() {
  useEffect(() => {
    const rss = generateRSSFeed();
    
    // Create a blob and trigger download or display
    const blob = new Blob([rss], { type: "application/rss+xml" });
    const url = URL.createObjectURL(blob);
    
    // Redirect to the blob URL to display the RSS
    window.location.href = url;
    
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Generating RSS feed...</p>
    </div>
  );
}
