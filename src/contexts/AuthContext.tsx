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
    // Check for stored session
    const storedUser = localStorage.getItem("airbloom-user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
          const { expiresAt: _exp, ...user } = parsed;
          setUser(user);
        } else {
          localStorage.removeItem("airbloom-user");
        }
      } catch {
        localStorage.removeItem("airbloom-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Let errors (like rate limit errors) propagate to the caller
    const userData = await authenticateUser(username, password);

    if (userData) {
      setUser(userData);
      localStorage.setItem("airbloom-user", JSON.stringify({
        ...userData,
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("airbloom-user");
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
