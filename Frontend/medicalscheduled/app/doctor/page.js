"use client";

import DoctorLayout from "../../components/doctorLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ children, className = "" }) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Calendar({ appointments }) {
  const [selectedDay, setSelectedDay] = useState(null); // clicked day
  const [modalOpen, setModalOpen] = useState(false);
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const today = new Date().getDate();
  const today2 = new Date();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const appointmentsByDay = {};
  appointments.forEach((appt) => {
    const apptDate = new Date(appt.date);
    const day = apptDate.getDate();
    if (!appointmentsByDay[day]) appointmentsByDay[day] = [];
    appointmentsByDay[day].push(appt);
  });

  const getColor = (type) => {
    switch (type) {
      case "Surgery": return "bg-blue-500";
      case "Polyclinic": return "bg-red-500";
      case "Evaluation": return "bg-green-500";
      default: return "bg-blue-400";
    }
  };

  const openModal = (day) => {
    setSelectedDay(day);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDay(null);
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          {/* Calendar Header & Legend same as before */}
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{months[today2.getMonth()]} {today2.getFullYear()}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">◀</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">▶</Button>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Appointment</span>
            </div>
            
            {/* <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Polyclinic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Evaluation</span>
            </div> */}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-7 gap-1 text-xs text-center mb-3">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <div key={day} className="font-medium text-gray-500 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const dayAppointments = appointmentsByDay[day] || [];
              return (
                <button
                  key={day}
                  onClick={() => dayAppointments.length > 0 && openModal(day)}
                  className={`aspect-square flex flex-col items-center justify-center text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${day === today
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-gray-700 hover:bg-gray-500"
                    }`}
                >
                  <span>{day}</span>
                  <div className="flex gap-1 mt-1">
                    {dayAppointments.map((appt, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${getColor(appt.appointmentDetail)}`}></span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen && selectedDay && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40" />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg border">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  Appointments on {selectedDay} June
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Patient</th>
                      <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Appointment Detail</th>
                      <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Doctor Notes</th>
                      <th className="py-2 px-2 text-left text-sm font-semibold text-gray-700">Patient Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsByDay[selectedDay]?.map((appt, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-100">
                        <td className="py-2 px-2 text-sm font-semibold">{appt.patientName}</td>
                        <td className="py-2 px-2 text-sm">{new Date(appt.date).toLocaleString()}</td>
                        <td className="py-2 px-2 text-sm">{appt.appointmentDetail}</td>
                        <td className="py-2 px-2 text-sm">{appt.docNotes || "--"}</td>
                        <td className="py-2 px-2 text-sm">{appt.patientNotes || "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}


    </>
  );
}


export default function Dashboard() {
  const [patientsData, setPatientsData] = useState([]);
  const [docId, setDocId] = useState()
      const router = useRouter();
      const [authorized, setAuthorized] = useState(false);

   useEffect(() => {
          const token = localStorage.getItem("jwt");
          const userType = localStorage.getItem("UserType");
          if (!token || userType !== "Doctor") {
            router.replace("/"); 
          } else {
            setAuthorized(true); 
          }
        }, [router]);


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.error("No JWT token found");
      return;
    }

    fetch(`https://localhost:44316/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDocId(data.user.id);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    console.log("docId updated:", docId);
  }, [docId]);

  useEffect(() => {
    if (!docId) return; // waits until docId is set
    const token = localStorage.getItem("jwt");
    fetch("https://localhost:44316/me", {
      headers: { Authorization: `Bearer ${token}` },
    })



    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:44316/getDocAppointment?docId=${docId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const res = await response.json();

        if (res.success) {
          setPatientsData(res.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };


    fetchData();
  }, [docId]);

  return (
    authorized &&
    <DoctorLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="xl:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      Patient Appointments Details
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      This is your several latest patient Appointments list
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Date
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Appointment Detail
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Your Notes
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">
                          Patient Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientsData.map((appt, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-50 hover:bg-gray-25 transition-colors"
                        >
                          <td className="py-4 px-2 text-sm text-gray-900 font-semibold">
                            {appt.patientName}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-700 font-mono">
                            {appt.date ? new Date(appt.date).toLocaleDateString() : "--"}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-700">
                            {appt.appointmentDetail}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-700">
                            {appt.docNotes || "--"}
                          </td>
                          <td className="py-4 px-2 text-sm text-gray-700">
                            {appt.patientNotes || "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="xl:col-span-1">
            <div className="w-full max-w-xs mx-auto">
              <Calendar appointments={patientsData} />
            </div>
          </div>

        </div>
      </div>
    </DoctorLayout>
  );
}
