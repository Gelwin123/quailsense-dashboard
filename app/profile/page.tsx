"use client";

import { useState } from "react";

export default function DashboardPage() {
  const user = { email: "user@example.com" };
  const [isProfileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-green-50 p-6 relative">
      {/* Profile Button Top Right */}
      <button
        onClick={() => setProfileOpen(true)}
        className="absolute top-6 right-6 px-4 py-2 bg-green-600 text-white rounded-full font-semibold shadow hover:bg-green-700"
      >
        Profile
      </button>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="w-64 bg-white rounded-xl shadow-md p-4 m-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold text-green-700 mb-2">Profile</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <a
                href="/historical"
                className="py-2 px-4 bg-green-600 text-white rounded-xl font-semibold shadow hover:bg-green-700 text-center"
              >
                Historical Data
              </a>
              <a
                href="/detectors"
                className="py-2 px-4 bg-yellow-500 text-white rounded-xl font-semibold shadow hover:bg-yellow-600 text-center"
              >
                Detector Station
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Placeholder */}
      <h1 className="text-3xl font-bold text-green-800 text-center mt-10">
        Welcome to QuailSense
      </h1>
      <p className="text-center mt-2 text-gray-700">
        Click the profile button at top-right to see your profile
      </p>
    </div>
  );
}
