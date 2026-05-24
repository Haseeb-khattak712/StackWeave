import { createContext, useContext, useEffect, useState, useCallback } from "react";

const AuthContext = createContext();

const USER_KEY = "stackweave_auth_v2";
const HASH_KEY = "stackweave_pwhash_v2";

const hash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h.toString(36);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HASH_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback((name, email, password) => {
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

      const newUser = { name, email };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(HASH_KEY, hash(password));
      setUser(newUser);
      return true;
    } catch (err) {
      setError("Signup failed. Please try again.");
      return false;
    }
  }, []);

  const login = useCallback((email, password) => {
    setError(null);
    try {
      if (!email || !password) {
        setError("Email and password are required");
        return false;
      }

      const storedRaw = localStorage.getItem(USER_KEY);
      const storedHash = localStorage.getItem(HASH_KEY);
      const storedUser = storedRaw ? JSON.parse(storedRaw) : null;

      const success =
        storedUser &&
        email === storedUser.email &&
        hash(password) === storedHash;

      if (!success) {
        setError("Invalid email or password");
        return false;
      }

      setUser(storedUser);
      return true;
    } catch {
      setError("Login failed. Please try again.");
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HASH_KEY);
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading, error, setError }}>
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