'use client'
import PatientNav from "../../components/PatientNav"
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from "next/image";
import Link from "next/link";
import { useState , useEffect } from "react";
import { useRouter } from "next/navigation";

export default function patient() {

    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const { scrollY } = useScroll();
    const opacityImg = useTransform(scrollY, [0, 200, 300, 700], [1, 0.5, 0.5, 0]);
    const opacityLastDiv = useTransform(scrollY, [1000, 1200, 1300, 1700], [1, 0.5, 0.5, 0]);
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [submitted, setSubmitted] = useState(false)
    const handleStarClick = (starIndex) => {
        setRating(starIndex)
    }

    const handleStarHover = (starIndex) => {
        setHoveredRating(starIndex)
    }

    const handleMouseLeave = () => {
        setHoveredRating(0)
    }

    const handleSubmit = async() => {
        if (rating > 0) {
            setSubmitted(true)
            const token = localStorage.getItem("jwt");
                const res = await fetch(`https://localhost:44316/${rating}/AddRate`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            }); 
            console.log("Rating submitted:", rating)
        }
    }

    const resetRating = () => {
        setRating(0)
        setSubmitted(false)
        setHoveredRating(0)
    }

     useEffect(() => {
          const token = localStorage.getItem("jwt");
          const userType = localStorage.getItem("UserType");
          if (!token || userType !== "Patient") {
            router.replace("/"); 
          } else {
            setAuthorized(true); 
          }
        }, [router]);

    return (
        <>
            
            <motion.section
                style={{ opacity: opacityImg }}
                className="bg-sky-300 overflow-hidden pb-9 px-4 md:px-8">

                {/* <NavBar/>  */}
                <PatientNav />

                <section className="relative flex flex-col-reverse md:flex-row mx-auto justify-between items-center gap-9 md:gap-4 max-w-[1300px] py-4 my-12">
                    {/* Lines  */}
                    <motion.svg
                        style={{ opacity: opacityImg }}
                        width="736"
                        height="423"
                        className="absolute top-[50px] sm:top-[200px] sm:right-[-150px]"
                        viewBox="0 0 736 423"
                        fill="none"

                    >
                        <path
                            d="M738.5 4.5C491.667 -7.66666 -0.900015 58.9 3.49999 422.5"
                            stroke="url(#paint0_linear_16_172)"
                            strokeWidth="6"
                        ></path>
                        <defs>
                            <linearGradient
                                id="paint0_linear_16_172"
                                x1="700.5"
                                y1="-3.99998"
                                x2="14.5"
                                y2="361"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#343045"></stop>
                                <stop offset="0.213542" stopColor="#C0B7E8"></stop>
                                <stop offset="0.71875" stopColor="#8176AF"></stop>
                                <stop offset="1" stopColor="#343045"></stop>
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    <motion.svg
                        className="absolute sm:right-28 md:right-6 z-10 pointer-events-none"
                        width="420"
                        height="846"
                        viewBox="0 0 420 846"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ overflow: "visible", opacity: opacityImg }}

                    >
                        <path
                            d="M23.19293 0C19.91209 140.127 57.2087 433.314 232.642 485.053C408.075 536.792 411.776 746.576 391.697 845"
                            stroke="url(#paint0_linear_16_173)"
                            strokeWidth="6"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_16_173"
                                x1="16.5"
                                y1="39.5"
                                x2="363"
                                y2="814"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0.0104167" stopColor="#343045" />
                                <stop offset="0.229167" stopColor="#C0B7E8" />
                                <stop offset="0.776042" stopColor="#8176AF" />
                                <stop offset="1" stopColor="#343045" />
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    <motion.svg
                        style={{ opacity: opacityImg }}
                        className="absolute -top-14 sm:right-7"
                        width="416"
                        height="675"
                        viewBox="0 0 416 675"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M415 3C325.774 17.8434 155.913 102.224 190.271 320.998C224.63 539.772 78.4065 646.155 1 672"
                            stroke="url(#paint0_linear_16_171)"
                            strokeWidth="6"
                        ></path>
                        <defs>
                            <linearGradient
                                id="paint0_linear_16_171"
                                x1="365.5"
                                y1="28"
                                x2="110"
                                y2="594"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#343045"></stop>
                                <stop offset="0.276042" stopColor="#8176AF"></stop>
                                <stop offset="0.739583" stopColor="#C0B7E8"></stop>
                                <stop offset="1" stopColor="#343045"></stop>
                            </linearGradient>
                        </defs>
                    </motion.svg>

                    {/* LeftSide */}
                  <motion.div className="md:w-[520px] z-20 text-center md:text-left">

  {/*animated icons */}
  <motion.div
    className="flex gap-8 justify-center md:justify-start mb-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <motion.div
      className="w-30 h-20 rounded-full bg-[#ADD8E6] flex items-center justify-center text-white text-3xl shadow-lg"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
    >📅
    </motion.div>

    <motion.div
      className="w-30 h-20 rounded-full bg-[#ADD8E6] flex items-center justify-center text-white text-3xl shadow-lg"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
    > 🩺
    </motion.div>

    <motion.div
      className="w-30 h-20 rounded-full bg-[#ADD8E6] flex items-center justify-center text-white text-3xl shadow-lg"
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 2, delay: 1 }}
    >🧑‍⚕️
    </motion.div>
  </motion.div>

  {/* Title */}
  <motion.h1
    className="text-3xl md:text-[36px] lg:text-[46px] leading-[56px] text-white font-bold"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
  >
    <span className="text-[#330c9f]">Efficient </span>
    Clinical Booking and
    <span className="text-[#330c9f]"> Scheduling</span>
  </motion.h1>

  {/* Description */}
  <motion.p
    className="text-base text-purple mt-4 md:mt-9 mb-10 md:mb-12"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    Transform the way you manage healthcare visits with our intelligent
    appointment platform. Book, reschedule, and track your clinical
    appointments effortlessly—anytime, anywhere. Built to simplify workflows
    and deliver a seamless experience for patients and providers, it is
    healthcare made smarter.
  </motion.p>

