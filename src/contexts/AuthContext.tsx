import { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser, type User } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Checking for existing session');
    
    // Check for stored session
    const storedUser = localStorage.getItem("airbloom-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        
        // Check if session has expired
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          const { expiresAt: _exp, ...user } = parsed;
          setUser(user);
          console.log('[AuthContext] Session restored from localStorage');
        } else {
          console.log('[AuthContext] Session expired, clearing');
          localStorage.removeItem("airbloom-user");
        }
      } catch (error) {
        console.error('[AuthContext] Failed to parse stored session:', error);
        localStorage.removeItem("airbloom-user");
      }
    } else {
      console.log('[AuthContext] No existing session found');
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('[AuthContext] Login attempt started');
    
    try {
      // Simulate API call delay (remove in production if not needed)
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Attempt authentication
      const userData = await authenticateUser(username, password);

      if (userData) {
        console.log('[AuthContext] Authentication successful');
        setUser(userData);
        
        // Store user with expiration (8 hours)
        const sessionData = {
          ...userData,
          expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        };
        
        localStorage.setItem("airbloom-user", JSON.stringify(sessionData));
        console.log('[AuthContext] Session stored in localStorage');
        
        return true;
      }
      
      console.log('[AuthContext] Authentication failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      // Re-throw to let the UI handle it
      throw error;
    }
  };

  const logout = () => {
    console.log('[AuthContext] Logging out user');
    setUser(null);
    localStorage.removeItem("airbloom-user");
    
    // Clear rate limiting on logout
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('airbloom-rate:')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('[AuthContext] Failed to clear rate limit data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
