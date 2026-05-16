// BMI Tracking Chart component
// Displays BMI progression over time
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BMITrackingChart = ({ bmiHistory = [] }) => {
  // Prepare data for chart
  const chartData = {
    labels: bmiHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'BMI',
        data: bmiHistory.map((entry) => parseFloat(entry.bmi.toFixed(1))),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      // Normal BMI range lines
      {
        label: 'Normal Range (18.5)',
        data: bmiHistory.map(() => 18.5),
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Normal Range (24.9)',
        data: bmiHistory.map(() => 24.9),
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            if (context.datasetIndex === 0) {
              const bmi = context.parsed.y;
              let category = '';
              if (bmi < 18.5) category = 'Underweight';
              else if (bmi < 25) category = 'Normal';
              else if (bmi < 30) category = 'Overweight';
              else category = 'Obese';
              return `BMI: ${bmi.toFixed(1)} (${category})`;
            }
            return context.dataset.label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 15,
        max: 35,
        ticks: {
          stepSize: 2,
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (bmiHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No BMI data available. Update your weight and height in Profile to track BMI.</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default BMITrackingChart;

