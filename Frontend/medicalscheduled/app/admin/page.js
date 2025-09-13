"use client"
import { useState, useEffect } from "react";
import AdminController from "../../components/AdminLayout"

export default function Admin() {
  const [doctor, setDoctor] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [overallRate, setOverallRate] = useState(0);
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctor, setTotalDoctores] = useState(0);


  useEffect(() => {
    async function fetchRatings() {
      try {
        const token = localStorage.getItem("jwt");

        const response = await fetch("https://localhost:44316/api/admin/GetOverAllRate", {
          headers: { Authorization: `Bearer ${token}`
      },
    });
  const data = await response.json();

  if (data.success) {
    setOverallRate(data.overallRate);

    const starCounts = data.starCounts;
    const total = Object.values(starCounts).reduce((sum, count) => sum + count, 0);

    const ratingData = [
      { stars: 5, count: starCounts.five, percentage: total ? Math.round((starCounts.five / total) * 100) : 0 },
      { stars: 4, count: starCounts.four, percentage: total ? Math.round((starCounts.four / total) * 100) : 0 },
      { stars: 3, count: starCounts.three, percentage: total ? Math.round((starCounts.three / total) * 100) : 0 },
      { stars: 2, count: starCounts.two, percentage: total ? Math.round((starCounts.two / total) * 100) : 0 },
      { stars: 1, count: starCounts.one, percentage: total ? Math.round((starCounts.one / total) * 100) : 0 },
    ];

    setRatings(ratingData);
  }
} catch (error) {
  console.error("Error fetching ratings:", error);
}
    }

fetchRatings();
  }, []);


useEffect(() => {

  async function fetchPatients() {
    try {
       const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:44316/api/admin/getAllPatients", {
          headers: { Authorization: `Bearer ${token}`
      },
    });const data = await response.json();

      if (data.success) {
        setTotalPatients(data.data.length);
        setPatients(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching Patients:", error);
    }
  }

  fetchPatients();
}, []);
useEffect(() => {
  async function fetchDoctor() {
    try {
       const token = localStorage.getItem("jwt");
      const response = await fetch("https://localhost:44316/api/admin/getAllDoctores", {
          headers: { Authorization: `Bearer ${token}`
      },
    });const data = await response.json();

      if (data.success) {
        setTotalDoctores(data.data.length);
        setDoctor(data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching Doctors:", error);
    }
  }

  fetchDoctor();
}, []);
return (
  <AdminController>
    {/* Main Dashboard Content */}
    <main className="p-6 space-y-6">
      {/* Patients Count Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Patients Count</h3>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center text-teal-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-3xl font-semibold text-gray-900">{totalPatients}</span>
        </div>

      </div>
       {/* Doctor Count Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Doctor Count</h3>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center text-teal-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-3xl font-semibold text-gray-900">{totalDoctor}</span>
        </div>
      </div>

      {/* Rating and Recent Users Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Rating</h3>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-bold text-gray-900">{overallRate}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.round(overallRate) }).map((_, i) => (
                <svg key={i} className="w-5 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {ratings.map((rating, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating.stars }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-teal-500 h-2 rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Users</h3>
          <div className="space-y-4">
            {patients.map((patient, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={patient.profilePicUrl || "/placeholder.svg"}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      // Example status logic: online if patient index is even
                      index % 3 === 0 ? "bg-teal-500" : "bg-red-500"
                      }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {patient.firstName} {patient.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                </div>
                {/* <div className="text-right">
                  <span className="text-xs text-gray-500">ID: {patient.Id}</span>
                </div> */}
              </div>
            ))}
          </div>
          {/* <div className="mt-4 text-gray-700 font-medium">Total Patients: {totalPatients}</div> */}
        </div>

      </div>
    </main>
  </AdminController>

);
}
