import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span>by Shahid Moosa</span>
          </div>
          <div>
            © {new Date().getFullYear()} · All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};