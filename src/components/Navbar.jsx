

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiPlusCircle, FiList, FiLogIn, FiUserPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { AuthContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
          TASK MANAGER
        </Link>
        
        <div className="flex space-x-6">
          {user ? (
            <>
              <Link 
                to="/loan-calculator" 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiHome className="h-5 w-5" /> Dashboard
              </Link>
              <Link 
                to="/loan-request" 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiPlusCircle className="h-5 w-5" /> Create Task
              </Link>
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiList className="h-5 w-5" /> All Tasks
              </Link>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiLogOut className="h-5 w-5" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/signin" 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiLogIn className="h-5 w-5" /> Sign In
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 hover:text-pink-400 transition-all duration-300"
              >
                <FiUserPlus className="h-5 w-5" /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;