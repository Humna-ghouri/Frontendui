
// export default App;
// src/App.jsx
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(
            `${API_URL}/api/auth/me`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) setUser(res.data.user);
          else logout();
        }
      } catch (err) {
        console.error('Auth check error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Navbar />  
        <ToastContainer theme="dark" />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={!user ? <SignIn /> : <Navigate to="/dashboard" />} /> */}
          <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/dashboard" />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-task" element={
            <ProtectedRoute>
              <CreateTask />
            </ProtectedRoute>
          } />
          {/* <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/create-task" element={user ? <CreateTask /> : <Navigate to="/signin" />} /> */}

        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;