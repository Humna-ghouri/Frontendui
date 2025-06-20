// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FiPlus, FiEdit2, FiTrash2, FiClock, 
//   FiList, FiSearch, FiFilter, FiX 
// } from 'react-icons/fi';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import moment from 'moment';

// const Dashboard = () => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingTask, setEditingTask] = useState(null);
//   const [editFormData, setEditFormData] = useState({
//     title: '',
//     description: '',
//     status: 'pending',
//     priority: 'medium',
//     dueDate: ''
//   });
//   const [isUpdating, setIsUpdating] = useState(false);
//   const navigate = useNavigate();

// const BASE_URL = import.meta.env.VITE_API_URL;

//   // Fetch todos on component mount
//   useEffect(() => {
//     const fetchTodos = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await axios.get(`${BASE_URL}/api/todos`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setTasks(response.data?.todos || []);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch todos:', err);
//         setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
//         if (err.response?.status === 401) {
//           localStorage.removeItem('token');
//           navigate('/signin');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTodos();
//   }, [navigate, BASE_URL]);

//   // Calculate statistics
//   const stats = useMemo(() => ({
//     total: tasks.length,
//     completed: tasks.filter(t => t.status === 'completed').length,
//     pending: tasks.filter(t => t.status === 'pending').length,
//     processing: tasks.filter(t => t.status === 'in-progress').length,
//   }), [tasks]);

//   // Filter tasks based on selected filter and search term
//   const filteredTasks = useMemo(() => 
//     tasks.filter(task => {
//       const matchesStatus = 
//         filter === 'all' || 
//         task.status === filter;
      
//       const matchesSearch = searchTerm 
//         ? task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//           task.description?.toLowerCase().includes(searchTerm.toLowerCase())
//         : true;
      
//       return matchesStatus && matchesSearch;
//     }),
//     [tasks, filter, searchTerm]
//   );
// const fetchAllTasks = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const BASE_URL = 'http://localhost:5000'; // or your production URL
//     const response = await axios.get(`${BASE_URL}/api/todos/all`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     console.log('Response data:', response.data); // Debug log
//     setTasks(response.data.todos);
    
//   } catch (err) {
//     console.error('Full error:', err);
//     if (err.response?.status === 404) {
//       setError('Endpoint not found - check backend routes');
//     } else if (err.response?.status === 401) {
//       navigate('/login');
//     } else {
//       setError(err.message);
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleCreateTask = () => navigate('/create-task');
  
//   const handleEditTask = (task) => {
//     setEditingTask(task._id);
//     setEditFormData({
//       title: task.title || '',
//       description: task.description || '',
//       status: task.status || 'pending',
//       priority: task.priority || 'medium',
//       dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''
//     });
//   };

//   const handleUpdateTask = async (taskId) => {
//     setIsUpdating(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) throw new Error('No authentication token found');

//       const { data } = await axios.put(
//         `${BASE_URL}/api/todos/${taskId}`,
//         editFormData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (data.success && data.todo) {
//         setTasks(prevTasks => 
//           prevTasks.map(task => 
//             task._id === taskId ? { ...task, ...data.todo } : task
//           )
//         );
//         setEditingTask(null);
//         Swal.fire({
//           title: 'Success!',
//           text: data.message || 'Task updated successfully.',
//           icon: 'success',
//           background: '#1a1a1a',
//           color: '#fff'
//         });
//       }
//     } catch (err) {
//       console.error('Update error:', err);
//       let errorMessage = err.response?.data?.message || 'Failed to update task.';
      
//       if (err.response?.data?.errors) {
//         errorMessage = err.response.data.errors.join('\n');
//       }
      
