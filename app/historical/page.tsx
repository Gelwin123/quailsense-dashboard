"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
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
} from "chart.js";
import { Line } from "react-chartjs-2";

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

type SensorKey = "Temperature" | "Humidity" | "Heat" | "Ammonia";

export default function HistoricalPage() {
  const DAYS = 10;

  const [dataPoints, setDataPoints] = useState<Record<SensorKey, number[]>>({
    Temperature: [],
    Humidity: [],
    Heat: [],
    Ammonia: [],
  });

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    setDataPoints({
      Temperature: Array.from({ length: DAYS }, () => random(27, 33)),
      Humidity: Array.from({ length: DAYS }, () => random(60, 75)),
      Heat: Array.from({ length: DAYS }, () => random(32, 38)),
      Ammonia: Array.from({ length: DAYS }, () => random(3, 8)),
    });
  }, []);

  const latest = {
    Temperature: dataPoints.Temperature.at(-1),
    Humidity: dataPoints.Humidity.at(-1),
    Heat: dataPoints.Heat.at(-1),
    Ammonia: dataPoints.Ammonia.at(-1),
  };

  const chartData = {
    labels: Array.from({ length: DAYS }, (_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Temperature (°C)",
        data: dataPoints.Temperature,
        borderColor: "#16a34a",
        backgroundColor: "#16a34a22",
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        label: "Humidity (%)",
        data: dataPoints.Humidity,
        borderColor: "#0284c7",
        backgroundColor: "#0284c722",
        tension: 0.4,
        yAxisID: "y2",
      },
      {
        label: "Heat Index (°C)",
        data: dataPoints.Heat,
        borderColor: "#dc2626",
        backgroundColor: "#dc262622",
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        label: "Ammonia (ppm)",
        data: dataPoints.Ammonia,
        borderColor: "#ca8a04",
        backgroundColor: "#ca8a0422",
        tension: 0.4,
        yAxisID: "y2",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Environmental Trends (Last 10 Days)",
        font: { size: 18, weight: "bold" as const },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y1: {
        position: "left" as const,
        min: 25,
        max: 40,
        title: {
          display: true,
          text: "Temperature / Heat (°C)",
        },
      },
      y2: {
        position: "right" as const,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Humidity (%) / Ammonia (ppm)",
        },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">
          🐤 QuailSense Historical Monitoring
        </h1>
        <p className="text-gray-600 mb-6">
          Review environmental conditions inside the quail house
        </p>

        {/* Sensor Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard label="Temperature" value={`${latest.Temperature ?? "--"} °C`} color="green" />
          <SummaryCard label="Humidity" value={`${latest.Humidity ?? "--"} %`} color="blue" />
          <SummaryCard label="Heat Index" value={`${latest.Heat ?? "--"} °C`} color="red" />
          <SummaryCard label="Ammonia" value={`${latest.Ammonia ?? "--"} ppm`} color="yellow" />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 h-[420px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

/* Reusable summary card */
function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "green" | "blue" | "red" | "yellow";
}) {
  const colors: Record<string, string> = {
    green: "border-green-500 text-green-700",
    blue: "border-blue-500 text-blue-700",
    red: "border-red-500 text-red-700",
    yellow: "border-yellow-500 text-yellow-700",
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${colors[color]}`}>
      <p className="text-sm font-medium">{label}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
