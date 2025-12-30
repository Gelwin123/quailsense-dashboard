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
    }, 800);

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
    humidity: { icon: Droplets, unit: "%", color: "#38bdf8" },
    heat: { icon: Wind, unit: "°C", color: "#fb7185" },
    ammonia: { icon: AlertTriangle, unit: "ppm", color: "#facc15" },
  };

  // Latest readings
  const tempCurrent = data.temperature[data.temperature.length - 1] || 0;
  const humCurrent = data.humidity[data.humidity.length - 1] || 0;
  const ammoniaCurrent = data.ammonia[data.ammonia.length - 1] || 0;

  // Smart insight logic based on temperature & humidity
  let smartMessage = "✅ Environment stable. All sensor values are within safe range.";
  let isWarning = false;

  if (tempCurrent > 30 && humCurrent > 70) {
    smartMessage =
      "⚠ High temperature and humidity detected. Ammonia levels may rise. Ventilation recommended.";
    isWarning = true;
  } else if (ammoniaCurrent > 6) {
    smartMessage =
      "⚠ Ammonia level rising. Ventilation adjustment recommended.";
    isWarning = true;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-3 py-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-800">
            QuailSense Dashboard
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 sm:mt-0">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-green-600 animate-pulse" />
              4 Sensors
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-green-600" />
              {lastUpdate ? lastUpdate.toLocaleTimeString() : "--:--"}
            </span>
          </div>
        </div>

        {/* SENSOR CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(sensors) as SensorKey[]).map((key) => {
            const Icon = sensors[key].icon;
            const values = data[key];
            const current = values[values.length - 1] || 0;
            const color = sensors[key].color;

            return (
              <div
                key={key}
                className="relative rounded-lg p-3 shadow-md border bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all duration-200"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
                  style={{ backgroundColor: color }}
                />
                <div className="flex items-center justify-between">
                  <div
                    className="p-1 rounded"
                    style={{ backgroundColor: `${color}30` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <span
                    className="text-[8px] px-1 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    LIVE
                  </span>
                </div>
                <p className="mt-1 text-[9px] uppercase tracking-wide text-gray-500">
                  {key}
                </p>
                <p className="text-lg font-bold text-gray-800 leading-tight">
                  {current}
                  <span className="text-[10px] ml-1 text-gray-500">
                    {sensors[key].unit}
                  </span>
                </p>
                <Sparklines data={values} height={16}>
                  <SparklinesLine
                    color={color}
                    style={{ strokeWidth: 2, fill: "none" }}
                  />
                </Sparklines>
              </div>
            );
          })}
        </div>

        {/* SMART INSIGHTS */}
        <div
          className={`mt-3 p-3 rounded-xl shadow-md border flex items-center gap-2 ${
            isWarning
              ? "bg-gradient-to-r from-red-100 via-red-200 to-red-100 border-red-300"
              : "bg-gradient-to-r from-green-100 via-green-200 to-green-100 border-green-200"
          }`}
        >
          <Bell className={`w-5 h-5 ${isWarning ? "text-red-700" : "text-green-700"}`} />
          <div>
            <h2 className={`text-sm font-semibold mb-1 ${isWarning ? "text-red-800" : "text-green-800"}`}>
              Smart Insight
            </h2>
            <p className="text-xs text-gray-700">{smartMessage}</p>
          </div>
        </div>

        {/* SYSTEM EVENTS */}
        <div className="mt-2 p-3 rounded-xl shadow-md bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 border border-blue-200">
          <h2 className="text-sm font-semibold text-blue-800 mb-1">
            Recent Events
          </h2>
          <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>✔ Ventilation fan adjusted</li>
            <li>✔ Temperature stabilized</li>
            <li>✔ All sensors normal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
