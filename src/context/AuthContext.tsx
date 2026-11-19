'use client';
import { createContext, useContext, useEffect, useState } from 'react';

// A lightweight client session. By default a demo user is signed in; once the
// user connects a Pera wallet (the Perawallet login flow) the wallet becomes
// the active identity and is persisted in localStorage so it survives reloads.
interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  walletAddress?: string;
}

interface WalletSessionUser {
  id?: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: AppUser | null;
  walletAddress: string | null;
  login: (email?: string, password?: string) => Promise<void>;
  signup: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  // Promote a connected wallet to the active session (called after Pera connect).
  setWalletSession: (address: string, user?: WalletSessionUser) => void;
}

const demoUser: AppUser = {
  uid: 'USR-DEMO',
  email: 'aria.verde@carbongero.com',
  displayName: 'Aria Verde',
};

const STORAGE_KEY = 'cg_wallet_session';

function short(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

const AuthContext = createContext<AuthContextType>({
  user: demoUser,
  walletAddress: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  setWalletSession: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser>(demoUser);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Restore a wallet session on load.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as { address: string; user?: WalletSessionUser };
      if (s.address) applySession(s.address, s.user);
    } catch {
      /* ignore malformed session */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applySession(address: string, u?: WalletSessionUser) {
    setWalletAddress(address);
    setUser({
      uid: u?.id || 'USR-DEMO',
      email: u?.email || `${short(address)} · Algorand`,
      displayName: u?.name || short(address),
      walletAddress: address,
    });
  }

  const setWalletSession = (address: string, u?: WalletSessionUser) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, user: u }));
    } catch {
      /* storage may be unavailable */
    }
    applySession(address, u);
  };

  const login = async () => {};
  const signup = async () => {};
  const logout = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setWalletAddress(null);
    setUser(demoUser);
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, walletAddress, login, signup, logout, setWalletSession }}>
      {children}
    </AuthContext.Provider>
  );
};
