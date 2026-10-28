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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Detect admin viewer
    let isAdminViewer = false;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      if (userData?.user) {
        const { data: roleRows } = await admin
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id);
        isAdminViewer = !!roleRows?.some((r: { role: string }) => r.role === "admin");
      }
    }

    const { data, error } = await admin
      .from("premium_articles")
      .select("slug, is_premium, published");
    if (error) throw error;

    const articles = (data || []).map((r) => ({
      slug: r.slug,
      is_premium: !!r.is_premium,
      published: !!r.published,
    }));

    return new Response(
      JSON.stringify({ articles, is_admin: isAdminViewer }),
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
