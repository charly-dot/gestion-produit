import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [DonneSession, setDonneSession] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setDonneSession(JSON.parse(storedUser));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setDonneSession(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDonneSession(null);
  };

  return (
    <AuthContext.Provider value={{ DonneSession, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
