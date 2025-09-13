"use client"
import { useState } from "react";
import Image from "next/image";

export default function AdminLayout({ children }) {
  const [shownNav, setShowNav] = useState(true);

  function handelShowNav() {
    setShowNav(!shownNav);
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {shownNav && (
        <div className="w-64 bg-slate-700 text-white min-h-screen">
          <a href="/admin">
            <div className="p-4 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <Image
                  src="/M1.png"
                  alt="Logo"
                  width={150}
                  height={120}
                  className="object-contain"
                />
                <span className="text-lg font-semibold">
                  Docsera <span className="bg-blue-950">Admin</span>
                </span>
              </div>
            </div>
          </a>

          {/* Navigation */}
          <div className="p-4">
            {/* NAVIGATION */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                NAVIGATION
              </h3>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">🏠</span>
                <a href="/admin">
                  <span>Dashboard</span>
                </a>
              </div>
            </div>

            {/* PAGES */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                PAGES
              </h3>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">🧑🏻‍⚕️</span>
                <a href="/admin/ViewDoctores"> <span>All Doctors</span>
                </a>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">🧑🏻‍⚕️</span>
                <a href="/admin/ViewPatients"> <span>All Patients</span>
                </a>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">📝</span>
                <a href="/admin/DoctoreReq"> <span>Doctor Requests</span>
                </a>
              </div>
              <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200"
                onClick={() => {
                  // Clear JWT token
                  localStorage.removeItem("jwt");

                  // Redirect to login page
                  window.location.href = "/"; // adjust this to your actual login route
                }}
              >
                <span className="text-lg">🔐</span>
                <span>Logout</span>
              </div>

            </div>

            {/* OTHER */}
            {/* <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                OTHER
              </h3>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">📋</span>
                <span>Menu levels</span>
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer">
                <span className="text-lg">📄</span>
                <span>Sample page</span>
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg"
              onClick={handelShowNav}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
