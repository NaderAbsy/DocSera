"use client"
import DoctorRequests from '../../../components/DoctorRequests'
import AdminController from "../../../components/AdminLayout"
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DoctoreReq() {

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
    <AdminController>
      <main className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Requests:</h3>
          <DoctorRequests 
          apiUrl="https://localhost:44316/api/admin/viewDoctoreSubmition" 
          handelUrl="https://localhost:44316/api/admin/handelDoctoreReqs"
/>
          

      </main>
    </AdminController>
    )

  );
}
