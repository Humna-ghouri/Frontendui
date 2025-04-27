import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiCheck, FiClock, 
  FiList, FiFlag, FiSearch, FiFilter, FiArrowLeft, FiX 
} from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(data.todos);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch tasks.',
          icon: 'error',
          background: '#1a1a1a',
          color: '#fff'
        });
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const handleCreateTask = () => navigate('/loan-request');
  
  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : ''
    });
  };

  const handleUpdateTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `http://localhost:5000/api/todos/${taskId}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks(tasks.map(task => 
        task._id === taskId ? data.todo : task
      ));
      
      setEditingTask(null);
      Swal.fire({
        title: 'Success!',
        text: 'Task updated successfully.',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff'
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update task.',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff'
      });
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
        const response = await axios.delete(
          `http://localhost:5000/api/todos/${id}`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data.success) {
          setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Task has been deleted.',
            icon: 'success',
            background: '#1a1a1a',
            color: '#fff'
          });
        }
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
                    <option value="in-progress">In Progress</option>
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
                className="w-full py-2 bg-pink-500 text-white rounded-lg mt-6 hover:bg-pink-600 focus:ring-2 focus:ring-pink-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-pink-400">Dashboard</h1>
          
          <button
            onClick={handleCreateTask}
            className="text-pink-400 hover:text-pink-500 flex items-center space-x-2"
          >
            <FiPlus className="h-5 w-5" />
            <span>Request Task</span>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-pink-400">Total Tasks</h2>
            <p className="text-4xl text-white mt-4">{stats.total}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-pink-400">Completed Tasks</h2>
            <p className="text-4xl text-white mt-4">{stats.completed}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold text-pink-400">Pending Tasks</h2>
            <p className="text-4xl text-white mt-4">{stats.pending}</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center bg-gray-800 rounded-lg px-4">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded-lg"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="mt-6">
          {filteredTasks.length === 0 ? (
            <p className="text-white text-center py-8">No tasks found</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task._id} className="bg-gray-800 p-6 rounded-xl mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-pink-400">{task.title}</h3>
                  <p className="text-gray-300 mt-2">{task.description}</p>
                  <div className="flex items-center mt-2 text-gray-400">
                    <FiClock className="mr-2" />
                    <span>{moment(task.createdAt).format('MMMM Do, YYYY')}</span>
                  </div>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' : 
                    task.status === 'in-progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {task.status}
                  </span>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-pink-400 hover:text-pink-500"
                  >
                    <FiEdit2 className="h-6 w-6" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-pink-400 hover:text-pink-500"
                  >
                    <FiTrash2 className="h-6 w-6" />
                  </button>
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