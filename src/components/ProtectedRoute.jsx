// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext); // Access AuthContext's user and loading

  if (loading) {
    // Show a loading indicator while AuthContext is checking auth status
    return <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex items-center justify-center text-pink-400">Checking authentication...</div>;
  }

  if (!user) {
    // If not logged in, redirect to signin. `replace` prevents going back to the protected route.
    return <Navigate to="/signin" replace />;
  }

  // If logged in, render the protected content
  return children;
};

export default ProtectedRoute;