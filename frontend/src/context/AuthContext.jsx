// COMPONENT 4: User + Education + Analytics
// File: frontend/src/context/AuthContext.jsx
import { createContext, useEffect, useMemo, useState } from "react";
import { endpoints } from "../api/endpoints";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await endpoints.me();
        setUser(res.data.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: async (email, password) => {
        const res = await endpoints.login({ email, password });
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
      },
      register: async (payload) => {
        const res = await endpoints.register(payload);
        localStorage.setItem("token", res.data.data.token);
        setUser(res.data.data.user);
      },
      logout: () => {
        localStorage.removeItem("token");
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}