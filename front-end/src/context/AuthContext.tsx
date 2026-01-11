// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserFromToken } from "../utils/decodeToken";

interface AuthContextType {
  user: { role: "seller" | "manager" | "owner"; id: string } | null;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const refreshUser = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = getUserFromToken();
        setUser({ role: decoded.role, id: decoded.sub });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