</motion.div>



                    {/* Image in RightSide */}
                    <motion.div
                    
                        style={{ opacity: opacityImg }}
                        className="p-4 z-20 bg-white bg-opacity-20 rounded-full overflow-hidden w-100 h-100 flex items-center justify-center">
                        <motion.img
                            className="w-full h-full object-cover rounded-full"
                            src="/medicalclinic.png"
                            alt=""
                        />
                    </motion.div>

                </section>
            </motion.section>


            {/* Servises Sectios */}
            <section id="Servises" className="bg-gray-50 py-16 px-6">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our
                        <span className="text-[#330c9f]"> Medical  </span>
                        Services</h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Export easily and quickly with our services.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Service Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src="DoctorAI.png"
                                alt="General Checkup"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Chat With AI</h3>
                            <p className="text-gray-600 mb-4">

                                Ask me about diagnosis, appointments , doctors and many more
                            </p>
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                <Link
                                    href="/patient/chatBox">
                                    Chat Now
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/* Service Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src="BookNow.png"
                                alt="BookNow"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Booking service</h3>
                            <p className="text-gray-600 mb-4">
                                Book your Appointment now
                            </p>
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                <Link href="/patient/Appointments/addAppointment">
                                    Book Now
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/* Service Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src="MedicalCommunication.png"
                                alt="MedicalCommunication"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2">Medical Communication</h3>
                            <p className="text-gray-600 mb-4">
                                See what others talk , ask and Doctor Answers
                            </p>
                            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                                <Link
                                    href="/community"
                                >
                                    Explore Now
                                </Link>
                            </button>
                        </div>
                    </div>




                    {/* You can add more services here similarly */}
                </div>
            </section>

            {/* Achievements Sectios */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
                        Our Achievements
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-around items-center gap-12">
                        {/* Patients Treated */}
                        <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 50 }} 
                        whileInView={{ opacity: 1, y: 0 }}   
                         transition={{ duration: 1, ease: "easeOut" }}
                         viewport={{ once: true, amount: 0.3 }} 
                        >
                        <motion.h3
                        className="text-5xl font-bold text-blue-600"
                        initial={{ scale: 0.5, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: true }}
                        >
                        25K+
                        </motion.h3>
                        <motion.p
                        className="text-gray-700 mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: true }}
                        >
                        Patients Treated
                        </motion.p>
                        </motion.div>

                        {/* Years in Service */}
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 50 }} 
                            whileInView={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 1, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                        <motion.h3
                             className="text-5xl font-bold text-blue-600"
                             initial={{ scale: 0.5, opacity: 0 }}
                             whileInView={{ scale: 1, opacity: 1 }}
                             transition={{ duration: 1, delay: 1.0 }}
                             viewport={{ once: true }}
                        >20+
                        </motion.h3>

                        <motion.p
                            className="text-gray-700 mt-2"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 1.0 }}
                            viewport={{ once: true }}
                        >Years in Service

                        </motion.p>
                        </motion.div>

                        {/* Certifications */}
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 50 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 1, ease: "easeOut" }}
                                viewport={{ once: true, amount: 0.5 }}
                              >
                                <motion.h3
                                  className="text-5xl font-bold text-blue-600"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  whileInView={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 1, delay: 1.5 }}
                                  viewport={{ once: true }}
                                >
                                  15+
                                </motion.h3>

                                <motion.p
                                  className="text-gray-700 mt-2"
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 1, delay: 1.5 }}
                                  viewport={{ once: true }}
                                >
                                  Certifications
                                </motion.p>
                               </motion.div>

                        {/* Awards */}
                        <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 50 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 1, ease: "easeOut" }}
                                viewport={{ once: true, amount: 0.5 }}
                              >
                               <motion.h3
                                  className="text-5xl font-bold text-blue-600"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  whileInView={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 1, delay: 2.0 }}
                                  viewport={{ once: true }}
                                >
                                  10+
                                </motion.h3>

                                <motion.p
                                  className="text-gray-700 mt-2"
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 1, delay: 2.0 }}
                                  viewport={{ once: true }}
                                >
                                  Awards Won
                                </motion.p>
                              </motion.div>
                    </div>
                </div>
            </section>

            {/* Doctores Sections */}
            <section id="Docs" className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Meet Our Doctors</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our team of experienced and compassionate doctors is dedicated to providing
                        you with the best healthcare possible.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {/* Doctor Card */}
                    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                        <img
                            src="Doctor1.png"
                            alt="Dr. Nader Absy"
                            className="w-full h-150 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-semibold">Dr. Nader Absy</h3>
                            <p className="text-blue-600 font-medium mb-2">Cardiologist</p>
                            <p className="text-gray-600 text-sm mb-4">
                                11 years of experience in diagnosing and treating cardiovascular diseases.
                                Passionate about preventive heart care.
                            </p>
                            <span className="text-gray-500 text-xs">MD, FACC</span>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                        <img
                            src="Doctor2.png"
                            alt="Dr. Sarah Johnson"
                            className="w-full h-150 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-semibold">Dr. Sarah Johnson</h3>
                            <p className="text-blue-600 font-medium mb-2">Pediatrician</p>
                            <p className="text-gray-600 text-sm mb-4">
                                Over 4 years of caring for children’s health from infancy to adolescence,
                                with a gentle and friendly approach.
                            </p>
                            <span className="text-gray-500 text-xs">MD, FAAP</span>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                        <img
                            src="Doctor3.png"
                            alt="Dr. Ahmed Khan"
                            className="w-full h-150 object-cover"
                        />
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-semibold">Dr. Ahmed Khan</h3>
                            <p className="text-red-600 font-medium mb-2">Cardiologist</p>
                            <p className="text-gray-600 text-sm mb-4">
                                Expert in heart health, cardiovascular disease prevention, and advanced cardiac care with 16 years of clinical experience.
                            </p>
                            <span className="text-gray-500 text-xs">MD, FACC, Board Certified</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rate Sections */}
            <section className="bg-blue-50 py-16 flex items-center justify-center">
                <div className="max-w-md w-full bg-card rounded-lg border border-border p-8 shadow-lg">
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground">Rate Your Experience</h2>
                        <p className="text-muted-foreground">How would you rate our service?</p>

                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    onMouseLeave={handleMouseLeave}
                                    disabled={submitted}
                                    className="transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded disabled:cursor-not-allowed"
                                >
                                    <svg
                                        className={`w-8 h-8 transition-colors duration-200 ${star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-muted-foreground"}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        {rating > 0 && (
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    You selected {rating} star{rating !== 1 ? "s" : ""}
                                </p>
                            </div>
                        )}

                        {!submitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0}
                                className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Rating
                            </button>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
                                    <p className="text-green-800 dark:text-green-200 font-medium">Thank you for your feedback!</p>
                                    <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                                        Your {rating}-star rating has been submitted.
                                    </p>
                                </div>
                                {/* <button
                                    onClick={resetRating}
                                    className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md font-medium transition-colors hover:bg-secondary/80"
                                >
                                    Rate Again
                                </button> */}
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* Footer Sections */}
            <footer className="bg-gray-900 text-gray-300 py-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between">


                        <div className="w-full md:w-1/4 mb-8 md:mb-0">
                            <a href="/patient" className="inline-block mb-6">

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
                                <li><a href="/patient" className="hover:text-blue-400 transition">Home</a></li>
                                <li><a href="#Servises" className="hover:text-blue-400 transition">Services</a></li>
                                <li><a href="#Docs" className="hover:text-blue-400 transition">Doctors</a></li>
                                <li><a href="patient/Appointments" className="hover:text-blue-400 transition">Appointments</a></li>
                                <li><a href="/patient/ContactUs" className="hover:text-blue-400 transition">Contact</a></li>
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
                                <p>Jordan Amman</p>
                                <p>Phone: <a href="tel:+1234567890" className="hover:text-blue-400 transition">+962 795616787</a></p>
                                <p>Email: <a href="mailto:info@healthcareplus.com" className="hover:text-blue-400 transition">docsera159@gmail.com</a></p>
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
    );
}
