"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ContactPage() {
  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ type: "info", text: "" });

  // Auth (optional)
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
  }, []);

  const apiUrl = "https://localhost:44316";

  const isValid = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(formData.email.trim());
    return formData.name.trim() && emailOk && formData.message.trim();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setToast({ type: "error", text: "⚠️ Please fill in all fields correctly." });
      return;
    }

    setSubmitting(true);
    setToast({ type: "info", text: "" });

    try {
      const form = new FormData();
      form.append("Name", formData.name);
      form.append("Email", formData.email);
      // Note: API field name is 'Massage' as in your original code
      form.append("Massage", formData.message);

      const res = await fetch(`${apiUrl}/SendContact`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      const data = await res.json();

      if (res.ok && (data?.success ?? true)) {
        setToast({ type: "success", text: data?.message || "✅ Message sent successfully." });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setToast({ type: "error", text: data?.message || "❌ Failed to send message." });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "❌ Server error. Please try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/patient" className="flex items-center gap-3 cursor-pointer">
              <Image src="/M1.png" alt="Docsera" width={70} height={70} className="rounded-lg" />
              <span className="font-extrabold tracking-tight text-4xl text-gray-900">Docsera</span>
            </Link>
          </div>
          {/* <Link
            href="/patient"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-sm font-medium"
          >
            <span className="hidden sm:inline">Back</span>
            <span className="sm:hidden">←</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">→</span>
          </Link> */}
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
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Send us your questions or feedback, our team is here to help.</p>
        </div>
      </section>

      {/* Content */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <section className="lg:col-span-2">
            <div className="rounded-3xl bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 h-1" />
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Name */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    placeholder="Write your message here…"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white p-4 shadow-sm outline-none transition hover:bg-slate-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 resize-none"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={submitting || !isValid}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold shadow-lg transition-all hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-[1px] disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>Send Message</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Side Card */}
          <aside className="space-y-8">
            {/* Info Card */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>
                    <span className="font-semibold">Phone:</span>{" "}
                    <a className="underline underline-offset-4" href="tel:+962795616787">+ (962) 795616787</a>
                  </li>
                  <li>
                    <span className="font-semibold">Email:</span>{" "}
                    <a className="underline underline-offset-4" href="mailto:docsera159@gmail.com">docsera159@gmail.com</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Logo / Illustration */}
            <div className="relative rounded-3xl bg-white border border-slate-200 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex items-center justify-center p-10">
              <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
                <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl" />
              </div>
              <Link href="/patient">
                <Image src="/M1.png" alt="Medical Scheduling Logo" width={290} height={200} />
              </Link>
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
            <Link href="#" className="hover:text-slate-700">Privacy</Link>
            <Link href="#" className="hover:text-slate-700">Terms</Link>
            <Link href="#" className="hover:text-slate-700">Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}