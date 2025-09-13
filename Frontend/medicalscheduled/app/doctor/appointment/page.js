"use client"
import DoctorLayout from "../../../components/doctorLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Appointment() {
    const [patientsData, setPatientsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
     const router = useRouter();
      const [authorized, setAuthorized] = useState(false);


    const [updateData, setUpdateData] = useState({
        AppointmentDetail: "",
        DocNotes: "",
        Date: "",
    });


    const handleAddModalChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const [docId, setDocId] = useState();
    const [formData, setFormData] = useState({
        PatientId: "",
        Date: "",
        AppointmentDetail: "",
        DocNotes: "",
    });
    const [filters, setFilters] = useState({
        name: "",
        date: "",
        detail: "",
        docNotes: "",
        patientNotes: ""
    });
    const [modalData, setModalData] = useState(null);
    const [showModal, setShowModal] = useState(false);

      useEffect(() => {
          const token = localStorage.getItem("jwt");
          const userType = localStorage.getItem("UserType");
          if (!token || userType !== "Doctor") {
            router.replace("/"); 
          } else {
            setAuthorized(true); 
          }
        }, [router]);

    // Fetch doctor info
    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) return;

        fetch(`https://localhost:44316/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setDocId(data.user.id);
            })
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    // Fetch appointments
    useEffect(() => {
        if (!docId) return;
        const token = localStorage.getItem("jwt");

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://localhost:44316/getDocAppointment?docId=${docId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const res = await response.json();
                if (res.success) {
                    setPatientsData(res.data);
                    setFilteredData(res.data);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [docId]);

    const handleAddSubmit = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const payload = { ...formData, DocId: docId, Date: new Date(formData.Date) };

            const response = await fetch(`https://localhost:44316/createAppointment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const res = await response.json();
            if (res.success) {
                setShowModal(false);
                setFormData({ PatientId: "", Date: "", AppointmentDetail: "", DocNotes: "" });
                // Refresh list
                setPatientsData((prev) => [...prev, payload]);
                alert(res.message);
            } else alert(res.message);
        } catch (err) {
            console.error(err);
        }
    };

    // Filter data
    useEffect(() => {
        let filtered = patientsData.filter((appt) => {
            return (
                appt.patientName.toLowerCase().includes(filters.name.toLowerCase()) &&
                (filters.date ? new Date(appt.date).toLocaleDateString().includes(filters.date) : true) &&
                appt.appointmentDetail.toLowerCase().includes(filters.detail.toLowerCase()) &&
                (appt.docNotes || "").toLowerCase().includes(filters.docNotes.toLowerCase()) &&
                (appt.patientNotes || "").toLowerCase().includes(filters.patientNotes.toLowerCase())
            );
        });
        setFilteredData(filtered);
    }, [filters, patientsData]);

    // Handlers
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleUpdateAppointment = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const payload = {
                ...updateData,
                Id: modalData.id,
                DocId: docId,
                Date: new Date(updateData.Date),
            };

            const response = await fetch(`https://localhost:44316/updateAppointment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const res = await response.json();
            if (res.success) {
                // Update frontend data
                setPatientsData((prev) =>
                    prev.map((appt) => (appt.id === modalData.id ? { ...appt, ...res.data } : appt))
                );
                setFilteredData((prev) =>
                    prev.map((appt) => (appt.id === modalData.id ? { ...appt, ...res.data } : appt))
                );
                setShowModal(false);
                alert(res.message);
            } else alert(res.message);
        } catch (err) {
            console.error(err);
        }
    };


    const handleView = (appt) => {
        setModalData(appt);
        setUpdateData({
            AppointmentDetail: appt.appointmentDetail,
            DocNotes: appt.docNotes,
            Date: new Date(appt.date).toISOString().slice(0, 10), // format for input[type="date"]
        });
        setShowModal(true);
    };


    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;

        try {
            const token = localStorage.getItem("jwt");

            const response = await fetch(
                `https://localhost:44316/deleteAppointment?appointmentId=${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = await response.json();

            if (res.success) {
                // Remove from state
                setPatientsData((prev) => prev.filter((appt) => appt.id !== id));
                setFilteredData((prev) => prev.filter((appt) => appt.id !== id));
                alert(res.message);
            } else {
                alert(res.message);
            }
        } catch (err) {
            console.error(err);
        }
    };


    return (
        authorized &&
        <DoctorLayout>
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Your Appointments Details</h2>
                <p className="text-sm text-gray-600 mb-6">
                    This is your latest patient appointments list
                </p>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
                    <input
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="Filter by Name"
                        className="border p-2 rounded"
                    />
                    <input
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        placeholder="Filter by Date"
                        className="border p-2 rounded"
                    />
                    <input
                        name="detail"
                        value={filters.detail}
                        onChange={handleFilterChange}
                        placeholder="Filter by Detail"
                        className="border p-2 rounded"
                    />
                    <input
                        name="docNotes"
                        value={filters.docNotes}
                        onChange={handleFilterChange}
                        placeholder="Filter by Your Notes"
                        className="border p-2 rounded"
                    />
                    <input
                        name="patientNotes"
                        value={filters.patientNotes}
                        onChange={handleFilterChange}
                        placeholder="Filter by Patient Notes"
                        className="border p-2 rounded"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Patient Name</th>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Appointment Date</th>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Appointment Detail</th>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Your Notes</th>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Patient Note</th>
                                <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((appt, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-2 px-2 text-sm text-gray-900 font-semibold">{appt.patientName}</td>
                                    <td className="py-2 px-2 text-sm text-gray-700 font-mono">
                                        {appt.date ? new Date(appt.date).toLocaleDateString() : "--"}
                                    </td>
                                    <td className="py-2 px-2 text-sm text-gray-700">{appt.appointmentDetail}</td>
                                    <td className="py-2 px-2 text-sm text-gray-700">{appt.docNotes || "--"}</td>
                                    <td className="py-2 px-2 text-sm text-gray-700">{appt.patientNotes || "--"}</td>
                                    <td className="py-2 px-2 text-sm text-gray-700 relative">
                                        <button
                                            className="px-2 py-1 border rounded"
                                            onClick={() => setOpenMenuId(openMenuId === appt.id ? null : appt.id)}
                                        >
                                            ...
                                        </button>

                                        {openMenuId === appt.id && (
                                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                                <button
                                                    onClick={() => handleView(appt)}
                                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-800 transition font-medium"
                                                >
                                                    View / Update
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(appt.id)}
                                                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Appointment Button */}
                <div className="mt-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Appointment
                    </button>
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded p-4 w-96">
                            <h3 className="font-semibold mb-4">Add New Appointment</h3>

                            <input
                                name="PatientId"
                                value={formData.PatientId}
                                onChange={handleAddModalChange}
                                placeholder="Patient ID"
                                className="border w-full p-2 mb-2 rounded"
                            />
                            <input
                                type="datetime-local"
                                name="Date"
                                value={formData.Date}
                                onChange={handleAddModalChange}
                                className="border w-full p-2 mb-2 rounded"
                            />
                            <input
                                name="AppointmentDetail"
                                value={formData.AppointmentDetail}
                                onChange={handleAddModalChange}
                                placeholder="Appointment Detail"
                                className="border w-full p-2 mb-2 rounded"
                            />
                            <input
                                name="DocNotes"
                                value={formData.DocNotes}
                                onChange={handleAddModalChange}
                                placeholder="Doctor Notes"
                                className="border w-full p-2 mb-2 rounded"
                            />

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={handleAddSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded p-4 w-96">
                            <h3 className="font-semibold mb-2">Update Appointment</h3>
                            <p>Name: {modalData.patientName}</p>
                            <input
                                type="date"
                                className="border w-full p-2 my-2"
                                value={updateData.Date}
                                onChange={(e) => setUpdateData({ ...updateData, Date: e.target.value })}
                            />
                            <p>Detail: {modalData.appointmentDetail}</p>
                            <textarea
                                className="border w-full p-2 my-2"
                                value={updateData.DocNotes}
                                onChange={(e) => setUpdateData({ ...updateData, DocNotes: e.target.value })}
                            />
                            <textarea
                                className="border w-full p-2 my-2"
                                value={updateData.AppointmentDetail}
                                onChange={(e) => setUpdateData({ ...updateData, AppointmentDetail: e.target.value })}
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                                    onClick={handleUpdateAppointment}
                                >
                                    Save
                                </button>

                            </div>

                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
}
