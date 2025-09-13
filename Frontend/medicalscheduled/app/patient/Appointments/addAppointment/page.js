"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AddAppointment() {
  // Data & form state
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [appointmentDetail, setAppointmentDetail] = useState("");
  const [patientNotes, setPatientNotes] = useState("");

  // UI state
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ type: "info", text: "" });

  // Auth
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const router = useRouter();
  const apiUrl = "https://localhost:44316";

  const selectedDoctorObj = useMemo(
    () => doctors.find((d) => String(d.id) === String(selectedDoctor)),
    [doctors, selectedDoctor]
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("jwt");
    setUser(storedUser);
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await fetch(`${apiUrl}/GetDoctorsToBook`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDoctors(data?.doctors ?? []);
      } catch (e) {
        setToast({ type: "error", text: "Could not load doctors. Please try again." });
      } finally {
        setLoadingDoctors(false);
      }
    };
    if (token) fetchDoctors();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date || !appointmentDetail || !patientNotes) {
      setToast({ type: "error", text: "⚠️ All fields are required." });
      return;
    }
    setSubmitting(true);
    setToast({ type: "info", text: "" });

    try {
      const res = await fetch(`${apiUrl}/AddAppointmentByPatient`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          DocId: selectedDoctor,
          PatientId: user?.id,
          Date: date,
          AppointmentDetail: appointmentDetail,
          PatientNotes: patientNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: "success", text: "✅ Appointment booked successfully." });
        setTimeout(() => router.push("/patient/Appointments"), 650);
      } else {
        setToast({ type: "error", text: data.message || "❌ Failed to book appointment." });
      }
    } catch (err) {
      setToast({ type: "error", text: "❌ Error while booking the appointment." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Top Bar (standalone - no PatientLayout) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/patient" className="flex items-center gap-3 cursor-pointer">
              <Image src="/M1.png" alt="Docsera" width={70} height={70} className="rounded-lg" />
              <span className="font-extrabold tracking-tight text-4xl text-gray-900">Docsera</span>
            </Link>
          </div>
          <Link
            href="/patient/Appointments"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-sm font-medium"
          >
            <span className="hidden sm:inline">Back to Appointments</span>
            <span className="sm:hidden">Back</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">→</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute top-1/4 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-6">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Book your visit in minutes</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Modern, clean, and fast appointment booking. Pick a doctor, choose a date, and add the details—we’ll handle the
            rest.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <main className="mx-auto max-w-7xl px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
              {/* Stepper */}
              <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 p-1">
                <div className="flex items-center gap-4 px-4 py-2 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">1</span>
                    <span>Select Doctor</span>
                  </div>
                  <span className="opacity-60">—</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">2</span>
                    <span>Date</span>
                  </div>
                  <span className="opacity-60">—</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">3</span>
                    <span>Details</span>
                  </div>
                </div>
              </div>

              {/* Toast */}
              {toast.text && (
                <div
                  className={
                    "mx-5 mt-5 rounded-2xl px-4 py-3 text-sm border " +
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

              <div className="p-6 md:p-8">
                {!user || !token ? (
                  <div className="py-16 text-center text-slate-600">Loading…</div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Select Doctor */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Doctor</label>
                        <div className="relative">
                          <select
                            className="w-full appearance-none rounded-2xl border border-slate-300 bg-white p-4 pr-10 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            disabled={loadingDoctors}
                            required
                          >
                            <option value="">— Choose a doctor —</option>
                            {doctors.map((doc) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.firstName} {doc.lastName}
                              </option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
                        </div>
                        {loadingDoctors && <p className="mt-2 text-xs text-slate-500">Loading doctors…</p>}
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                        <input
                          type="datetime-local"
                          className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                          value={date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Appointment Details</label>
                        <textarea
                          rows={6}
                          placeholder="Describe the purpose of your visit…"
                          className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 resize-none"
                          value={appointmentDetail}
                          onChange={(e) => setAppointmentDetail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
                        <textarea
                          rows={6}
                          placeholder="Any notes you want your doc to know…"
                          className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 resize-none"
                          value={patientNotes}
                          onChange={(e) => setPatientNotes(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        {selectedDoctorObj ? (
                          <>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-cyan-500 text-white flex items-center justify-center font-semibold shadow">
                              {String(selectedDoctorObj.firstName || "").charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800">
                                Dr.{selectedDoctorObj.firstName} {selectedDoctorObj.lastName}
                              </div>
                              <div className="font-semibold text-slate-800">
                                Working hours are from 8:00 AM to 4:00 PM.
                              </div>
                            </div>
                          </>
                        ) : (
                          <span>Choose a doctor to see details</span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || loadingDoctors}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold shadow-lg transition-all hover:shadow-[0_16px_40px_-10px_rgba(15,23,42,0.5)] hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Booking…
                          </>
                        ) : (
                          <>Book Appointment</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Side Column */}
          <aside className="space-y-8">
            {/* Benefit Card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Why book online?</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                  <li>Instant confirmation.</li>
                  <li>No phone queues.</li>
                  <li>All details in one place.</li>
                </ul>
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-3xl bg-slate-900 text-slate-100 overflow-hidden shadow-[0_20px_60px_-20px_rgba(15,23,42,0.5)]">
              <div className="h-1 bg-gradient-to-r from-fuchsia-500 via-sky-500 to-emerald-500" />
              <div className="p-6">
                <h3 className="text-lg font-semibold">Need help?</h3>
                <p className="mt-1 text-sm text-slate-300">Our support team is here for you.</p>
                <div className="mt-4 text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    <a className="underline underline-offset-4" href="tel:+962795616787">
                      + (962) 795616787
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a className="underline underline-offset-4" href="mailto:docsera159@gmail.com">
                      docsera159@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Image src="/M1.png" alt="Logo" width={24} height={24} className="rounded" />
            <span>© 2025 Docsera</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-700">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-700">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-700">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
