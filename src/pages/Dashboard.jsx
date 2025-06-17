import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiClock, 
  FiList, FiSearch, FiFilter, FiX 
} from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://your-production-url.com';

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`${BASE_URL}/api/todos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(response.data?.todos || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch todos:', err);
        setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [navigate, BASE_URL]);

  // Calculate statistics
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    processing: tasks.filter(t => t.status === 'in-progress').length,
  }), [tasks]);

  // Filter tasks based on selected filter and search term
  const filteredTasks = useMemo(() => 
    tasks.filter(task => {
      const matchesStatus = 
        filter === 'all' || 
        task.status === filter;
      
      const matchesSearch = searchTerm 
        ? task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      return matchesStatus && matchesSearch;
    }),
    [tasks, filter, searchTerm]
  );
const fetchAllTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const BASE_URL = 'http://localhost:5000'; // or your production URL
    const response = await axios.get(`${BASE_URL}/api/todos/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Response data:', response.data); // Debug log
    setTasks(response.data.todos);
    
  } catch (err) {
    console.error('Full error:', err);
    if (err.response?.status === 404) {
      setError('Endpoint not found - check backend routes');
    } else if (err.response?.status === 401) {
      navigate('/login');
    } else {
      setError(err.message);
    }
  } finally {
    setLoading(false);
  }
};

  const handleCreateTask = () => navigate('/create-task');
  
  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditFormData({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'pending',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''
    });
  };

  const handleUpdateTask = async (taskId) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const { data } = await axios.put(
        `${BASE_URL}/api/todos/${taskId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success && data.todo) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task._id === taskId ? { ...task, ...data.todo } : task
          )
        );
        setEditingTask(null);
        Swal.fire({
          title: 'Success!',
          text: data.message || 'Task updated successfully.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff'
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      let errorMessage = err.response?.data?.message || 'Failed to update task.';
      
      if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.join('\n');
      }
      
      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: "This will delete the task!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#ec4899'
      });

      if (confirm.isConfirmed) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        await axios.delete(
          `${BASE_URL}/api/todos/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Task has been deleted.',
          icon: 'success',
          background: '#1a1a1a',
          color: '#fff'
        });
      }
    } catch (err) {
      console.error('Delete Error:', err);
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || 'Failed to delete task',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-pink-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black flex justify-center items-center">
        <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
          <h3 className="text-xl font-bold text-pink-400 mb-2">Error Loading Tasks</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg text-white transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/signin')}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setEditingTask(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-pink-400 mb-6">Edit Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <button
                onClick={() => handleUpdateTask(editingTask)}
                disabled={isUpdating}
                className={`w-full py-2 text-white rounded-lg mt-6 focus:ring-2 focus:ring-pink-400 ${
                  isUpdating ? 'bg-pink-700 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-400">Task Dashboard</h1>
          
          <button
            onClick={handleCreateTask}
            className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-pink-500">
            <h2 className="text-sm md:text-base font-semibold text-gray-300">Total Tasks</h2>
            <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.total}</p>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-green-500">
            <h2 className="text-sm md:text-base font-semibold text-gray-300">Completed</h2>
            <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.completed}</p>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-500">
            <h2 className="text-sm md:text-base font-semibold text-gray-300">Pending</h2>
            <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.pending}</p>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500">
            <h2 className="text-sm md:text-base font-semibold text-gray-300">Processing</h2>
            <p className="text-2xl md:text-3xl font-bold text-white mt-2">{stats.processing}</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center bg-gray-800 rounded-lg px-4 border border-gray-700">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-transparent text-white focus:outline-none"
            />
          </div>
          
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 bg-gray-800 text-white rounded-lg border border-gray-700 w-full appearance-none pr-8"
            >
              <option value="all">All Tasks ({stats.total})</option>
              <option value="pending">Pending ({stats.pending})</option>
              <option value="in-progress">Processing ({stats.processing})</option>
              <option value="completed">Completed ({stats.completed})</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <FiList className="mx-auto h-12 w-12 text-gray-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-300">No tasks found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm ? 'Try a different search term' : 'Create a new task to get started'}
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task._id} 
                className={`bg-gray-800 p-5 rounded-xl border-l-4 ${
                  task.status === 'completed' ? 'border-green-500 opacity-90' : 
                  task.status === 'in-progress' ? 'border-blue-500' : 'border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-lg md:text-xl font-semibold ${
                      task.status === 'completed' ? 'text-green-400 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-2 ${
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-300'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-900 text-green-300' : 
                        task.status === 'in-progress' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {task.status === 'in-progress' ? 'Processing' : task.status}
                      </span>
                      
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-900 text-red-300' : 
                        task.priority === 'medium' ? 'bg-orange-900 text-orange-300' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {task.priority} priority
                      </span>
                      
                      {task.dueDate && (
                        <span className="inline-flex items-center text-xs text-gray-400">
                          <FiClock className="mr-1" />
                          Due: {moment(task.dueDate).format('MMM D, YYYY')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 text-gray-400 hover:text-pink-400 rounded-full hover:bg-gray-700 transition-colors"
                      title="Edit task"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700 transition-colors"
                      title="Delete task"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
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