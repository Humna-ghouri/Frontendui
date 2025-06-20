// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
// import { AuthContext } from '../context/AuthContext';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(
//         `${API_URL}/api/auth/signin`,
//         { email, password },
//         {
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );

//       if (response.data.success) {
//         if (!response.data.token || !response.data.user) {
//           throw new Error('Invalid response from server');
//         }

//         login(response.data.token, response.data.user);

//         Swal.fire({
//           title: 'Success!',
//           text: 'You have successfully logged in!',
//           icon: 'success',
//           background: '#1a1a1a',
//           color: '#fff'
//         }).then(() => {
//           navigate('/dashboard');
//         });
//       } else {
//         setError(response.data.message || 'Login failed');
//       }
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.message || `Login failed (${error.response.status})`);
//       } else if (error.request) {
//         setError('Network error. Please check your connection.');
//       } else {
//         setError(error.message || 'An unexpected error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:max-w-2xl transition-all duration-500 hover:shadow-pink-500/50">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
//             Sign In
//           </h1>
//           <p className="text-gray-400 mt-2">Welcome back! Please enter your details.</p>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-800/60 text-red-300 rounded-xl shadow-inner animate-bounce">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label className="block text-sm font-bold text-pink-400">Email*</label>
//             <div className="relative">
//               <FiMail className="absolute left-3 top-3.5 text-gray-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-bold text-pink-400">Password*</label>
//             <div className="relative">
//               <FiLock className="absolute left-3 top-3.5 text-gray-400" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-10 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
//                 placeholder="Enter your password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3.5 text-gray-400 hover:text-pink-400 transition"
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1"
//           >
//             {loading ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Signing in...
//               </>
//             ) : (
//               <>
//                 <FiLogIn className="h-5 w-5" />
//                 <span>Sign In</span>
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <p className="text-gray-400">
//             Don't have an account?{' '}
//             <button
//               onClick={() => navigate('/signup')}
//               className="text-pink-400 hover:text-pink-600 underline transition-all duration-300"
//             >
//               Sign Up
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Improved API URL handling with fallback
  const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to sign in with:', API_URL); // Debug log
      
      const response = await axios.post(
        `${API_URL}/api/auth/signin`,
        { 
          email: email.trim().toLowerCase(), 
          password 
        },
        {
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      console.log('SignIn Response:', response); // Debug log

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Invalid server response');
      }

      if (!response.data.token || !response.data.user) {
        throw new Error('Missing token or user data in response');
      }

      // Successful login
      login(response.data.token, response.data.user);

      await Swal.fire({
        title: 'Success!',
        text: 'You have successfully logged in!',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/dashboard');

    } catch (error) {
      console.error('SignIn Error:', error); // Debug log
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                      `Login failed (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = error.message || 'Login failed';
      }
      
      setError(errorMessage);
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:max-w-2xl transition-all duration-500 hover:shadow-pink-500/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
            Sign In
          </h1>
          <p className="text-gray-400 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-800/60 text-red-300 rounded-xl shadow-inner animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Email*</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Password*</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-pink-400 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn className="h-5 w-5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-pink-400 hover:text-pink-600 underline transition-all duration-300 focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;