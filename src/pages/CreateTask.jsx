

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
 import axios from 'axios';

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 // ✅ Move BASE_URL here so it's available in all functions
  const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://backend-ui-1-a43x.onrender.com';

// Inside handleSubmit function
const handleCreate = async () => {
  try {
    const token = localStorage.getItem('token'); // ✅ token frontend pe saved hai?
    if (!token) {
      Swal.fire('Error', 'No token found. Please login again.', 'error');
      return;
    }

    const newTodo = {
      title,
      description,
      priority,
      dueDate,
    };

    const response = await axios.post(`https://backend-ui-1-a43x.onrender.com/api/todos`, newTodo, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true, // optional: if your backend uses credentials
    });

    Swal.fire('Success', 'Task created successfully!', 'success');
    navigate('/dashboard'); // or reload tasks
  } catch (error) {
    console.error('Create Error:', error.response?.data || error.message);
    Swal.fire('Error', error.response?.data?.message || 'Something went wrong.', 'error');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:max-w-2xl transition-all duration-500 hover:shadow-pink-500/50">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-pink-400 hover:text-pink-600 transform hover:-translate-x-1 hover:scale-110 transition-all duration-300"
            disabled={isLoading}
          >
            <FiArrowLeft className="h-7 w-7" />
          </button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse">
            Create Task
          </h1>
          <div className="w-7"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-800/60 text-red-300 rounded-xl animate-fade-in">
            {error}
          </div>
        )}

        <form
  onSubmit={(e) => {
    e.preventDefault(); // ⛔ stop page reload
    handleCreate();     // ✅ call create function
  }}
  className="space-y-8"
>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Task Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
              placeholder="Enter your task title..."
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
              rows="5"
              placeholder="Enter description (optional)..."
              disabled={isLoading}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-pink-400">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
                disabled={isLoading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-pink-400">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center space-x-3 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-pink-600 hover:bg-pink-700 hover:shadow-pink-400/50'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FiPlusCircle className="h-6 w-6 animate-spin-slow" />
                <span>Create Task</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
