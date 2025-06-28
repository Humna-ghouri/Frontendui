
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

//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

//         await Swal.fire({
//           title: 'Success!',
//           text: 'You have successfully logged in!',
//           icon: 'success',
//           background: '#1a1a1a',
//           color: '#fff'
//         });

//         navigate('/dashboard');
//       } else {
//         setError(response.data.message || 'Login failed');
//       }
//     } catch (error) {
//       let errorMsg = 'An error occurred during login';
//       if (error.response) {
//         errorMsg = error.response.data.message || `Login failed (${error.response.status})`;
//       } else if (error.request) {
//         errorMsg = 'Network error. Please check your connection.';
//       } else {
//         errorMsg = error.message;
//       }
//       setError(errorMsg);
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
//           <div>
//   <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//     Email address
//   </label>
//   <div className="mt-1 relative rounded-md shadow-sm">
//     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
//       <FiMail />
//     </span>
//     <input
//       id="email"
//       name="email"
//       type="email"
//       autoComplete="email"
//       required
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//       className="block w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//       placeholder="you@example.com"
//     />
//   </div>
// </div>

// <div>
//   <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//     Password
//   </label>
//   <div className="mt-1 relative rounded-md shadow-sm">
//     <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
//       <FiLock />
//     </span>
//     <input
//       id="password"
//       name="password"
//       type={showPassword ? 'text' : 'password'}
//       autoComplete="current-password"
//       required
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       className="block w-full pl-10 pr-10 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//       placeholder="Enter your password"
//     />
//     <span
//       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
//       onClick={() => setShowPassword(!showPassword)}
//     >
//       {showPassword ? <FiEyeOff /> : <FiEye />}
//     </span>
//   </div>
// </div>

// <div>
//   <button
//     type="submit"
//     disabled={loading}
//     className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
//   >
//     {loading ? (
//       <svg
//         className="animate-spin h-5 w-5 text-white"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//       >
//         <circle
//           className="opacity-25"
//           cx="12"
//           cy="12"
//           r="10"
//           stroke="currentColor"
//           strokeWidth="4"
//         ></circle>
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8v8z"
//         ></path>
//       </svg>
//     ) : (
//       <>
//         <FiLogIn className="mr-2" />
//         Sign In
//       </>
//     )}
//   </button>
// </div>

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

// export default SignIn;
import React, { useState, useContext } from 'react';
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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signin`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 20000, // ⏱️ Increases timeout for sleeping servers
          withCredentials: true // ✅ For secure CORS/session cookies
        }
      );

      if (response.data.success) {
        login(response.data.token, response.data.user);

        await Swal.fire({
          title: 'Success!',
          text: 'You have successfully logged in!',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff'
        });

        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      let errorMsg = 'An error occurred during login';
      if (error.response) {
        errorMsg = error.response.data.message || `Login failed (${error.response.status})`;
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'Server timed out. Please try again later.';
      } else if (error.request) {
        errorMsg = 'Network error. Please check your connection.';
      } else {
        errorMsg = error.message;
      }
      setError(errorMsg);
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
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiMail />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FiLock />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter your password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-300"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-pink-400 hover:text-pink-600 underline transition-all duration-300"
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
