"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PatientAppointments() {
  // Data
  const [appointments, setAppointments] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ type: "info", text: "" });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Filters
  const [filter, setFilter] = useState("all"); // all|upcoming|today|past
  const [search, setSearch] = useState("");

  // Auth
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const apiUrl = "https://localhost:44316";

  // Helpers
  const getStatus = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffMs > 0 && diffDays < 1) return "Today";
    if (diffMs > 0) return "Upcoming";
    return "Past";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Today":
        return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
      case "Upcoming":
        return "bg-sky-100 text-sky-800 ring-1 ring-sky-200";
      case "Past":
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Load auth
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const storedToken = localStorage.getItem("jwt");
    setUser(storedUser);
    setToken(storedToken);
  }, []);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      if (!user?.id) {
        setLoading(false);
        setError("No user found. Please sign in again.");
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `${apiUrl}/getAppointmentsByPatient?userId=${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setAppointments(Array.isArray(data) ? data : []);
          if (!data || data.length === 0) {
            setToast({
              type: "info",
              text: "There are no appointments currently booked.",
            });
          }
        } else {
          setError(data?.message || "Failed to fetch appointments.");
        }
      } catch (err) {
        setError("Network error while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token, user?.id]);

  // Derived list
  const filteredAppointments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments
      .filter((a) => {
        const status = getStatus(a.date).toLowerCase();
        const matchesFilter = filter === "all" || filter === status;
        const matchesSearch =
          q === "" ||
          String(a.docName || "").toLowerCase().includes(q) ||
          String(a.appointmentDetail || "").toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments, filter, search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/patient" className="flex items-center gap-3 cursor-pointer">
              <Image src="/M1.png" alt="Docsera" width={70} height={70} className="rounded-lg" />
              <span className="font-extrabold tracking-tight text-4xl text-gray-900">Docsera</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Decorative blobs */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">My Appointments</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Review, search, and filter your appointments. Click any card for full details.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 pb-16">
        {/* Toast */}
        {toast.text && (
          <div
            className={
              "mb-6 rounded-2xl px-4 py-3 text-sm border " +
              (toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : toast.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-sky-50 border-sky-200 text-sky-700")
            }
          >
            {toast.text}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-semibold">
              {appointments.length}
            </span>
            <span className="font-medium">Total appointments</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {/*  New Appointment   */}
            <Link
              href="/patient/Appointments/addAppointment"
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-4 py-2 text-white text-sm font-semibold shadow-lg transition-all hover:shadow-[0_16px_40px_-10px_rgba(2,132,199,0.5)] hover:-translate-y-[1px] hover:bg-sky-700"
            >
              + New Appointment
            </Link>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by doctor or notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 rounded-2xl border border-slate-300 bg-white p-3 pr-10 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </div>

            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white p-3 pr-8 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="today">Today</option>
                <option value="past">Past</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
            </div>
          </div>
        </div>

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="py-20 text-center text-slate-600">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mb-4" />
            Loading appointments…
          </div>
        )}
        {!loading && error && (
          <div className="py-16 text-center">
            <p className="text-rose-600 font-semibold">{error}</p>
          </div>
        )}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="py-16 text-center text-slate-600">
            No appointments found for your current filters.
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((a) => {
              const status = getStatus(a.date);
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setSelectedAppointment(a)}
                  className="text-left rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden transition hover:shadow-[0_32px_80px_-32px_rgba(0,0,0,0.2)] hover:-translate-y-[1px]"
                >
                  <div className="h-1 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center font-semibold shadow">
                          {String(a.docName || "").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-base font-semibold text-slate-900">{a.docName}</div>
                          <div className="text-xs text-slate-500">Doctor</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(status)}`}>{status}</span>
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-[10px]">🗓️</span>
                        <span>{new Date(a.date).toLocaleString()}</span>
                      </div>
                    </div>

                    {a.appointmentDetail && (
                      <p className="mt-3 text-slate-700 text-sm line-clamp-3">{a.appointmentDetail}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500" />
            <button
              className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={() => setSelectedAppointment(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-1 text-slate-900">{selectedAppointment.docName}</h2>
              <p className="text-slate-500 text-sm mb-6">Appointment details</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="font-semibold text-slate-700">Date & Time</div>
                  <div className="text-slate-800">{new Date(selectedAppointment.date).toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-slate-700">Status</div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(getStatus(selectedAppointment.date))}`}>
                      {getStatus(selectedAppointment.date)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="font-semibold text-slate-700">Appointment Details</div>
                  <div className="text-slate-800 whitespace-pre-wrap">{selectedAppointment.appointmentDetail || "-"}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-slate-700">Doctor Notes</div>
                  <div className="text-slate-800 whitespace-pre-wrap">{selectedAppointment.docNotes || "-"}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-slate-700">Patient Notes</div>
                  <div className="text-slate-800 whitespace-pre-wrap">{selectedAppointment.patientNotes || "-"}</div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <Link
                  href="/patient/Appointments/addAppointment"
                  className="rounded-2xl bg-slate-900 px-5 py-2.5 text-white font-semibold shadow-lg hover:-translate-y-[1px] transition"
                >
                  Book another
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Image src="/M1.png" alt="Logo" width={24} height={24} className="rounded" />
            <span>© 2025 Docsera</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-700">Privacy</Link>
            <Link href="#" className="hover:text-slate-700">Terms</Link>
            <Link href="#" className="hover:text-slate-700">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
