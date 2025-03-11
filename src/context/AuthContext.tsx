
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Load user on first render
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await fetch(`${API_URL}/auth/user`, {
            headers: {
              'x-auth-token': state.token
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setState(prev => ({
              ...prev,
              isAuthenticated: true,
              loading: false,
              user: userData
            }));
          } else {
            localStorage.removeItem('token');
            setState(prev => ({
              ...prev,
              token: null,
              isAuthenticated: false,
              loading: false,
              user: null
            }));
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          setState(prev => ({
            ...prev,
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
          }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    loadUser();
  }, [state.token]);

  // Register user
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setState(prev => ({
          ...prev,
          token: data.token,
          isAuthenticated: true,
          loading: false,
          user: data.user,
          error: null
        }));
        toast.success('Registration successful');
      } else {
        setState(prev => ({
          ...prev,
          error: data.message
        }));
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({
        ...prev,
        error: 'Server error'
      }));
      toast.error('Server error during registration');
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setState(prev => ({
          ...prev,
          token: data.token,
          isAuthenticated: true,
          loading: false,
          user: data.user,
          error: null
        }));
        toast.success('Login successful');
      } else {
        setState(prev => ({
          ...prev,
          error: data.message
        }));
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        error: 'Server error'
      }));
      toast.error('Server error during login');
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setState(prev => ({
      ...prev,
      token: null,
      isAuthenticated: false,
      user: null
    }));
    toast.info('Logged out successfully');
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
