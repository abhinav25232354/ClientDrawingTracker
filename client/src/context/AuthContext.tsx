import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { AuthUser } from "@/lib/types";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authInitialized, setAuthInitialized] = useState(false);

  const { data: user, isLoading, refetch } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/current-user"],
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 30, // 30 minutes
    queryFn: getQueryFn({ on401: "returnNull" })
  });
  
  useEffect(() => {
    if (!isLoading) {
      setAuthInitialized(true);
    }
  }, [isLoading]);

  const loginWithGoogle = async () => {
    try {
      // In development mode, use dev login endpoint if available
      if (import.meta.env.DEV) {
        const response = await apiRequest("GET", "/api/auth/dev-login", null);
        const data = await response.json();
        if (data && data.success) {
          await refetch();
          return;
        }
      }
      
      // Fall back to Google OAuth
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        "/api/auth/google",
        "googleauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      // Setup message listener for auth result
      window.addEventListener("message", async (event) => {
        if (event.data.type === "AUTH_SUCCESS") {
          await refetch();
        }
      }, { once: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    await apiRequest("POST", "/api/auth/logout", {});
    refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: !authInitialized,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
