import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("stackweave_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = (name, email, password) => {
    const newUser = { name, email };

    localStorage.setItem("stackweave_user", JSON.stringify(newUser));
    localStorage.setItem("stackweave_password", password);

    setUser(newUser);
  };

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem("stackweave_user"));
    const storedPassword = localStorage.getItem("stackweave_password");

    if (email === storedUser?.email && password === storedPassword) {
      setUser(storedUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("stackweave_user");
    localStorage.removeItem("stackweave_password");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
