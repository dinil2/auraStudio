import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { APP_CONFIG } from '../config';

interface AuthContextType {
  user: { email: string } | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_ADMIN_SESSION_KEY = 'aura_local_admin_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && session.user.email === APP_CONFIG.adminEmail) {
          setUser({ email: session.user.email });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // Listen for auth state changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.user.email === APP_CONFIG.adminEmail) {
          setUser({ email: session.user.email });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Offline / Local mock session check
      const local = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      if (local === 'true') {
        setUser({ email: APP_CONFIG.adminEmail });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();

    // Verify admin email matches exactly
    if (trimmedEmail !== APP_CONFIG.adminEmail.toLowerCase()) {
      return {
        success: false,
        error: 'Access restricted: Unauthorized administrator account.',
      };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user?.email !== APP_CONFIG.adminEmail) {
        await supabase.auth.signOut();
        return { success: false, error: 'Unauthorized administrator email.' };
      }

      setUser({ email: data.user.email });
      return { success: true };
    } else {
      // For testing / initial preview when Supabase env vars are not set yet:
      // Accepts password 'admin123' or any non-empty password
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, 'true');
      setUser({ email: APP_CONFIG.adminEmail });
      return { success: true };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
    setUser(null);
  };

  const isAdmin = user?.email === APP_CONFIG.adminEmail;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

