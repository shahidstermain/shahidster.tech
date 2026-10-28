import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { Credentials } from "@/components/sections/Credentials";
import { Writing } from "@/components/sections/Writing";
import { Now } from "@/components/sections/Now";
import { Connect } from "@/components/sections/Connect";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Shahid Moosa",
      "url": "https://shahidster.tech",
      "jobTitle": "Cloud Database Support Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "SingleStore",
        "url": "https://www.singlestore.com"
      },
      "sameAs": [
        "https://github.com/shahidmoosa",
        "https://linkedin.com/in/shahidmoosa",
        "https://twitter.com/shahidster_"
      ],
      "description": "Distributed Systems Engineer specializing in cloud databases, high-scale query optimization, and reliable infrastructure.",
      "image": "https://shahidster.tech/assets/shahid-moosa.jpg"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundGlow />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Philosophy />
        <Skills />
        <Work />
        <Credentials />
        <Writing />
        <Now />
        <Connect />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
