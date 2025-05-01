
// import React, { useState, useEffect } from 'react';
// import { FiPlusCircle } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// function HomePage() {
//   const [tasks, setTasks] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//     setTasks(storedTasks);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
//             All Tasks
//           </h1>
//           {/* <button
//             onClick={() => navigate('/loan-request')}
//             className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1"
//           >
//             <FiPlusCircle className="h-5 w-5" /> Add Task
//           </button> */}
//         </div>

//         {tasks.length === 0 ? (
//           <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-lg text-center">
//             <p className="text-xl text-gray-400">No tasks available</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {tasks.map((task) => (
//               <div 
//                 key={task.id} 
//                 className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl shadow-lg hover:shadow-pink-500/50 transition-all duration-500 transform hover:-translate-y-1"
//               >
//                 <h2 className="text-xl font-bold text-pink-400 mb-2">{task.title}</h2>
//                 <p className="text-gray-300 mb-4">{task.description}</p>
//                 <p className="text-sm text-gray-500">
//                   Status: <span className="text-pink-400">{task.status}</span>
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default HomePage;
import React, { useState, useEffect } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get('https://backendui.onrender.com/api/todos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Handle different response formats
        let tasksData = [];
        if (Array.isArray(response.data)) {
          tasksData = response.data;
        } else if (response.data && Array.isArray(response.data.todos)) {
          tasksData = response.data.todos;
        } else if (response.data && Array.isArray(response.data.data)) {
          tasksData = response.data.data;
        }

        if (tasksData.length === 0) {
          console.warn('No tasks found in response:', response.data);
        }

        setTasks(tasksData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load tasks');
        setTasks([]); // Reset tasks on error
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-pink-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex items-center justify-center">
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <h3 className="text-xl font-bold text-pink-400 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
            All Tasks
          </h1>
          <button
            onClick={() => navigate('/loan-request')}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            <FiPlusCircle className="h-5 w-5" /> Add New Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-lg text-center">
            <p className="text-xl text-gray-400">No tasks found</p>
            <button
              onClick={() => navigate('/loan-request')}
              className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white inline-flex items-center gap-2"
            >
              <FiPlusCircle /> Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id || task.id}
                className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all duration-300 border border-gray-800 hover:border-pink-500/30"
              >
                <h2 className="text-xl font-bold text-pink-400 mb-2 truncate">{task.title}</h2>
                <p className="text-gray-300 mb-4 line-clamp-3">{task.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-900 text-green-300' :
                    task.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-pink-900 text-pink-300'
                  }`}>
                    {task.status || 'pending'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;