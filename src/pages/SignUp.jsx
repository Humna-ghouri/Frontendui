import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { AuthContext } from '../App';

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post('https://backendui.onrender.com/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({
        ...errors,
        form: error.response?.data?.message || 'Signup failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:max-w-2xl transition-all duration-500 hover:shadow-pink-500/50">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/')} 
            className="text-pink-400 hover:text-pink-600 transform hover:-translate-x-1 hover:scale-110 transition-all duration-300"
          >
            <FiArrowLeft className="h-7 w-7" />
          </button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse">
            Create Account
          </h1>
          <div className="w-7"></div>
        </div>

        {errors.form && (
          <div className="mb-6 p-4 bg-red-800/60 text-red-300 rounded-xl shadow-inner animate-bounce">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Full Name*</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-pink-400'} rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Email*</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-pink-400'} rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Password*</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 ${errors.password ? 'border-red-500' : 'border-pink-400'} rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Confirm Password*</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 ${errors.confirmPassword ? 'border-red-500' : 'border-pink-400'} rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300`}
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/signin')} 
              className="text-pink-400 hover:text-pink-600 underline transition-all duration-300"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;