import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/analytics`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          toast.error('Failed to load analytics data');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to connect to backend for analytics');
        // Fallback to empty state if backend fails
        setStats({
          totalGenerations: 0,
          averageRating: 0,
          positiveFeedback: 0,
          generationsPerDay: { labels: [], data: [] },
          toneUsage: { labels: [], data: [] },
          tripTypes: { labels: [], data: [] }
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const chartColors = {
    primary: 'rgba(59, 130, 246, 0.8)',
    primaryBorder: 'rgba(59, 130, 246, 1)',
    secondary: 'rgba(139, 92, 246, 0.8)',
    tertiary: 'rgba(16, 185, 129, 0.8)',
    palette: [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(139, 92, 246, 0.8)',  // Purple
      'rgba(16, 185, 129, 0.8)',  // Green
      'rgba(245, 158, 11, 0.8)',  // Yellow
      'rgba(239, 68, 68, 0.8)',   // Red
    ]
  };

  const lineChartData = {
    labels: stats.generationsPerDay.labels,
    datasets: [
      {
        label: 'Generations',
        data: stats.generationsPerDay.data,
        borderColor: chartColors.primaryBorder,
        backgroundColor: chartColors.primary,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: stats.tripTypes.labels,
    datasets: [
      {
        label: 'Trip Types',
        data: stats.tripTypes.data,
        backgroundColor: chartColors.palette,
      },
    ],
  };

  const doughnutData = {
    labels: stats.toneUsage.labels,
    datasets: [
      {
        data: stats.toneUsage.data,
        backgroundColor: chartColors.palette,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of generation usage, feedback, and trends.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg text-2xl">⚡</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Generations</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalGenerations}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-lg text-2xl">⭐</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Average Rating</p>
            <p className="text-3xl font-bold text-gray-900">{stats.averageRating} <span className="text-sm font-normal text-gray-500">/ 5.0</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg text-2xl">📈</div>
          <div>
            <p className="text-sm font-medium text-gray-500">Positive Feedback</p>
            <p className="text-3xl font-bold text-gray-900">{stats.positiveFeedback}%</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Generations Over Time (Last 7 Days)</h3>
          <div className="h-72">
            <Line options={lineOptions} data={lineChartData} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Common Trip Types</h3>
          <div className="h-64">
            <Bar options={{...lineOptions, indexAxis: 'y'}} data={barChartData} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tone Usage Distribution</h3>
          <div className="h-64 flex-1 flex justify-center">
            <Doughnut options={{ maintainAspectRatio: false }} data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
