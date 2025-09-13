"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import DoctorLayout from "../../../components/doctorLayout";
import { useRouter } from "next/navigation";

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
   const router = useRouter();
   const [authorized, setAuthorized] = useState(false);
  

   useEffect(() => {
          const token = localStorage.getItem("jwt");
          const userType = localStorage.getItem("UserType");
          if (!token || userType !== "Doctor") {
            router.replace("/"); 
          } else {
            setAuthorized(true); 
          }
        }, [router]);

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
    authorized &&
    <DoctorLayout>
      <div className=" bg-sky-300">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-br via-sky-300 to-sky-400 py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 text-balance">
              Doctor Community.
            </h1>
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto text-pretty">
              You can Answers Questions Here.
            </p>
            <div>
              {message && <p className="mb-4 text-sm">{message}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              


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
                          <span
                            className="bg-pink-100 text-blue-600 px-2 py-1 rounded-full text-xs cursor-pointer"
                            onClick={() => openReplyModal(topic.id)}
                          >
                            Reply
                          </span>


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


      
    </DoctorLayout>
  )
}
