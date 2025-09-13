"use client";
import AdminLayout from "../../../components/AdminLayout";
import PatientsTabel from "../../../components/PatientsTabel";
import { useRouter } from "next/navigation";
import { useState , useEffect} from "react";
export default function ViewPatients() {
      const router = useRouter();
      const [authorized, setAuthorized] = useState(false);

      
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userType = localStorage.getItem("UserType");
    if (!token || userType !== "Admin") {
      router.replace("/"); 
    } else {
      setAuthorized(true); 
    }
  }, [router]);


  return (
    authorized &&(
    <AdminLayout> 
    <main className="p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">All Patients:</h3>
      
      <PatientsTabel apiUrl="https://localhost:44316/api/admin" />
    </main>
    </AdminLayout>
    )
  );
}



