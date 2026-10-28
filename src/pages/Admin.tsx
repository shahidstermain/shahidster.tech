import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Save, Lock, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { articles } from "@/data/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

interface PremiumArticleRow {
  id: string;
  slug: string;
  is_premium: boolean;
  published: boolean;
  excerpt: string;
  full_content: string;
  updated_at: string;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [rows, setRows] = useState<PremiumArticleRow[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [editor, setEditor] = useState<{
    slug: string;
    is_premium: boolean;
    published: boolean;
    excerpt: string;
    full_content: string;
  }>({ slug: "", is_premium: true, published: false, excerpt: "", full_content: "" });
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);

  const loadRows = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("premium_articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error(error.message);
    } else {
      setRows((data as PremiumArticleRow[]) || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (isAdmin) loadRows();
  }, [isAdmin]);

  const onSelectSlug = (slug: string) => {
    setSelectedSlug(slug);
    const existing = rows.find((r) => r.slug === slug);
    const fallback = articles.find((a) => a.slug === slug);
    if (existing) {
      setEditor({
        slug: existing.slug,
        is_premium: existing.is_premium,
        published: existing.published,
        excerpt: existing.excerpt,
        full_content: existing.full_content,
      });
    } else if (fallback) {
      // Pre-fill from existing article: first ~3 paragraphs as excerpt, rest as full
      const paragraphs = fallback.content.split(/\n\n+/);
      const excerpt = paragraphs.slice(0, 4).join("\n\n");
      setEditor({
        slug,
        is_premium: true,
        published: false,
        excerpt,
        full_content: fallback.content,
      });
    } else {
      setEditor({ slug, is_premium: true, published: false, excerpt: "", full_content: "" });
    }
  };

  const handleSave = async () => {
    if (!editor.slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    setSaving(true);
    const existing = rows.find((r) => r.slug === editor.slug);
    const payload = {
      slug: editor.slug.trim(),
      is_premium: editor.is_premium,
      published: editor.published,
      excerpt: editor.excerpt,
      full_content: editor.full_content,
    };
    const { error } = existing
      ? await supabase.from("premium_articles").update(payload).eq("id", existing.id)
      : await supabase.from("premium_articles").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(existing ? "Article updated" : "Article created");
      loadRows();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this article from the premium table? (The article in code stays free.)")) return;
    const { error } = await supabase.from("premium_articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Removed");
      if (rows.find((r) => r.id === id)?.slug === selectedSlug) {
        setSelectedSlug("");
        setEditor({ slug: "", is_premium: true, published: false, excerpt: "", full_content: "" });
      }
      loadRows();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="text-center max-w-md px-4">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Admin only</h1>
            <p className="text-muted-foreground mb-6">
              Your account doesn't have admin privileges. Ask the site owner to grant access.
            </p>
            <Button asChild>
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const codeSlugs = articles.map((a) => a.slug);
  const dbOnlySlugs = rows.filter((r) => !codeSlugs.includes(r.slug)).map((r) => r.slug);
  const allSlugs = Array.from(new Set([...codeSlugs, ...dbOnlySlugs]));

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundGlow />
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="section-container max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-4xl font-bold mb-2">Admin · Premium articles</h1>
            <p className="text-muted-foreground">
              Mark articles as premium or free, publish or unpublish them, and manage gated content.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar */}
            <Card className="p-4 h-fit lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">Articles</h2>
                <span className="text-xs text-muted-foreground">{allSlugs.length}</span>
              </div>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {fetching ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  allSlugs.map((slug) => {
                    const row = rows.find((r) => r.slug === slug);
                    const codeArticle = articles.find((a) => a.slug === slug);
                    return (
                      <button
                        key={slug}
                        onClick={() => onSelectSlug(slug)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                          selectedSlug === slug
                            ? "bg-primary/15 text-primary"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {row?.is_premium ? (
                          <Lock className="w-3 h-3 shrink-0 text-primary" />
                        ) : (
                          <Unlock className="w-3 h-3 shrink-0" />
                        )}
                        <span className="truncate flex-1">
                          {codeArticle?.title || slug}
                        </span>
                        {row && !row.published && (
                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            Draft
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => {
                  const slug = prompt("New article slug (e.g., my-new-post):");
                  if (slug) onSelectSlug(slug.trim());
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> New slug
              </Button>
            </Card>

            {/* Editor */}
            <div>
              {!selectedSlug ? (
                <Card className="p-8 text-center text-muted-foreground">
                  Select an article from the left to edit, or create a new slug.
                </Card>
              ) : (
                <Card className="p-6 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="is-premium"
                          checked={editor.is_premium}
                          onCheckedChange={(v) => setEditor({ ...editor, is_premium: v })}
                        />
                        <Label htmlFor="is-premium" className="cursor-pointer">
                          {editor.is_premium ? "🔒 Premium (gated)" : "🔓 Free (public)"}
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          id="is-published"
                          checked={editor.published}
                          onCheckedChange={(v) => setEditor({ ...editor, published: v })}
                        />
                        <Label htmlFor="is-published" className="cursor-pointer">
                          {editor.published ? "✅ Published" : "📝 Draft (hidden)"}
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {rows.find((r) => r.slug === selectedSlug) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const row = rows.find((r) => r.slug === selectedSlug);
                            if (row) handleDelete(row.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button onClick={handleSave} disabled={saving} size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={editor.slug}
                      onChange={(e) => setEditor({ ...editor, slug: e.target.value })}
                      placeholder="article-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must match the article slug in <code>src/data/articles.ts</code> for gating to apply.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (public preview)</Label>
                    <Textarea
                      id="excerpt"
                      value={editor.excerpt}
                      onChange={(e) => setEditor({ ...editor, excerpt: e.target.value })}
                      rows={8}
                      placeholder="The first 2-3 paragraphs shown to non-subscribers..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is shown to everyone. Markdown supported.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full">Full content (subscribers only)</Label>
                    <Textarea
                      id="full"
                      value={editor.full_content}
                      onChange={(e) => setEditor({ ...editor, full_content: e.target.value })}
                      rows={20}
                      placeholder="The complete article body..."
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only delivered server-side to active subscribers.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
