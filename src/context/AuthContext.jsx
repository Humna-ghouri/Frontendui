import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // ✅ Add this
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setLoading(false); // ✅ Mark done after attempt
    };
    verifyToken();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/signin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading...
      </div>
    ); // ✅ wait until auth check finishes
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     const verifyToken = async () => {
//       if (token) {
//         try {
//           const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (response.data.success) {
//             setUser(response.data.user);
//           } else {
//             logout();
//           }
//         } catch (err) {
//           console.error('Token verification failed:', err);
//           logout();
//         }
//       }
//     };
//     verifyToken();
//   }, [token]);

//   const login = (newToken, userData) => {
//     localStorage.setItem('token', newToken);
//     setToken(newToken);
//     setUser(userData);
//     axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//     navigate('/signin');
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };