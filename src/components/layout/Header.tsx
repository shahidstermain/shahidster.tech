import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield, User as UserIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Philosophy", href: "#philosophy" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Writing", href: "#writing" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    if (!isHome) {
      navigate(`/${href}`);
      return;
    }
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-mono text-lg tracking-tight hover:text-primary transition-colors group"
            >
              <span className="text-primary">@</span>shahidster<span className="text-primary group-hover:animate-pulse">_</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
                >
                  {link.label}
                </button>
              ))}
              <Link
                to="/course"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Database 201
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </Link>
              )}
              {user ? (
                <Button size="sm" variant="ghost" onClick={() => signOut()}>
                  <LogOut className="w-4 h-4 mr-1" /> Sign out
                </Button>
              ) : (
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/auth">
                    <UserIcon className="w-4 h-4 mr-1" /> Sign in
                  </Link>
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => scrollToSection("#connect")}
              >
                Get in touch
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="section-container py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-2xl font-heading font-medium text-left hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Link
                  to="/course"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-heading font-medium text-left text-primary hover:text-primary/80 transition-colors"
                >
                  Database 201
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-heading font-medium text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" /> Admin
                  </Link>
                )}
                {user ? (
                  <button
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="text-2xl font-heading font-medium text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" /> Sign out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-heading font-medium text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <UserIcon className="w-5 h-5" /> Sign in
                  </Link>
                )}
                <Button
                  size="lg"
                  className="mt-4 w-full"
                  onClick={() => scrollToSection("#connect")}
                >
                  Get in touch
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};