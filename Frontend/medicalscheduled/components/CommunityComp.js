"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import PatientNav from "./PatientNav"

export default function CommunityPage() {
  const [activeCategory, setActiveCategory] = useState("general")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("general")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const storedUser = localStorage.getItem('user');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [selectedReplies, setSelectedReplies] = useState([]);
  const [isRepliesModalOpen, setIsRepliesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [questions, setQuestions] = useState([])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const user = JSON.parse(storedUser);


  const showReplies = async (questionId) => {
    const token = localStorage.getItem("jwt");
    try {
      const res = await fetch(`https://localhost:44316/${questionId}/GetReplies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedReplies(data.replies || []);
        setIsRepliesModalOpen(true);
      } else {
        console.error("Failed to load replies");
      }
    } catch (err) {
      console.error("Network error while fetching replies:", err);
    }
  };

  useEffect(() => {
  if (searchTerm === "") {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await fetch("https://localhost:44316/GetQuestions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }
}, [searchTerm]);


  const handleSearch = () => {
    const filtered = questions.filter(q =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setQuestions(filtered);
  };


  const handleSubmit = async (e) => {

    const token = localStorage.getItem("jwt")
    if (!token) return
    console.log(token)
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("https://localhost:44316/CreateQuestion", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description, category }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMessage("✅ Question submitted successfully!")
        setTitle("")
        setDescription("")
        setCategory("general")
        setTimeout(() => closeModal(), 1500)
      } else {
        setMessage("❌ " + (data.message || "Something went wrong"))
      }
    } catch (err) {
      console.error(err)
      setMessage("❌ Network error")
    } finally {
      setLoading(false)
    }
  }


  const openReplyModal = (questionId) => {
    setCurrentQuestionId(questionId);
    setReplyText("");
    setIsReplyModalOpen(true);
  };



  const submitReply = async () => {
    if (!replyText.trim()) return;

    const token = localStorage.getItem("jwt");
    try {
      const res = await fetch(`https://localhost:44316/${currentQuestionId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(replyText),
      });

      if (res.ok) {
        const updatedQuestion = await res.json();
        setQuestions((prev) =>
          prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
        );
        setIsReplyModalOpen(false);
      } else {
        console.error("Failed to add reply");
      }
    } catch (err) {
      console.error("Network error while adding reply:", err);
    }
  };


  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await fetch("https://localhost:44316/GetQuestions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);

        if (res.ok && data.success) {
          setQuestions(data.questions);
        } else {
          console.error("Failed to fetch questions:", data.message);
        }
      } catch (err) {
        console.error("Network error while fetching questions:", err);
      }
    };

    fetchQuestions();
  }, []);

  const categories = [
    {
      id: "general",
      title: "General Health",
      description: "Discuss general health topics and wellness tips",
      discussions: 234,
      lastUpdated: "2 hours ago",
      icon: "🏥",
    },
    {
      id: "mental",
      title: "Mental Wellness",
      description: "Support and discussions about mental health",
      discussions: 156,
      lastUpdated: "1 hour ago",
      icon: "🧠",
    },
    {
      id: "nutrition",
      title: "Nutrition & Diet",
      description: "Share nutrition advice and healthy eating tips",
      discussions: 189,
      lastUpdated: "3 hours ago",
      icon: "🥗",
    },
    {
      id: "chronic",
      title: "Chronic Conditions",
      description: "Support for managing chronic health conditions",
      discussions: 98,
      lastUpdated: "30 minutes ago",
      icon: "💊",
    },
    {
      id: "pediatric",
      title: "Pediatric Care",
      description: "Child health and parenting health questions",
      discussions: 145,
      lastUpdated: "4 hours ago",
      icon: "👶",
    },
    {
      id: "emergency",
      title: "Emergency Care",
      description: "First aid tips and emergency health guidance",
      discussions: 67,
      lastUpdated: "1 hour ago",
      icon: "🚨",
    },
  ]

  const testimonials = [
    {
      name: "Maria Santos",
      role: "Patient",
      content:
        "This community helped me understand my condition better and connect with others going through similar experiences.",
      avatar: "👩‍💼",
    },
    {
      name: "Dr. James Wilson",
      role: "Cardiologist",
      content: "A wonderful platform to share knowledge and help patients beyond the clinic walls.",
      avatar: "👨‍⚕️",
    },
    {
      name: "Lisa Thompson",
      role: "Caregiver",
      content: "The support I found here while caring for my elderly mother was invaluable.",
      avatar: "👩‍🦳",
    },
  ]

  return (
    <>
      <div className=" bg-sky-300">
        <header>
          <PatientNav />
        </header>
        {/* Hero Section */}
        <section className="bg-gradient-to-br via-sky-300 to-sky-400 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 text-balance">
              Connect. Learn. Heal Together.
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto text-pretty">
              Join our supportive community where healthcare professionals and patients share knowledge, experiences, and
              support each other on their health journeys.
            </p>
            <div>
              {message && <p className="mb-4 text-sm">{message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={openModal}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Ask a Question
              </button>


            </div>
          </div>
        </section>
      </div>
      {/* Search Bar */}
      <section className="py-8 px-4 border-b border-sky-400">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions, topics, or ask a question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 bg-white border border-sky-400 rounded-lg text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>

          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Featured Topics */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">🔥Lastest Questions</h2>
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-white border border-sky-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-blue-600 cursor-pointer">
                          {topic.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>By {user.firstName + " " + user.lastName || "Anonymous"}</span>
                          <span>•</span>
                          <span>{topic.replies?.length || 0} replies</span>
                          <span>•</span>
                          <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs">
                            {topic.category}
                          </span>
                          {/* <span
                            className="bg-pink-100 text-blue-600 px-2 py-1 rounded-full text-xs cursor-pointer"
                            onClick={() => openReplyModal(topic.id)}
                          >
                            Reply
                          </span> */}


                        </div>
                      </div>
                      <button
                        onClick={() => showReplies(topic.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Show replies
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600">No questions yet. Be the first to ask!</p>
              )}
            </div>
          </section>


          {/* Discussion Categories */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Discussion Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white border border-sky-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 text-pretty">{category.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{category.discussions} discussions</span>
                        <span>Updated {category.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Actions */}
          <div className="bg-white border border-sky-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm">
                Start New Discussion
              </button>
              <button className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors text-sm">
                Find a Doctor
              </button>
              <button className="w-full border border-sky-200 text-slate-700 py-2 px-4 rounded-md hover:bg-sky-50 transition-colors text-sm">
                Browse Resources
              </button>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-white border border-sky-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Community Guidelines</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Be respectful and supportive</li>
              <li>• No medical advice as diagnosis</li>
              <li>• Protect patient privacy</li>
              <li>• Share evidence-based information</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>

          {/* Online Doctors */}
          <div className="bg-white border border-sky-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">🟢 Doctors Online</h3>
            <div className="space-y-3">
              {["Dr. Sarah Kim", "Dr. Michael Brown", "Dr. Lisa Wang"].map((doctor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">👨‍⚕️</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">{doctor}</div>
                    <div className="text-xs text-slate-500">Available now</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <section className="bg-sky-200 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">What Our Community Says</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-sky-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-slate-600 mb-4 text-pretty">"{testimonial.content}"</p>
                <div className="font-semibold text-slate-800">{testimonial.name}</div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {loading ? "Submitting..." : "Submit Question"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isReplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add Reply</h2>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={4}
              placeholder="Type your reply..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={submitReply}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isRepliesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Replies</h2>
            {selectedReplies.length > 0 ? (
              <ul className="space-y-2">
                {selectedReplies.map((r, i) => (
                  <li key={i} className="border-b border-gray-200 pb-2">{r}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No replies yet.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsRepliesModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between">


            <div className="w-full md:w-1/4 mb-8 md:mb-0">
              <a href="/" className="inline-block mb-6">

                <Image
                  src="/M1.png"
                  alt="Description"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </a>
              <p className="text-sm leading-relaxed">
                HealthCare Plus is dedicated to providing top-notch medical services with compassionate care and cutting-edge technology.
              </p>
            </div>

            <div className="w-full sm:w-auto mb-8">
              <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-600 inline-block pb-1">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition">Home</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Services</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Doctors</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Appointments</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>

            <div className="w-full sm:w-auto mb-8">
              <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-600 inline-block pb-1">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">FAQs</a></li>
              </ul>
            </div>

            <div className="w-full sm:w-auto md:w-1/4">
              <h3 className="text-xl font-semibold mb-4 border-b-2 border-blue-600 inline-block pb-1">Contact Us</h3>
              <address className="not-italic mb-6 text-sm space-y-2">
                <p>123 Health St., Wellness City</p>
                <p>Phone: <a href="tel:+1234567890" className="hover:text-blue-400 transition">+1 (234) 567-890</a></p>
                <p>Email: <a href="mailto:info@healthcareplus.com" className="hover:text-blue-400 transition">info@healthcareplus.com</a></p>
              </address>

              <div className="flex space-x-3">
                <a href="#" className="p-2 border border-gray-600 rounded-full hover:text-blue-400 hover:border-blue-400 transition" aria-label="Facebook">
                  <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </a>
                <a href="#" className="p-2 border border-gray-600 rounded-full hover:text-blue-400 hover:border-blue-400 transition" aria-label="Twitter">
                  <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                  </svg>
                </a>
                <a href="#" className="p-2 border border-gray-600 rounded-full hover:text-blue-400 hover:border-blue-400 transition" aria-label="Instagram">
                  <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8z" />
                  </svg>
                </a>
                <a href="#" className="p-2 border border-gray-600 rounded-full hover:text-blue-400 hover:border-blue-400 transition" aria-label="LinkedIn">
                  <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M100.28 448H7.4V148.9h92.88zm-46.44-339.1a53.71 53.71 0 1153.7-53.7 53.66 53.66 0 01-53.7 53.7zM447.9 448h-92.4V302.4c0-34.7-12.4-58.4-43.3-58.4-23.6 0-37.6 15.8-43.8 31.1-2.2 5.4-2.8 13-2.8 20.6V448h-92.4s1.2-270.2 0-297.6h92.4v42.2c-.2.3-.5.7-.7 1h.7v-1c12.3-19 34.3-46.1 83.4-46.1 60.8 0 106.5 39.7 106.5 125.2z" />
                  </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
            &copy; 2025 Docsera Plus. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}
