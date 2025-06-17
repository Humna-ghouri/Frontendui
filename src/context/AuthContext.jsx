import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!token);
  const navigate = useNavigate();

  // Verify token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Use this line if using Vite (recommended)
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          
          // Or use this line if using Create React App
          // const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
          
          const response = await axios.get(
            `${apiUrl}/api/auth/verify`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (!response.data.valid) {
            logout();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          logout();
        }
      }
    };
    
    verifyToken();
  }, [token]);

  const login = useCallback(async (newToken, userData) => {
    try {
      if (!newToken || !userData || !userData._id) {
        throw new Error('Invalid authentication data');
      }

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('User successfully logged in:', userData.email);
    } catch (error) {
      console.error('Login error:', error);
      logout();
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    delete axios.defaults.headers.common['Authorization'];
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/signin');
    console.log('User logged out');
  }, [navigate]);

  const updateUser = useCallback((newUserData) => {
    try {
      if (!newUserData) {
        throw new Error('No user data provided');
      }
      
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      console.log('User data updated');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }, []);

  // Replace process.env with import.meta.env
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/verify`, 
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    return response.data.valid;
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
};

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        const newToken = localStorage.getItem('token');
        setToken(newToken);
        setIsAuthenticated(!!newToken);
      }
      
      if (event.key === 'user') {
        try {
          const storedUser = localStorage.getItem('user');
          setUser(storedUser ? JSON.parse(storedUser) : null);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};