import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useAuthState() {
  const { user, isLoading, isAuthenticated, loginWithGoogle, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(!isAuthenticated && !isLoading);
  
  useEffect(() => {
    if (!isLoading) {
      setShowLoginModal(!isAuthenticated);
    }
  }, [isLoading, isAuthenticated]);
  
  const handleLoginWithGoogle = async () => {
    await loginWithGoogle();
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  return {
    user,
    isLoading,
    isAuthenticated,
    showLoginModal,
    loginWithGoogle: handleLoginWithGoogle,
    logout: handleLogout
  };
}
