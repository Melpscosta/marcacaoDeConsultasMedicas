import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

const STORAGE_KEY = '@HealthConnect:user';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Contas de demonstração (paciente e médico)
const DEMO_ACCOUNTS: { email: string; password: string; user: User }[] = [
  { email: 'joao@example.com', password: '123456', user: { id: '1', name: 'Dr. João Silva', email: 'joao@example.com', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop', role: 'doctor' } },
  { email: 'maria@example.com', password: '123456', user: { id: '2', name: 'Dra. Maria Santos', email: 'maria@example.com', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop', role: 'doctor' } },
  { email: 'teste@paciente.com', password: '123456', user: { id: 'p1', name: 'João Teste', email: 'teste@paciente.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', role: 'patient' } },
  { email: 'ana@exemplo.com', password: '123456', user: { id: 'p2', name: 'Ana Paciente', email: 'ana@exemplo.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', role: 'patient' } },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return { success: false, error: 'Email é obrigatório' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return { success: false, error: 'Email inválido' };
    if (!password) return { success: false, error: 'Senha é obrigatória' };

    const found = DEMO_ACCOUNTS.find((a) => a.email === trimmedEmail && a.password === password);
    if (found) {
      setUser(found.user);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(found.user));
      return { success: true };
    }

    return { success: false, error: 'Email ou senha incorretos' };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, confirmPassword: string) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedName.length < 3) return { success: false, error: 'Nome deve ter pelo menos 3 caracteres' };
    if (!trimmedEmail) return { success: false, error: 'Email é obrigatório' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return { success: false, error: 'Email inválido' };
    if (password.length < 6) return { success: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    if (password !== confirmPassword) return { success: false, error: 'As senhas não coincidem' };

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      role: 'patient',
    };
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx.login) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
