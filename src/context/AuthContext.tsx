import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url?: string | null;
}

export interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  session: null,
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          session,
          isAuthenticated: !!session,
          user: session ? {
            id: session.user.id,
            username: session.user.user_metadata.username || null,
            email: session.user.email,
            avatar_url: session.user.user_metadata.avatar_url || null
          } : null,
          loading: false
        }));
      }
    );

    const initializeAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }

      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        setState(prev => ({
          ...prev,
          session,
          isAuthenticated: true,
          user: {
            id: session.user.id,
            username: profile?.username || session.user.user_metadata.username || null,
            email: session.user.email,
            avatar_url: profile?.avatar_url || session.user.user_metadata.avatar_url || null
          },
          loading: false
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });

      if (error) {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
        toast.error(error.message || 'Registration failed');
        return;
      }

      if (data.user) {
        toast.success('Registration successful. Please verify your email.');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({
        ...prev,
        error: 'Server error',
        loading: false
      }));
      toast.error('Server error during registration');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
        toast.error(error.message || 'Login failed');
        return false;
      }

      toast.success('Login successful');
      return true;
      
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        error: 'Server error',
        loading: false
      }));
      toast.error('Server error during login');
      return false;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
        return;
      }
      
      toast.info('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Server error during logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
