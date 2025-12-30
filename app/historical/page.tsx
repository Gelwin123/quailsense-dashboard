"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparklines, SparklinesLine } from "react-sparklines";

type SensorKey = "temperature" | "humidity" | "heat" | "ammonia";

export default function HistoricalPage() {
  const MAX = 20;

  const [data, setData] = useState<Record<SensorKey, number[]>>({
    temperature: [],
    humidity: [],
    heat: [],
    ammonia: [],
  });

  useEffect(() => {
    const generateData = () => ({
      temperature: Array.from({ length: MAX }, () => random(27, 33)),
      humidity: Array.from({ length: MAX }, () => random(60, 75)),
      heat: Array.from({ length: MAX }, () => random(32, 38)),
      ammonia: Array.from({ length: MAX }, () => random(3, 8)),
    });
    setData(generateData());
  }, []);

  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const sensors = {
    temperature: { unit: "°C", color: "#22c55e" },
    humidity: { unit: "%", color: "#38bdf8" },
    heat: { unit: "°C", color: "#fb7185" },
    ammonia: { unit: "ppm", color: "#facc15" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Historical Data
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(sensors) as SensorKey[]).map((key) => {
            const values = data[key];
            const color = sensors[key].color;

            return (
              <div
                key={key}
                className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                {/* Gradient Glow */}
                <div
                  className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                  style={{ background: `linear-gradient(135deg, ${color}55, ${color}00)` }}
                />

                <div className="relative z-10">
                  <h2
                    className="text-sm font-semibold text-gray-700 uppercase mb-2 tracking-wide"
                    style={{ color }}
                  >
                    {key} ({sensors[key].unit})
                  </h2>

                  <div className="mb-2">
                    <Sparklines data={values} height={50}>
                      <SparklinesLine color={color} style={{ strokeWidth: 3, fill: "rgba(0,0,0,0)" }} />
                    </Sparklines>
                  </div>

                  <div className="overflow-x-auto mt-2">
                    <table className="table-auto w-full text-xs text-gray-600 border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 border">#</th>
                          <th className="px-2 py-1 border">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.map((v, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-2 py-1 border">{i + 1}</td>
                            <td className="px-2 py-1 border">{v}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
