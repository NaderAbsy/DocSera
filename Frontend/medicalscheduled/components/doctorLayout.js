"use client"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";


// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
import { useEffect } from "react";
const sidebarItems = [
  { icon: "📊", label: "Dashboard", active: true },
  { icon: "📋", label: "Appointments" },
  { icon: "👥", label: "Community" },
  { icon: "📅", label: "Patients" },
  // { icon: "💰", label: "Billing" },
  { icon: "📈", label: "Echarts" },
  { icon: "📊", label: "Morris Charts" },
  { icon: "❓", label: "Help Center" },
  { icon: "🔐", label: "Logout" },
]



export default function DoctorLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    Phone: "",
    password: "",
    profilePicture: null,
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [doctorId, setDoctorId] = useState();
  const storedUser = localStorage.getItem('user');
  const [ticketSubjectMassage, setTicketSubjectMassage] = useState()
  const [modalOpenTicket, setModalOpenTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const user = JSON.parse(storedUser);


  const handleTicketSubmit = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const payload = {
        DocId: doctorId,
        Title: ticketSubject,
        Desc: ticketDescription,

      };

      const response = await fetch("https://localhost:44316/openDocTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }, body: JSON.stringify(payload),
      })
      const res = await response.json();

      if (res.success) {
        setTicketSubjectMassage(res.message); // set the message from backend
      } else {
        setTicketSubjectMassage("Failed to open ticket.");
      }

      closeTicketModal();
      setTicketSubject("");
      setTicketDescription("");
      setTicketSubjectMassage(res.message)

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  function handelProfileClick() {
    setIsProfileOpen((prev) => !prev);
  }
  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files.length > 0) {
      setProfileData({ ...profileData, profilePicture: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileSuccess(null);

    try {
      const form = new FormData();
      if (profileData.firstName) form.append("FirtName", profileData.firstName); // typo intentional
      if (profileData.lastName) form.append("LastName", profileData.lastName);
      if (profileData.email) form.append("Email", profileData.email);
      if (profileData.phoneNumber) form.append("Phone", profileData.phoneNumber);
      if (profileData.password) form.append("Password", profileData.password);
      if (profileData.profilePicture) form.append("ProfilePicture", profileData.profilePicture);


      const token = localStorage.getItem("jwt");
      const res = await fetch("https://localhost:44316/update-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      setProfileSuccess(data.success);
      setProfileMessage(data.message);
    } catch (err) {
      console.error(err);
      setProfileSuccess(false);
      setProfileMessage("Server error. Try again later.");
    } finally {
      setProfileLoading(false);
    }
  };

  function handeOpenTicketModal() {
    setModalOpenTicket(true);
  }

  function closeTicketModal() {
    setModalOpenTicket(false);
  }

  // Fetch doctor info once on page load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    fetch("https://localhost:44316/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDoctorId(data.user.id); // always set doctorId
          setProfileData({
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
            password: "",
            profilePicture: null,
          });
          if (data.user.profilePicture)
            setPreviewImage(`data:image/png;base64,${data.user.profilePicture}`);
        }
      })
      .catch(err => console.error(err));
  }, []);


  // useEffect(() => {
  //   if (isProfileOpen) {
  //     const token = localStorage.getItem("jwt");
  //     console.log(token)
  //     fetch("https://localhost:44316/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         if (data.success) {
  //           setDoctorId(data.user.id)
  //           setProfileData({
  //             firstName: data.user.firstName,
  //             lastName: data.user.lastName,
  //             email: data.user.email,
  //             phoneNumber: data.user.phoneNumber,
  //             password: "",
  //             profilePicture: null,
  //           });
  //           if (data.user.profilePicture)
  //             setPreviewImage(`data:image/png;base64,${data.user.profilePicture}`);
  //         }
  //       });
  //   }
  // }, [isProfileOpen]);


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}

      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image
              src="/M1.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            {sidebarOpen && (
              <div className="flex items-center">
                <span className="font-bold text-gray-900 text-lg"></span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Modal */}
        {isProfileOpen && (
  <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        onClick={() => setIsProfileOpen(false)}
      >
        ✕
      </button>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 w-full max-w-md mx-auto">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-sm"
          />
        ) : (
          <img
            src="/profile-placeholder.png"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover shadow-sm"
          />
        )}

        <label className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all mt-4 shadow-md">
          Upload Picture
          <input
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={handleProfileChange}
            className="hidden"
          />
        </label>

        {/* Form */}
        <form className="mt-6 space-y-5 w-full" onSubmit={handleProfileSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              disabled
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700"> Doctor Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Phone</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={profileData.password}
              onChange={handleProfileChange}
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>

          {/* Feedback Message */}
          {profileMessage && (
            <div
              className={`text-center text-sm font-medium p-2 rounded-lg shadow-sm ${
                profileSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {profileMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-xl shadow-sm hover:bg-gray-200 transition-all"
              onClick={() => setIsProfileOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        {/* Navigation */}
        <div className="p-4 flex-1">
          <nav className="space-y-1">

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {sidebarOpen ? "MAIN" : ""}
            </div>
            {sidebarItems.slice(0, 1).map((item, index) => (
              <Link

                href="/doctor"
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            ))}
            {sidebarItems.slice(1, 2).map((item, index) => (
              <Link

                href="/doctor/appointment"
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            ))}
            {sidebarItems.slice(2, 3).map((item, index) => (
              <Link

                href="/doctor/CommunityDoc"
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            ))}

            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-8 px-3">
              {sidebarOpen ? "Open Ticket" : ""}
            </div>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              onClick={handeOpenTicketModal}
            >
              <span className="text-lg flex-shrink-0">
                {sidebarItems[6]?.icon}
              </span>
              {sidebarOpen && (
                <span className="font-medium text-sm">
                  {sidebarItems[6]?.label}
                </span>
              )}

            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              onClick={() => {
                localStorage.removeItem("jwt");

                setDoctorId(null);
                setProfileData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  phoneNumber: "",
                  password: "",
                  profilePicture: null,
                });
                setPreviewImage(null);

                window.location.href = "/";
              }}
            >
              <span className="text-lg flex-shrink-0">{sidebarItems[7]?.icon}</span>
              {sidebarOpen && <span className="font-medium text-sm">{sidebarItems[7]?.label}</span>}
            </button>

          </nav>
        </div>

        {/* Working Track */}
        {ticketSubjectMassage && <p className="text-green-400">  {ticketSubjectMassage} </p>}
        {sidebarOpen && (
          <div className="p-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
              <div className="text-sm font-semibold text-gray-900 mb-2">Working Track</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700 font-medium">Work & Live</span>
                <span className="text-xs text-gray-500 ml-auto font-mono">{currentTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
              >
                <span className="sr-only">Toggle sidebar</span>
                {sidebarOpen ? "◀" : "▶"}
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">Good Morning Dr. {user.firstName}</h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  I hope you're in a good mood because there are
                  <span className="font-medium text-blue-600"> patients</span> waiting for you
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

              {/* <button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-9 w-9 p-0 relative"
              >
                <span className="sr-only">Notifications</span>🔔
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}
              <div className="w-9 h-9 ring-2 ring-gray-100 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">

                <button onClick={handelProfileClick}
                ><svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <span className="text-blue-700 font-semibold text-sm hidden">DA</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>

      {/* TicketModal */}
      {modalOpenTicket && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-md ">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg border">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Open Ticket</h2>
              <button
                onClick={closeTicketModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTicketSubmit();
              }}
              className="space-y-4"
            >
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>


              {/* Submit Button */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeTicketModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  )
}
