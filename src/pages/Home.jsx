// import React from 'react';
// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
//       {/* Header Section */}
//       <header className="text-center mb-12">
//         <h1 className="text-5xl font-extrabold text-gray-800 mb-4 font-serif">
//           <span className="text-blue-600">Qarze Hasana</span> Microfinance
//         </h1>
//         <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
//           Interest-free loans for empowerment, brought to you by Saylani Welfare Trust
//         </p>
//       </header>

//       {/* Main Content */}
//       <main className="w-full max-w-4xl">
//         {/* Features Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           {[
//             {
//               icon: '📋',
//               title: 'Easy Application',
//               desc: 'Simple 3-step process to request Qarze Hasana'
//             },
//             {
//               icon: '⏱️',
//               title: 'Quick Approval',
//               desc: 'Get decisions within 72 hours'
//             },
//             {
//               icon: '💰',
//               title: 'Zero Interest',
//               desc: 'True to Islamic finance principles'
//             }
//           ].map((feature, index) => (
//             <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
//               <p className="text-gray-600">{feature.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* CTA Section */}
//         <div className="text-center bg-white p-8 rounded-xl shadow-sm">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Ready to Begin Your Journey?</h2>
//           <p className="text-gray-600 mb-6">Join thousands who have benefited from our Qarze Hasana program</p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4">
//             <Link
//               to="/signup"
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
//             >
//               Register Now
//             </Link>
//             <Link
//               to="/signin"
//               className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
//             >
//               Existing User? Sign In
//             </Link>
//           </div>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="mt-16 text-center text-gray-500 text-sm">
//         <p>In partnership with Saylani Welfare International Trust</p>
//         <p className="mt-2">© {new Date().getFullYear()} Qarze Hasana Microfinance. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;

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