import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const useAuthMiddleware = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const [isVoterVerified, setIsVoterVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user && !loading) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin, is_voter_verified')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          setIsAdmin(data?.is_admin || false);
          setIsVoterVerified(data?.is_voter_verified || false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false);
          setIsVoterVerified(false);
        }
      } else {
        setIsAdmin(null);
        setIsVoterVerified(null);
      }
    };

    fetchProfileData();
  }, [user, loading]);

  useEffect(() => {
    if (!loading) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

      if (user && (currentPath === "/auth/login" || currentPath === "/auth/register")) {
        router.push("/");
      } else if (user && isAdmin === false && currentPath === "/dashboard") {
        router.push("/");
      } else if (!user && currentPath === "/dashboard") {
        router.push("/");
      }
    }
  }, [user, loading, router, isAdmin]);

  return { user, loading, isAdmin, isVoterVerified };
};

