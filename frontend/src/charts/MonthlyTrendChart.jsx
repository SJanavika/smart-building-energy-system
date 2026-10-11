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

export default function MonthlyTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-400">No monthly data available</div>;
  }

  const chartData = {
    labels: data.map(d => d.monthLabel),
    datasets: [
      {
        label: 'Monthly Consumption (kWh)',
        data: data.map(d => d.consumption),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0284c7',
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const index = context.dataIndex;
            return `Cost: ₹${data[index]?.cost?.toLocaleString() || 0}`;
          }
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        title: { display: true, text: 'kWh' }
      }
    }
  };

  return (
    <div className="h-72 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
