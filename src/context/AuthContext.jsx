import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();

const USER_KEY = "stackweave_auth_v2";
const HASH_KEY = "stackweave_pwhash_v2";
const TOKEN_KEY = "stackweave_token_v2";

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HASH_KEY);
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

      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return false;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch (err) {
      setError("Signup failed. Please try again.");
      return false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return false;
      }

      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return false;
      }

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      return true;
    } catch {
      setError("Login failed. Please try again.");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HASH_KEY);
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