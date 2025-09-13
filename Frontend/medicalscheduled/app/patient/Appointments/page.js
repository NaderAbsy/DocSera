"use client";
import PatientNav from "../../../components/PatientNav";
import PatientAppointments from "../../../components/PatientAppointments"
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Appointments() {
const router = useRouter();
const [authorized, setAuthorized] = useState(false);
const userJson = localStorage.getItem("user");
const userObj = userJson ? JSON.parse(userJson) : null;
const patientId = userObj ? userObj.Id || userObj.id : null;
useEffect(() => {
          const token = localStorage.getItem("jwt");
          const userType = localStorage.getItem("UserType");
          if (!token || userType !== "Patient") {
            router.replace("/"); 
          } else {
            setAuthorized(true); 
          }
        }, [router]);

  return (
    <>   
      {/* <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Patient Appointment History</h2> */}
      {/* <PatientAppointments apiUrl="https://localhost:44316/getAppointmentsByPatient" patientId={patientId} /> */}
      {authorized &&(
      <PatientAppointments/>
      )}
      
      {/* </div> */}
    </>
  );
}
