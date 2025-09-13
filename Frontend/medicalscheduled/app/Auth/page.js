'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import jwtDecode from "jwt-decode"

export default function AuthPage() {
  const router = useRouter();

  const users = [
    { src: "https://randomuser.me/api/portraits/women/79.jpg", alt: "User 1" },
    { src: "https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg", alt: "User 2" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", alt: "User 3" },
    { src: "https://randomuser.me/api/portraits/men/86.jpg", alt: "User 4" },
    { src: "https://images.unsplash.com/photo-1510227272981-87123e259b17", alt: "User 5" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPass: '',
  });

  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    DoctoreFirstName: "",
    DoctoreLastName: "",
    email: "",
    phoneNumber: "",
    decs: "",
    password: '',
    confirmPass: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const roleFromTokenOrResponse = (token, apiUser) => {
  try {
    const dec = jwtDecode(token);
    return dec.role 
      || dec["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      || (apiUser && apiUser.userType)
      || 'Patient';
  } catch {
    return (apiUser && apiUser.userType) || 'Patient';
  }
};


  const redirectByRole = (role) => {
    switch (role) {
      case 'Admin': router.push('/admin'); break;
      case 'Doctor': router.push('/doctor'); break;
      default: router.push('/patient'); break;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleDocReq = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocReqSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsSuccess(null);

    try {
      const res = await fetch("https://localhost:44316/addDoctoreReqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setMessage({ type: 'success', text: "Req has been sent , Wait for Approval !." });
        setFormData({ DoctoreFirstName: "", DoctoreLastName: "", email: "", phoneNumber: "", decs: "", password: "", confirmPass: "" });
      } else {
        setIsSuccess(false);
        setMessage({ type: 'error', text: res.message || "Something went wrong." });
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setIsSuccess(false);
      setMessage({ type: 'error', text: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const url = isLogin
        ? 'https://localhost:44316/api/auth/login'
        : 'https://localhost:44316/api/auth/register';

      const payload = isLogin
        ? { emailOrPhone: form.email, password: form.password }
        : {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          confirmPass: form.confirmPass,
          userType: 'Patient',
        };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Something went wrong' });
        return;
      }

      setMessage({ type: 'success', text: data.message });

      if (isLogin && data.token) {
        localStorage.setItem('jwt', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        const role = roleFromTokenOrResponse(data.token, data.user);
        localStorage.setItem('UserType' , role);
        redirectByRole(role);
      }

      if (!isLogin) setIsLogin(true);

    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Network error' });
    }
  };

  return (
    <main className="w-full flex">
      {/* LEFT SIDE */}
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-sky-300 lg:flex">
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center h-full px-6 text-center">
          <motion.h1
            className="flex justify-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 80 }}
            transition={{ type: 'tween', duration: 1 }}
          >
            <Image
              src="/M1.png"
              alt="Description"
              width={350}
              height={350}
              className="object-contain"
            />
          </motion.h1>

          <div className="mt-16 space-y-3">
            <h2 className="text-white text-3xl font-bold">Scheduling now much easier</h2>
            <p className="text-gray-300">Create an account and get access to all features</p>

            <div className="flex items-center ml-14 overflow-hidden">
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
                className="flex -space-x-2"
              >
                {users.map((user, index) => (
                  <motion.li
                    key={index}
                    variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
                    transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
                  >
                    <img src={user.src} alt={user.alt} className="w-10 h-10 rounded-full border-2 border-white" />
                  </motion.li>
                ))}
              </motion.ul>
              <p className="text-sm text-gray-400 font-medium translate-x-5">Join 5,000+ users</p>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              'linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)',
            filter: 'blur(118px)',
          }}
        />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-4 bg-white text-gray-600 sm:px-0">
          <div>
            <div className="mt-5 space-y-2 text-center">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                {isLogin ? 'Log in' : 'Sign up'}
              </h3>
              <p>
                {isLogin ? 'Don’t have an account? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="font-medium">First Name</label>
                  <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                </div>
                <div>
                  <label className="font-medium">Last Name</label>
                  <input name="lastName" type="text" value={form.lastName} onChange={handleChange} required
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                </div>
                <div>
                  <label className="font-medium">Phone Number</label>
                  <input name="phoneNumber" type="text" value={form.phoneNumber} onChange={handleChange} required
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
                </div>
              </>
            )}

            <div>
              <label className="font-medium">Email / Phone Number</label>
              <input name="email" type="text" value={form.email} onChange={handleChange} required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>

            <div>
              <label className="font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required
                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
            </div>

            {!isLogin && (
              <div>
                <label className="font-medium">Confirm Password</label>
                <input name="confirmPass" type="password" value={form.confirmPass} onChange={handleChange} required
                  className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg" />
              </div>
            )}

            {message && (
              <p className={`text-sm ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {message.text}
              </p>
            )}

            <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              {isLogin ? 'Log in' : 'Create account'}
            </button>
          </form>

          <button
            onClick={() => setIsModalOpen(true)}
            className="uppercase font-bold text-xs text-[#8176AF] block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
          >
            Request a Doctor Dashboard
          </button>
        </div>

        {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#4b3f72]">
        🩺 Request a Doctor Dashboard
      </h2>

      <form onSubmit={handleDocReqSubmit} className="space-y-4">
        <input
          name="DoctoreFirstName"
          value={formData.DoctoreFirstName}
          onChange={handleDocReq}
          type="text"
          placeholder="First Name"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <input
          name="DoctoreLastName"
          value={formData.DoctoreLastName}
          onChange={handleDocReq}
          type="text"
          placeholder="Last Name"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleDocReq}
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <input
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleDocReq}
          type="text"
          placeholder="Phone Number"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <textarea
          name="decs"
          value={formData.decs}
          onChange={handleDocReq}
          placeholder="Describe your request"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
          rows={3}
        ></textarea>

        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          onChange={handleDocReq}
          placeholder="Specialty"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <input
          type="text"
          name="working_hours"
          value={formData.working_hours}
          onChange={handleDocReq}
          placeholder="Working Hours"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleDocReq}
          placeholder="Password (if Approved)"
          className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-[#8176AF] outline-none"
        />

        {message && (
          <div
            className={`p-3 rounded-lg text-sm text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#8176AF] text-white font-medium shadow-md hover:bg-[#6b5a99] transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      </div>
    </main>
  );
}
