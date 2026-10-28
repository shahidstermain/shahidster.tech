import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  subscriptionTier: string | null;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);

  const fetchUserMeta = async (uid: string) => {
    // Defer to avoid deadlocks inside auth callback
    setTimeout(async () => {
      const [{ data: roleRows }, { data: subRow }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.from("subscribers").select("subscribed, subscription_tier, subscription_end").eq("user_id", uid).maybeSingle(),
      ]);
      setIsAdmin(!!roleRows?.some((r: { role: string }) => r.role === "admin"));
      const active =
        !!subRow?.subscribed &&
        (subRow.subscription_tier === "lifetime" ||
          !subRow.subscription_end ||
          new Date(subRow.subscription_end) > new Date());
      setIsSubscribed(active);
      setSubscriptionTier(subRow?.subscription_tier ?? null);
    }, 0);
  };

  const refreshSubscription = async () => {
    if (!user) return;
    const { data: subRow } = await supabase
      .from("subscribers")
      .select("subscribed, subscription_tier, subscription_end")
      .eq("user_id", user.id)
      .maybeSingle();
    const active =
      !!subRow?.subscribed &&
      (subRow.subscription_tier === "lifetime" ||
        !subRow.subscription_end ||
        new Date(subRow.subscription_end) > new Date());
    setIsSubscribed(active);
    setSubscriptionTier(subRow?.subscription_tier ?? null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchUserMeta(newSession.user.id);
      } else {
        setIsAdmin(false);
        setIsSubscribed(false);
        setSubscriptionTier(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) fetchUserMeta(existing.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isAdmin, isSubscribed, subscriptionTier, refreshSubscription, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
