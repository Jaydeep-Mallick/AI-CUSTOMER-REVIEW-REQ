import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const History = () => {
  const [generations, setGenerations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/history');
        const data = await response.json();
        if (data.success) {
          setGenerations(data.data);
        } else {
          toast.error('Failed to load history');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to connect to backend');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    toast.success('Copied to clipboard');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        const response = await fetch(`http://localhost:5001/api/history/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          setGenerations(generations.filter(g => g.id !== id));
          toast.success('Generation deleted');
        } else {
          toast.error('Failed to delete generation');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to connect to backend');
      }
    }
  };

  const filteredGenerations = generations.filter(g => 
    g.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generation History</h1>
          <p className="text-gray-600 mt-2">View and manage all previously generated review requests.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredGenerations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          <span className="text-4xl block mb-4">📭</span>
          <p className="text-lg">No generation history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredGenerations.map((gen) => (
            <div key={gen.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900">{gen.customerName}</h3>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{gen.tripType}</span>
                  <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">{gen.destination}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Generated on {new Date(gen.createdAt).toLocaleDateString()}
                  {gen.rating && <span className="ml-3 text-yellow-500">{'★'.repeat(gen.rating)}</span>}
                </p>
                <div className="bg-gray-50 rounded p-3 text-gray-700 text-sm border border-gray-100 relative group">
                  <p className="line-clamp-2">{gen.generatedMessage}</p>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2 justify-center md:min-w-[120px]">
                <button 
                  onClick={() => handleCopy(gen.generatedMessage)}
                  className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>📋</span> Copy
                </button>
                <button 
                  onClick={() => handleDelete(gen.id)}
                  className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>🗑️</span> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
