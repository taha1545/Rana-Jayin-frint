'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  //
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  //
  useEffect(() => {
    setMounted(true);
    // 
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'client') => {
    try {
      // 
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      //
      await new Promise(resolve => setTimeout(resolve, 1000));
      //
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      // 
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      // 
      await new Promise(resolve => setTimeout(resolve, 1000));
      //
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // 
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
      isAuthenticated: !!user,
      isClient: user?.role === 'client',
      isMember: user?.role === 'member',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


