import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token && apiService.isAuthenticated()) {
      setAdminToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    setAdminToken(token);
    apiService.setAdminToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAdminToken('');
    apiService.clearAdminToken();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    adminToken,
    handleLogin,
    handleLogout
  };
}; 