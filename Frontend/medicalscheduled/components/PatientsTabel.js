"use client";

import { useEffect, useState } from "react";

export default function DoctorsTable({ apiUrl }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");

      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${apiUrl}/getAllPatients?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json();
      if (!json.success) throw new Error("Failed to fetch Patients");
      setDoctors(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  useEffect(() => {
    fetchDoctors();
  }, [apiUrl]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("jwt");

      const response = await fetch(`https://localhost:44316/api/Admin/deletePatient/${id}`, {
        method: "DELETE",
        headers: {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      });


      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      const result = await response.json();
      alert(result.message);

      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  if (loading) return <p>Loading Patients...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (doctors.length === 0) return <p>No Patients found.</p>;
  console.log(doctors)
  return (
    <div className="overflow-x-auto">

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={filters.firstName}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={filters.lastName}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={filters.email}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="phone Number"
          value={filters.phoneNumber}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <button
          onClick={fetchDoctors}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Profile</th>
            <th className="px-4 py-2 border">First Name</th>
            <th className="px-4 py-2 border">Last Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="text-center hover:bg-gray-50">
              <td className="px-4 py-2 border">
                <img
                  src={doc.profilePicUrl || "/default-avatar.png"}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover mx-auto"
                />

              </td>
              <td className="px-4 py-2 border">{doc.firstName}</td>
              <td className="px-4 py-2 border">{doc.lastName}</td>
              <td className="px-4 py-2 border">{doc.email}</td>
              <td className="px-4 py-2 border">{doc.phoneNumber}</td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
