// Comparison chart component (week vs week)
import React from 'react';
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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ComparisonChart = ({ currentWeekData, previousWeekData, metric = 'steps' }) => {
  if (!currentWeekData || currentWeekData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available for comparison
      </div>
    );
  }

  const getMetricValue = (item) => {
    switch (metric) {
      case 'steps':
        return item.steps;
      case 'distance':
        return item.distance;
      case 'calories':
        return item.calories;
      case 'exerciseTime':
        return item.exerciseTime;
      default:
        return item.steps;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'steps':
        return 'Steps';
      case 'distance':
        return 'Distance (km)';
      case 'calories':
        return 'Calories';
      case 'exerciseTime':
        return 'Exercise Time (min)';
      default:
        return 'Steps';
    }
  };

  const labels = currentWeekData.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const currentData = currentWeekData.map((item) => getMetricValue(item));
  const previousData = previousWeekData
    ? previousWeekData.map((item) => getMetricValue(item))
    : [];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'This Week',
        data: currentData,
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgb(76, 175, 80)',
        borderWidth: 2,
      },
      ...(previousWeekData && previousWeekData.length > 0
        ? [
            {
              label: 'Last Week',
              data: previousData,
              backgroundColor: 'rgba(33, 150, 243, 0.6)',
              borderColor: 'rgb(33, 150, 243)',
              borderWidth: 2,
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ComparisonChart;