//       Swal.fire({
//         title: 'Error!',
//         text: errorMessage,
//         icon: 'error',
//         background: '#1a1a1a',
//         color: '#fff'
//       });
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteTask = async (id) => {
//     try {
//       const confirm = await Swal.fire({
//         title: 'Are you sure?',
//         text: "This will delete the task!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: 'Yes, delete it!',
//         background: '#1a1a1a',
//         color: '#fff',
//         confirmButtonColor: '#ec4899'
//       });

//       if (confirm.isConfirmed) {
//         const token = localStorage.getItem('token');
//         if (!token) throw new Error('No authentication token found');

//         await axios.delete(
//           `${BASE_URL}/api/todos/${id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           }
//         );

//         setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
//         Swal.fire({
//           title: 'Deleted!',
//           text: 'Task has been deleted.',
//           icon: 'success',
//           background: '#1a1a1a',
//           color: '#fff'
//         });
//       }
//     } catch (err) {
//       console.error('Delete Error:', err);
//       Swal.fire({
//         title: 'Error!',
//         text: err.response?.data?.message || 'Failed to delete task',
//         icon: 'error',
//         background: '#1a1a1a',
//         color: '#fff'
//       });
//     }
//   };
// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiList, FiClock, FiX } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', status: 'pending', priority: 'low', dueDate: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch and calc stats
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/todos/all`);
        setTasks(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const statsObj = tasks.reduce((s, t) => {
      s.total += 1;
      s[t.status] = (s[t.status] || 0) + 1;
      return s;
    }, { total: 0, pending: 0, 'in-progress': 0, completed: 0 });
    setStats(statsObj);

    let ft = tasks;
    if (filter !== 'all') ft = ft.filter(t => t.status === filter);
    if (searchTerm) {
      ft = ft.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTasks(ft);
  }, [tasks, searchTerm, filter]);

  const handleCreateTask = () => window.location.assign('/create-task');

  const handleEditTask = task => {
    setEditingTask(task);
    setEditFormData(task);
  };

  const handleUpdateTask = async () => {
    setIsUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${editingTask._id}`, editFormData);
      setTasks(prev => prev.map(t => (t._id === editingTask._id ? editFormData : t)));
      setEditingTask(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async id => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white p-8">
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setEditingTask(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><FiX /></button>
            {/* Edit form... same structure */}
          </div>
        </div>
      )}

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-pink-400">Task Dashboard</h1>
          <button onClick={handleCreateTask} className="bg-pink-600 p-2 rounded text-white flex items-center space-x-2">
            <FiPlus /><span>New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['total', 'completed', 'pending', 'in-progress'].map(key => (
            <div key={key} className={`bg-gray-800 p-4 rounded border-l-4 ${{
              total: 'border-pink-500',
              completed: 'border-green-500',
              pending: 'border-yellow-500',
              'in-progress': 'border-blue-500'
            }[key]}`}>
              <h2 className="text-gray-300">{key.charAt(0).toUpperCase() + key.slice(1)}</h2>
              <p className="text-white text-2xl">{stats[key] || 0}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter UI */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center bg-gray-800 rounded p-2 flex-1">
            <FiSearch className="mr-2 text-gray-400" />
            <input className="bg-transparent w-full outline-none text-white" placeholder="Search…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="p-2 bg-gray-800 text-white rounded" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Task list */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded text-center">
              <FiList className="mx-auto text-gray-500 mb-2" size={48} />
              <p className="text-gray-300">No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className={`bg-gray-800 p-4 rounded border-l-4 ${{
                completed: 'border-green-500',
                'in-progress': 'border-blue-500',
                pending: 'border-yellow-500'
              }[task.status]}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-green-400' : 'text-white'}`}>{task.title}</h3>
                    {task.description && <p className={task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-300'}>{task.description}</p>}
                    <div className="flex gap-2 mt-2 text-xs">
                      <span className={`px-2 rounded ${{
                        completed: 'bg-green-900 text-green-300',
                        'in-progress': 'bg-blue-900 text-blue-300',
                        pending: 'bg-yellow-900 text-yellow-300'
                      }[task.status]}`}>{task.status}</span>
                      {task.dueDate && <span className="text-gray-400"><FiClock className="inline mr-1" />{moment(task.dueDate).format('MMM D, YYYY')}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditTask(task)} className="text-gray-400 hover:text-pink-400"><FiEdit2 /></button>
                    <button onClick={() => handleDeleteTask(task._id)} className="text-gray-400 hover:text-red-400"><FiTrash2 /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
