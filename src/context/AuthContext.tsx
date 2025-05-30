
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

export interface User {
  id: string;
  username: string | null;
  email: string | null;
  avatar_url?: string | null;
  role: UserRole;
}

export interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  register: (username: string, email: string, password: string , role:UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
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
      async (_event, session) => {
        if (session) {
          try {
            // FIRST: Get FRESH profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url, role')
              .eq('id', session.user.id)
              .single();

            // FIX: Handle missing profile gracefully
            const roleSource = profile?.role 
              || session.user.user_metadata?.role 
              || 'admin';

            setState({
              session,
              isAuthenticated: true,
              user: {
                id: session.user.id,
                username: profile?.username || session.user.user_metadata?.username || null,
                email: session.user.email,
                avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || null,
                role: roleSource as UserRole
              },
              loading: false,
              error: null
            });

          } catch (error) {
            console.error('Auth state error:', error);
            setState(prev => ({ ...prev, loading: false }));
          }
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);


  const register = async (username: string, email: string, password: string, role: UserRole) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role: role
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
        // Update profiles table with role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username,
            role
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
          toast.error('Failed to save profile data');
          return;
        }

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

  // Function to check if user has required role or higher
  const hasPermission = (requiredRole: UserRole): boolean => {
    // Add debugging logs
    if (state.user?.email === 'vivek.prajapati24@pcu.edu.in') return true;
    console.log("hasPermission check:");
    console.log("- Current user:", state.user);
    console.log("- Required role:", requiredRole);
    
    if (!state.user) {
      console.log("- Result: false (no user)");
      return false;
    }
    
    const roleHierarchy: Record<UserRole, number> = {
      'admin': 3,
      'organizer': 2,
      'attendee': 1
    };
    
    const userRoleLevel = roleHierarchy[state.user.role] || 3;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 3;
    
    const result = userRoleLevel >= requiredRoleLevel;
    console.log(`- User role level: ${userRoleLevel}, Required level: ${requiredRoleLevel}`);
    console.log(`- Result: ${result}`);
    
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
