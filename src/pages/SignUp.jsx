
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use this exact API base URL
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`https://backendui.onrender.com/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        await Swal.fire({
          title: 'Success!',
          text: 'Account created successfully!',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff'
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Endpoint not found. Please contact support.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      setErrors({ form: errorMessage });
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-gray-900 to-black text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl space-y-6">
        <h2 className="text-3xl font-bold text-pink-500 text-center">Create Account</h2>

        {errors.form && (
          <div className="bg-red-700 text-white p-3 rounded text-center">{errors.form}</div>
        )}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className={`w-full p-3 rounded bg-black text-white border ${errors.name ? 'border-red-500' : 'border-pink-500'}`}
        />
        {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={`w-full p-3 rounded bg-black text-white border ${errors.email ? 'border-red-500' : 'border-pink-500'}`}
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className={`w-full p-3 rounded bg-black text-white border ${errors.password ? 'border-red-500' : 'border-pink-500'}`}
        />
        {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className={`w-full p-3 rounded bg-black text-white border ${errors.confirmPassword ? 'border-red-500' : 'border-pink-500'}`}
        />
        {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 bg-pink-600 rounded text-white font-bold hover:bg-pink-700 transition"
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/signin')}
            className="text-pink-500 underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;