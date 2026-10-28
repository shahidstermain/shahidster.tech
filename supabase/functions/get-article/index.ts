import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    if (!slug) {
      return new Response(JSON.stringify({ error: "slug required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Fetch article record
    const { data: article, error } = await admin
      .from("premium_articles")
      .select("slug, is_premium, published, excerpt, full_content")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;

    // Check viewer identity (admins can preview unpublished)
    const authHeader = req.headers.get("Authorization");
    let viewerId: string | null = null;
    let isAdminViewer = false;
    if (authHeader) {
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      if (userData?.user) {
        viewerId = userData.user.id;
        const { data: roleRows } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", viewerId);
        isAdminViewer = !!roleRows?.some((r: { role: string }) => r.role === "admin");
      }
    }

    // Not in premium table → not gated, treat as free public content
    if (!article) {
      return new Response(
        JSON.stringify({ gated: false, is_premium: false, published: true, content: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unpublished → hide from everyone except admins
    if (!article.published && !isAdminViewer) {
      return new Response(
        JSON.stringify({
          gated: true,
          is_premium: !!article.is_premium,
          published: false,
          excerpt: "",
          content: null,
          unpublished: true,
        }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Free article in DB
    if (!article.is_premium) {
      return new Response(
        JSON.stringify({
          gated: false,
          is_premium: false,
          content: article.full_content || article.excerpt,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Premium → admins always get full content; otherwise check subscription
    let isSubscribed = isAdminViewer;

    if (!isSubscribed && viewerId) {
      const { data: sub } = await admin
        .from("subscribers")
        .select("subscribed, subscription_tier, subscription_end")
        .eq("user_id", viewerId)
        .maybeSingle();
      if (sub?.subscribed) {
        isSubscribed =
          sub.subscription_tier === "lifetime" ||
          !sub.subscription_end ||
          new Date(sub.subscription_end) > new Date();
      }
    }

    if (isSubscribed) {
      return new Response(
        JSON.stringify({
          gated: false,
          is_premium: true,
          content: article.full_content,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Locked
    return new Response(
      JSON.stringify({
        gated: true,
        is_premium: true,
        excerpt: article.excerpt,
        content: null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
