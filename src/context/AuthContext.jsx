import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();

const USER_KEY = "stackweave_auth_v2";
const TOKEN_KEY = "stackweave_token_v2";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Auth restore error:", e);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setError(null);
    try {
      if (!name || !email || !password) {
        setError("All fields are required");
        return false;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (!email.includes("@")) {
        setError("Please enter a valid email");
        return false;
      }

      console.log("[Auth] Sending signup to:", `${API_BASE}/api/signup`);
      const res = await fetch(`${API_BASE}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("[Auth] Signup response:", res.status, data);

      if (!res.ok) {
        setError(data.error || data.details || `Signup failed (${res.status})`);
        return false;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      console.error("[Auth] Signup catch:", err);
      setError(err.message || "Cannot connect to server. Is it running on port 5000?");
      return false;
    }
  }, [API_BASE]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return false;
      }

      console.log("[Auth] Sending login to:", `${API_BASE}/api/login`);
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("[Auth] Login response:", res.status, data);

      if (!res.ok) {
        setError(data.error || data.details || `Login failed (${res.status})`);
        return false;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      console.error("[Auth] Login catch:", err);
      setError(err.message || "Cannot connect to server. Is it running on port 5000?");
      return false;
    }
  }, [API_BASE]);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout, loading, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};