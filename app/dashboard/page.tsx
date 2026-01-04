"use client";

import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import Navbar from "@/components/Navbar";
import {
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  Activity,
  Clock,
  Bell,
} from "lucide-react";

type SensorKey = "temperature" | "humidity" | "heat" | "ammonia";

export default function DashboardPage() {
  const MAX = 10;

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [data, setData] = useState<Record<SensorKey, number[]>>({
    temperature: Array(MAX).fill(0),
    humidity: Array(MAX).fill(0),
    heat: Array(MAX).fill(0),
    ammonia: Array(MAX).fill(0),
  });

  useEffect(() => {
    const initData = {
      temperature: Array.from({ length: MAX }, () => random(27, 33)),
      humidity: Array.from({ length: MAX }, () => random(64, 74)),
      heat: Array.from({ length: MAX }, () => random(32, 38)),
      ammonia: Array.from({ length: MAX }, () => random(3, 8)),
    };
    setData(initData);
    setLastUpdate(new Date());

    const interval = setInterval(() => {
      setData((prev) => ({
        temperature: shift(prev.temperature, 27, 33),
        humidity: shift(prev.humidity, 64, 74),
        heat: shift(prev.heat, 32, 38),
        ammonia: shift(prev.ammonia, 3, 8),
      }));
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const shift = (arr: number[], min: number, max: number) => [
    ...arr.slice(-MAX + 1),
    random(min, max),
  ];

  const sensors = {
    temperature: { icon: Thermometer, unit: "°C", color: "#22c55e" },
    humidity: { icon: Droplets, unit: "%", color: "#0ea5e9" },
    heat: { icon: Wind, unit: "°C", color: "#ef4444" },
    ammonia: { icon: AlertTriangle, unit: "ppm", color: "#eab308" },
  };

  const tempCurrent = data.temperature.at(-1) ?? 0;
  const humCurrent = data.humidity.at(-1) ?? 0;
  const ammoniaCurrent = data.ammonia.at(-1) ?? 0;

  let message = "✅ Environment stable. All sensor values are within safe range.";
  let warning = false;

  if (tempCurrent > 30 && humCurrent > 70) {
    message =
      "⚠ High temperature & humidity detected. Ammonia may rise. Ventilation recommended.";
    warning = true;
  } else if (ammoniaCurrent > 6) {
    message = "⚠ Ammonia level rising. Ventilation adjustment recommended.";
    warning = true;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-100 font-sans">
      {/* Inline CSS for fonts & custom styles */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&family=Inter:wght@400;600;700&display=swap');

        h1, h2 {
          font-family: 'Roboto Slab', serif;
        }
        body {
          font-family: 'Inter', sans-serif;
        }
        .card {
          background: linear-gradient(145deg, rgba(255,255,255,0.85), rgba(245,245,245,0.85));
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }
        .sensor-icon {
          font-size: 1.5rem;
          padding: 0.5rem;
          border-radius: 50%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .live-badge {
          font-weight: 700;
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.5rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.3);
          backdrop-filter: blur(4px);
        }
        .smart-insight {
          border-left: 5px solid #22c55e;
          background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9));
          backdrop-filter: blur(12px);
          padding: 1rem;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .smart-insight.warning {
          border-left-color: #ef4444;
        }
        .system-badge {
          background: rgba(255,255,255,0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.65rem;
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          h1 {
            font-size: 1.75rem;
          }
          .smart-insight {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        `}
      </style>

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-900 flex items-center gap-2">
            🐤 QuailSense Dashboard
          </h1>

          <div className="flex gap-3 text-xs flex-wrap">
            <span className="system-badge animate-pulse">
              <Activity className="w-3 h-3 text-green-600" />
              ACTIVE
            </span>
            <span className="system-badge">
              <Clock className="w-3 h-3" />
              {lastUpdate?.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* SENSOR CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.keys(sensors) as SensorKey[]).map((key) => {
            const Icon = sensors[key].icon;
            const value = data[key].at(-1) ?? 0;

            return (
              <div key={key} className="card p-5">
                <div className="flex justify-between items-center mb-2">
                  <Icon
                    className="sensor-icon"
                    style={{ backgroundColor: sensors[key].color }}
                  />
                  <span
                    className="live-badge"
                    style={{ backgroundColor: `${sensors[key].color}30` }}
                  >
                    LIVE
                  </span>
                </div>

                <p className="text-sm text-gray-600 uppercase">{key}</p>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {value}
                  <span className="text-xs text-gray-500 ml-1">
                    {sensors[key].unit}
                  </span>
                </p>

                <Sparklines data={data[key]} height={30}>
                  <SparklinesLine
                    color={sensors[key].color}
                    style={{ strokeWidth: 3, fill: `${sensors[key].color}15` }}
                  />
                </Sparklines>
              </div>
            );
          })}
        </div>

        {/* SMART INSIGHT */}
        <div className={`smart-insight mt-6 ${warning ? "warning" : ""}`}>
          <Bell className={`w-6 h-6 ${warning ? "text-red-600" : "text-green-600"}`} />
          <div>
            <h2 className="text-lg font-bold">
              Smart Insight
            </h2>
            <p className="text-sm text-gray-700 mt-1">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
