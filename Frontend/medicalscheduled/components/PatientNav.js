"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PatientNav() {
  // Doctor Request Form
  const [formData, setFormData] = useState({
    docName: "",
    email: "",
    phoneNumber: "",
    decs: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);

  // Navbar & Modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Profile Form
  const [profileData, setProfileData] = useState({
    FirtName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Password: "",
    ProfilePicture: null,
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Doctor Request Handlers
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(null);

    try {
      const res = await fetch("https://localhost:44316/addDoctoreReqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Request sent successfully!");
        setFormData({ docName: "", email: "", phoneNumber: "", decs: "" });
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setIsSuccess(false);
      setMessage("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "ProfilePicture" && files.length > 0) {
      setProfileData({ ...profileData, ProfilePicture: files[0] });
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
      for (const key in profileData) {
        if (profileData[key]) form.append(key, profileData[key]);
      }

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

  // Load user profile when modal opens
  useEffect(() => {
    if (isProfileOpen) {
      const token = localStorage.getItem("jwt");
      if (!token) return;

      fetch("https://localhost:44316/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProfileData({
              FirtName: data.user.firstName || "",
              LastName: data.user.lastName || "",
              Email: data.user.email || "",
              Phone: data.user.phoneNumber || "",
              Password: "",
              ProfilePicture: null,
            });
            console.log(data.success)
            console.log(data.user)
            console.log(data.user.FirstName)
            console.log(data)
            if (data.user.profilePicture)
              setPreviewImage(`data:image/png;base64,${data.user.profilePicture}`);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isProfileOpen]);

  return (
    <>
      {/* HEADER */}
      <header className="flex mx-auto justify-between items-center max-w-[1300px] py-4">
        <div className="flex items-center gap-3">
          <Link href="/patient">
            <Image
              src="/M1.png"
              alt="Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`${menuOpen ? "block" : "hidden"} sm:block`}>
          <ul className="relative flex flex-col sm:flex-row gap-3 md:gap-5 lg:gap-10 z-30 ">
            <li>
              <Link
                href="/patient/Appointments/addAppointment"
                onClick={() => setMenuOpen(false)}
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                Booking
              </Link>
            </li>

            <li>
              <Link
                href="/patient/Appointments"
                onClick={() => setMenuOpen(false)}
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                Appointments History
              </Link>
            </li>

            <li>
              <Link
                href="/patient/chatBox"
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                CHAT WITH AI
              </Link>
            </li>

            <li>
              <Link
                href="/community"
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                Community
              </Link>
            </li>

            <li>
              <button
                onClick={() => setIsProfileOpen(true)}
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("jwt");
                  window.location.href = "/";
                }}
                className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* Contact button */}
        <div className="hidden sm:flex gap-3 md:gap-5 lg:gap-9">
          <Link href="/patient/ContactUs">
            <button className="uppercase font-bold text-xs rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-[#8176AF] to-[#C0B7E8]">
              CONTACT US
            </button>
          </Link>
        </div>

        {/* Hamburger menu */}
        <button
          className="sm:hidden inline-block"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </header>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={() => setIsProfileOpen(false)}
            >
              ✕
            </button>

            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                />
              ) : (
                <img
                  src="/profile-placeholder.png"
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
                />
              )}
              <label className="inline-block px-2 py-1 bg-blue-600 text-white text-sm font-medium rounded-md cursor-pointer hover:bg-blue-700 mt-3">
                Upload Picture
                <input
                  type="file"
                  accept="image/*"
                  name="ProfilePicture"
                  onChange={handleProfileChange}
                  className="hidden"
                />
              </label>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleProfileSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  disabled
                  type="email"
                  name="Email"
                  value={profileData.Email}
                  onChange={handleProfileChange}
                  className="bg-gray-300 mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="FirtName"
                  value={profileData.FirtName}
                  onChange={handleProfileChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="LastName"
                  value={profileData.LastName}
                  onChange={handleProfileChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="Phone"
                  value={profileData.Phone}
                  onChange={handleProfileChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="Password"
                  value={profileData.Password}
                  onChange={handleProfileChange}
                  placeholder="••••••••"
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {profileMessage && (
                <div
                  className={`mb-3 p-2 rounded text-sm ${profileSuccess
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {profileMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {profileLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Request a Doctor Dashboard</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="docName"
                value={formData.docName}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="border p-2 w-full mb-3 rounded"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="border p-2 w-full mb-3 rounded"
              />

              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="text"
                placeholder="Phone Number"
                className="border p-2 w-full mb-3 rounded"
              />

              <textarea
                name="decs"
                value={formData.decs}
                onChange={handleChange}
                placeholder="Describe your request"
                className="border p-2 w-full mb-3 rounded"
              ></textarea>

              {message && (
                <div
                  className={`mb-3 p-2 rounded text-sm ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                  {message}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#8176AF] text-white rounded"
                >
                  {loading ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
