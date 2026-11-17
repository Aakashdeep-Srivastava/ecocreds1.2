'use client';
import { createContext, useContext } from 'react';

// No external auth provider. A personal user is always signed in.
interface AppUser {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const currentUser: AppUser = {
  uid: 'user-1',
  email: 'harshpratapsingh@gmail.com',
  displayName: 'Harsh Singh',
};

const AuthContext = createContext<AuthContextType>({
  user: currentUser,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const login = async () => {};
  const signup = async () => {};
  const logout = async () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user: currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
