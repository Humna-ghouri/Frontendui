import React, { useState, useEffect } from 'react';
import { FiPlusCircle, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

useEffect(() => {
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos/all');
      
      if (response.data && response.data.success) {
        setTodos(response.data.todos);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  fetchTodos();
}, []);

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-pink-400">Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="p-8 bg-gray-800 rounded-lg max-w-md text-center">
          <h3 className="text-xl font-bold text-pink-500 mb-4">Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            All Tasks ({filteredTodos.length})
          </h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="pl-4 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <button
              onClick={() => navigate('/signin')}
              className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg"
            >
              <FiPlusCircle /> New
            </button>
          </div>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="p-8 text-center bg-gray-800 rounded-lg">
            <p className="text-gray-400">
              {todos.length === 0 ? 'No tasks found in the database' : 'No tasks match your filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map(todo => (
              <div 
                key={todo._id} 
                className="bg-gray-800 rounded-lg p-6 hover:shadow-lg hover:shadow-pink-500/10 transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold truncate">{todo.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todo.status === 'completed' ? 'bg-green-900 text-green-300' :
                    todo.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-pink-900 text-pink-300'
                  }`}>
                    {todo.status}
                  </span>
                </div>

                {todo.description && (
                  <p className="text-gray-400 mb-4 line-clamp-3">{todo.description}</p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {todo.user?.name || todo.user?.email || 'Unknown user'}
                  </span>
                  <span>
                    {new Date(todo.createdAt).toLocaleDateString()}
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