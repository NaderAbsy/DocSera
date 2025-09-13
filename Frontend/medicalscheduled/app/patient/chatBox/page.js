"use client"

import PatientNav from "../../../components/PatientNav"
import axios from "axios" 
import { useState, useEffect, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/navigation";
import Image from "next/image"
import Link from "next/link"

export default function AIDoctorChat() {
      const router = useRouter();
      const [authorized, setAuthorized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      text: "Hello! I'm Dr. AI, your virtual medical assistant. How can I help you today? Please describe your symptoms or health concerns.",
      senderId: "doctor",
      senderName: "Dr. AI",
      timestamp: new Date().toLocaleTimeString(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [profileData, setProfileData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  })
  const messagesEndRef = useRef(null)

   useEffect(() => {
              const token = localStorage.getItem("jwt");
              const userType = localStorage.getItem("UserType");
              if (!token || userType !== "Patient") {
                router.replace("/"); 
              } else {
                setAuthorized(true); 
              }
            }, [router]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    const token = localStorage.getItem("jwt")
    if (!token) return

    fetch("https://localhost:44316/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfileData({
            userId: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
          })
        }
      })
      .catch((err) => console.error(err))
  }, [])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: uuidv4(),
      text: inputMessage,
      senderId: profileData.userId,
      senderName: profileData.firstName + " " + profileData.lastName,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const token = localStorage.getItem("jwt")
      const response = await axios.post(
        "https://localhost:44316/saveChat",
        { message: inputMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Ensure backend returns plain text AI response
      const aiText = typeof response.data.aiResponse === "string"
        ? response.data.aiResponse
        : "I received your message. Can you elaborate?"

      addDoctorMessage(aiText)
    } catch (err) {
      console.error(err)
      addDoctorMessage("Sorry, there was an error connecting to the AI assistant.")
    }
  }

  const addDoctorMessage = (responseText) => {
    const doctorResponse = {
      id: uuidv4(),
      text: responseText,
      senderId: "doctor",
      senderName: "Dr. AI",
      timestamp: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, doctorResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 flex flex-col">

      {/* Header (top navigation bar) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 backdrop-blur bg-white/70 supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/patient" className="flex items-center gap-3 cursor-pointer">
              <Image src="/M1.png" alt="Docsera" width={70} height={70} className="rounded-lg" />
              <span className="font-extrabold tracking-tight text-4xl text-gray-900">
                Docsera
              </span>
            </Link>
          </div>
          <Link
            href="/patient/Appointments"
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 text-sm font-medium"
          >
            <span className="hidden sm:inline">Back to Appointments</span>
            <span className="sm:hidden">Back</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
              →
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content (chat section) */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">

        {/* Chat header (doctor profile box) */}
        <div className="bg-white rounded-t-lg shadow-lg p-6 border-b border-blue-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-300">
              <span className="text-blue-600 text-xl font-bold">🩺</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dr. AI</h1>
              <p className="text-gray-600">Virtual Medical Assistant</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>

        {/* Chat messages container */}
        <div className="bg-white border border-slate-300 rounded-2xl shadow-md h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => {
            const isUser = message.senderId === profileData.userId
            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={[
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                    isUser
                      ? "bg-blue-500 text-white" 
                      : "bg-blue-500 text-white border border-gray-400", 
                  ].join(" ")}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${isUser ? "text-blue-100" : "text-gray-300"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Typing indicator (when AI is responding) */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-600 text-white border border-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <p className="text-xs mt-1 text-gray-300">Dr. AI is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input box */}
        <div className="bg-white rounded-b-lg shadow-lg p-6 mt-2">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or ask a health question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ This is for informational purposes only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </main>

      {/* Footer (bottom navigation and links) */}
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
  )
}
