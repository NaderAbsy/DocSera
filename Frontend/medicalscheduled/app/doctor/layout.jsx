import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata = {
  title: "Medicizen Dashboard",
  description: "Medical dashboard for healthcare professionals",
}

export default function RootLayout({ children }) {
  return (
    <div lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {children}
    </div>
  )
}
