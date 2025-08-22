import { User } from '../types';

const AUTH_KEY = 'grill_hut_auth';

export const login = (email: string, password: string): User | null => {
  // Admin login
  if (email === 'admin@admin.com' && password === 'admin') {
    const adminUser: User = {
      id: 'admin',
      email: 'admin@admin.com',
      name: 'Admin',
      isAdmin: true
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  
  // Regular user login (for demo purposes)
  if (email && password) {
    const user: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      isAdmin: false
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin || false;
};