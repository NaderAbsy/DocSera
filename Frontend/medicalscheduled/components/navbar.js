'use client'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
      const [menuOpen, setMenuOpen] = useState(false);
    
    return (

         <header className="flex mx-auto justify-between items-center max-w-[1300px] py-4">
          <div className="flex items-center gap-3">
          <Link href="/Home">
   
      <Image
        src="/M1.png"
        alt="Description"
        width={120} 
        height={120}
        className="object-contain"
      />
    
  </Link>
          </div>

          {/* Navigation */}
      <nav
  className={`${menuOpen ? "block" : "hidden"} sm:block`}
>
 <ul className="relative flex flex-col sm:flex-row gap-3 md:gap-5 lg:gap-10 z-30">
  <li>
    <Link
      href="/about"
      onClick={() => setMenuOpen(false)}
      className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
    >
      ABOUT
    </Link>
  </li>
  <li>
    <Link
      href="/services"
      onClick={() => setMenuOpen(false)}
      className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
    >
      SERVICES
    </Link>
  </li>
  <li>
    <Link
      href="/chat"
      onClick={() => setMenuOpen(false)}
      className="uppercase font-bold text-xs text-white block px-3 py-2 hover:bg-white hover:text-[#8176AF] rounded transition z-30"
    >
      CHAT WITH AI
    </Link>
  </li>
</ul>


</nav>


          <div className="hidden sm:flex gap-3 md:gap-5 lg:gap-9">
            <Link href="/patient/ContactUs" > 
            <button className="uppercase font-bold text-xs rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-[#8176AF] to-[#C0B7E8]">
              CONTACT US
            </button>
            </Link>
          </div>

          {/* Hamburger button for mobile */}
          <button
            className="sm:hidden inline-block"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="33"
              height="26"
              viewBox="0 0 33 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="33"
                height="3.71429"
                rx="1.85714"
                fill="url(#paint0_linear_13_83)"
              ></rect>
              <rect
                y="22.2857"
                width="33"
                height="3.71429"
                rx="1.85714"
                fill="url(#paint1_linear_13_83)"
              ></rect>
              <rect
                x="9"
                y="11.1429"
                width="24"
                height="3.71429"
                rx="1.85714"
                fill="url(#paint2_linear_13_83)"
              ></rect>
              <defs>
                <linearGradient
                  id="paint0_linear_13_83"
                  x1="-8.62252e-09"
                  y1="3.46667"
                  x2="36.0395"
                  y2="3.46666"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C0B7E8"></stop>
                  <stop offset="1" stopColor="#8176AF"></stop>
                </linearGradient>
                <linearGradient
                  id="paint1_linear_13_83"
                  x1="-3.90789"
                  y1="26"
                  x2="33"
                  y2="26"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C0B7E8"></stop>
                  <stop offset="1" stopColor="#8176AF"></stop>
                </linearGradient>
                <linearGradient
                  id="paint2_linear_13_83"
                  x1="5.21062"
                  y1="13"
                  x2="33.0001"
                  y2="13"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#C0B7E8"></stop>
                  <stop offset="1" stopColor="#8176AF"></stop>
                </linearGradient>
              </defs>
            </svg>
          </button>
        </header>
    );
}
