import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CHART_COLORS } from '../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DevicePieChart({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-slate-400">No device telemetry available</div>;
  }

  const chartData = {
    labels: data.map(d => d.deviceName),
    datasets: [
      {
        data: data.map(d => d.totalKwh),
        backgroundColor: CHART_COLORS.palette.slice(0, data.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 12,
          font: { family: 'Inter', size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const item = data[context.dataIndex];
            return ` ${label}: ${value.toLocaleString()} kWh (${item?.percentage || 0}%)`;
          }
        }
      }
    },
    cutout: '62%'
  };

  return (
    <div className="h-72 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
