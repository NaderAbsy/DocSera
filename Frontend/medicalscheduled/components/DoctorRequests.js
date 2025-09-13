"use client";

import { useEffect, useState } from "react";

export default function DoctorRequests({ apiUrl, handelUrl }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | approved | declined
  const [editRequest, setEditRequest] = useState(null);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("jwt");
    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response (expected JSON)");
      } const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fetch failed");

      // Normalize adminMassage to adminMessage in state
      const requestsWithMsg = Array.isArray(data)
        ? data.map((req) => ({ ...req, adminMessage: req.adminMassage || "" }))
        : { ...data, adminMessage: data.adminMassage || "" };

      setRequests(Array.isArray(requestsWithMsg) ? requestsWithMsg : [requestsWithMsg]);
    } catch (err) {
      setError(err.message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchData(apiUrl);
  }, [apiUrl]);

  // handle update
  const handleUpdate = async (id, state, adminMessage) => {
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(
        `${handelUrl}?id=${id}&state=${state || ""}&adminMassage=${encodeURIComponent(adminMessage || "")}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const contentType = res.headers.get("content-type");
      let data;

      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Admin Message is required");
      } else {
        data = await res.json();
      }

      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");

      alert(`Request updated: ${data.message}`);
      fetchData(apiUrl); // refresh
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // filters
  const showApproved = () => {
    setFilter("approved");
    fetchData(apiUrl.replace("viewDoctoreSubmition", "viewApprovalDoctoreReqs"));
  };
  const showDeclined = () => {
    setFilter("declined");
    fetchData(apiUrl.replace("viewDoctoreSubmition", "viewDeclinedlDoctoreReqs"));
  };
  const showAll = () => {
    setFilter("all");
    fetchData(apiUrl);
  };

  const handleEdit = (id) => {
    fetchData(apiUrl.replace("viewDoctoreSubmition", "viewDoctoreSubmitionBuId") + `?id=${id}`);
    setEditRequest(id);
  };

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (requests.length === 0) return <p>No requests found.</p>;

  return (
    <div>
      {/* Filter buttons */}
      {/* <div className="ml-260 flex gap-3 mb-4">
        <h3>Filter:</h3>
        <button onClick={showAll} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">All</button>
        <button onClick={showApproved} className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600">Approved</button>
        <button onClick={showDeclined} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Declined</button>
      </div> */}

      {/* Requests grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`border shadow rounded-lg p-6 hover:shadow-lg transition
              ${req.state === "Approved" ? "bg-green-100 border-green-300" : ""}
              ${req.state === "Declined" ? "bg-red-100 border-red-300" : ""}
              ${!req.state || req.state === "Pending" ? "bg-gray-100 border-gray-300" : ""}`}
          >
            <h4 className="text-lg font-semibold mb-2">{req.docfName}</h4>
            <p className="text-gray-600"><strong>Email:</strong> {req.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {req.phoneNumber}</p>
            <p className="text-gray-600 mt-2"><strong>Description:</strong> {req.decs}</p>
            <p className="text-gray-600"><strong>State:</strong> {req.state || "Pending"}</p>

            {/* Admin message */}
            <textarea
              className="w-full mt-2 border rounded p-2"
              placeholder="Admin Message"
              value={req.adminMessage}
              onChange={(e) =>
                setRequests((prev) =>
                  prev.map((r) =>
                    r.id === req.id ? { ...r, adminMessage: e.target.value } : r
                  )
                )
              }
            />

            <div className="flex gap-2 mt-2">
              <button
                className={`px-4 py-2 rounded text-white ${req.state === "Approved"
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
                  }`}
                onClick={() => handleUpdate(req.id, "Approved", req.adminMessage)}
                disabled={req.state === "Approved"}
              >
                Approve
              </button>

              <button
                className={`px-4 py-2 rounded text-white ${req.state === "Declined"
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
                  }`}
                onClick={() => handleUpdate(req.id, "Declined", req.adminMessage)}
                disabled={req.state === "Declined"}
              >
                Decline
              </button>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleEdit(req.id)}
              >
                Edit
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
