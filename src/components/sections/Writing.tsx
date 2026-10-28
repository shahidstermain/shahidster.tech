import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ArrowUpRight, Clock, Calendar, GraduationCap, Lock, Search, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";
import { COURSE_META } from "@/lib/course";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ArticleMeta {
  slug: string;
  is_premium: boolean;
  published: boolean;
}

export const Writing = () => {
  const { isAdmin, session } = useAuth();
  const [metaMap, setMetaMap] = useState<Record<string, ArticleMeta>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    // Fetch article statuses from Hostinger MariaDB
    fetch("/api/articles.php")
      .then((r) => r.json())
      .then((data) => {
        if (data?.articles) {
          const map: Record<string, ArticleMeta> = {};
          data.articles.forEach((a: ArticleMeta) => {
            map[a.slug] = a;
          });
          setMetaMap(map);
        }
      })
      .catch(() => setMetaMap({}));
  }, []);

  // Hide articles that have a DB row with published=false (unless viewer is admin)
  const isVisible = (slug: string) => {
    const meta = metaMap[slug];
    if (!meta) return true; // no DB row = legacy free article, visible
    return meta.published || isAdmin;
  };
  const isPremiumSlug = (slug: string) => !!metaMap[slug]?.is_premium;

  const visibleArticles = useMemo(() => articles.filter((a) => isVisible(a.slug)), [metaMap, isAdmin]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    visibleArticles.forEach((a) => cats.add(a.category));
    return ["All", ...Array.from(cats)];
  }, [visibleArticles]);

  const filteredArticles = useMemo(() => {
    return visibleArticles.filter((article) => {
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        (article.seoKeywords && article.seoKeywords.some((k) => k.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [visibleArticles, selectedCategory, searchQuery]);

  return (
    <Section id="writing">
      <SectionHeader
        label="Database 201"
        title="A free course on distributed databases"
        description={`${COURSE_META.totalModules} modules. Every post below is a standalone lesson — read in any order, free forever.`}
      />

      {/* Course CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Link
          to="/course"
          className="group flex items-center justify-between gap-4 p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card/30 hover:border-primary/60 transition-colors"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                View the full {COURSE_META.name} syllabus
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono">16 Modules</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Free email course · optional ${COURSE_META.price} Pro bundle with eBook + SQL labs
              </div>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </Link>
      </motion.div>

      {/* Search & Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 15 articles by topic (e.g. SingleStore, CAP, OOM, Latency, Sharding)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const count = category === "All"
              ? visibleArticles.length
              : visibleArticles.filter((a) => a.category === category).length;
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 font-medium ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card/60 text-muted-foreground border border-border/60 hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-black/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
        <span>
          Showing {filteredArticles.length} of {visibleArticles.length} articles
        </span>
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
          >
            <Link
              to={`/blog/${article.slug}`}
              className="group relative flex flex-col justify-between h-full card-elevated p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {article.category}
                    </span>
                    {article.featured && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                    {isPremiumSlug(article.slug) && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 inline-flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Premium
                      </span>
                    )}
                    {isAdmin && metaMap[article.slug] && !metaMap[article.slug].published && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        Draft
                      </span>
                    )}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>

                <h3 className="font-heading text-lg font-semibold mb-2.5 leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {article.description}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-3 border-t border-border/40 mt-auto">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-primary/70" />
                  {article.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-primary/70" />
                  {article.date}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
