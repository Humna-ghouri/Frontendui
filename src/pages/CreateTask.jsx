

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// function CreateTask() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title || !description) {
//       setError('Both title and description are required');
//       return;
//     }

//     // Get existing tasks from localStorage
//     const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
//     // Create new task
//     const newTask = {
//       id: Date.now().toString(),
//       title,
//       description,
//       status: 'To Do',
//       createdAt: new Date().toISOString()
//     };

//     // Save to localStorage
//     localStorage.setItem('tasks', JSON.stringify([...tasks, newTask]));
    
//     // Redirect to home page after task creation
//     navigate('/');
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-4">Create New Task</h1>
      
//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-2 border rounded"
//             placeholder="Task title"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded"
//             rows="4"
//             placeholder="Task description"
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
//         >
//           Create Task
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreateTask;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import Swal from 'sweetalert2';
import axios from 'axios';

function CreateTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError('Title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please login.');
        return;
      }

      await axios.post(
        'https://backendui.onrender.com/api/todos',
        { title, description },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      Swal.fire({
        title: 'Success!',
        text: 'Task created successfully',
        icon: 'success'
      }).then(() => navigate('/loan-calculator'));

    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md mx-auto bg-gradient-to-b from-gray-900 to-black rounded-3xl shadow-2xl p-8 md:max-w-2xl transition-all duration-500 hover:shadow-pink-500/50">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-pink-400 hover:text-pink-600 transform hover:-translate-x-1 hover:scale-110 transition-all duration-300"
          >
            <FiArrowLeft className="h-7 w-7" />
          </button>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse">
            Create Task
          </h1>
          <div className="w-7"></div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-800/60 text-red-300 rounded-xl shadow-inner animate-bounce">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-pink-400">Task Title*</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-pink-400 rounded-xl bg-black text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-inner transition-all duration-300"
              placeholder="Enter your task title..."
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
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105"
          >
            <FiPlusCircle className="h-6 w-6 animate-spin-slow" />
            <span>Create Task</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
