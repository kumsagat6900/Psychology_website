'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  name: string;
  role: 'STUDENT' | 'PSYCHOLOGIST';
  userId: string;
}


interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);
        setUser({
          email: decoded.email,
          role: decoded.role,
          userId: decoded.sub,
          name: decoded.name,
        });
        setToken(storedToken);
      } catch {
        logout();
      }
    }
  }, []);
  

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    const decoded: any = jwtDecode(newToken); // ✅

    setUser({
      email: decoded.email,
      name: decoded.name, // ✅ важно
      role: decoded.role,
      userId: decoded.sub,
    });
    
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
