import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = (token: string, email: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
  };

  const getToken = () => localStorage.getItem('token');
  const getEmail = () => localStorage.getItem('email');
  const getRole = () => localStorage.getItem('role');

  return {
    isAuthenticated,
    loading,
    login,
    logout,
    getToken,
    getEmail,
    getRole
  };
};