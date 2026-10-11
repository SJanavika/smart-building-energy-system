import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

export default function DailyTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-400">No daily telemetry data available</div>;
  }

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Daily Consumption (kWh)',
        data: data.map(d => d.consumption),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y'
      },
      {
        label: 'Energy Cost (₹)',
        data: data.map(d => d.cost),
        borderColor: '#0d9488',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
        }
      },
      tooltip: {
        padding: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter' } }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'kWh' },
        grid: { color: '#f1f5f9' },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'Cost (₹)' },
        grid: { drawOnChartArea: false },
      }
    }
  };

  return (
    <div className="h-72 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
