
import React, { useState, useEffect } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
            All Tasks
          </h1>
          {/* <button
            onClick={() => navigate('/loan-request')}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-pink-400/50 transition-all duration-500 transform hover:-translate-y-1"
          >
            <FiPlusCircle className="h-5 w-5" /> Add Task
          </button> */}
        </div>

        {tasks.length === 0 ? (
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-xl shadow-lg text-center">
            <p className="text-xl text-gray-400">No tasks available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl shadow-lg hover:shadow-pink-500/50 transition-all duration-500 transform hover:-translate-y-1"
              >
                <h2 className="text-xl font-bold text-pink-400 mb-2">{task.title}</h2>
                <p className="text-gray-300 mb-4">{task.description}</p>
                <p className="text-sm text-gray-500">
                  Status: <span className="text-pink-400">{task.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;