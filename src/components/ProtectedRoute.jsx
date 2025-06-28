// // src/components/ProtectedRoute.jsx
// import { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext); // Access AuthContext's user and loading

//   if (loading) {
//     // Show a loading indicator while AuthContext is checking auth status
//     return <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex items-center justify-center text-pink-400">Checking authentication...</div>;
//   }

//   if (!user) {
//     // If not logged in, redirect to signin. `replace` prevents going back to the protected route.
//     return <Navigate to="/signin" replace />;
//   }

//   // If logged in, render the protected content
//   return children;
// };

// export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);

  // If token exists but user is still null, assume loading
  if (token && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
