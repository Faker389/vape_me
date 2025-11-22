"use client"
import "../../app/globals.css";
import type React from "react"
import { AgeVerificationModal } from "@/components/age-verification"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { auth } from "@/lib/firebase"
import { Settings, Download } from "lucide-react"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showWorkerOptions, setShowWorkerOptions] = useState<boolean>(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email === "malgorzatamagryso2.pl@gmail.com" || user?.email === "vapeme123321@gmail.com") {
        setShowWorkerOptions(true)
      } else {
        setShowWorkerOptions(false)
      }
    })
    return () => unsubscribe()
  }, [])
  return (
    <main className="min-h-full globalWhite bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] overflow-hidden">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl bg-[#0a0a0f]/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Vape Me Logo"
                  width={110}
                  height={110}
                  className=" mt-[-10px] object-contain"
                />
              </div>
            </motion.div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6 md:gap-8 flex-1 justify-end">
            <Link href="/" className=" text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
              Home
            </Link>
            <Link href="/products" className=" text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
              Products
            </Link>

            <Link href="/#contact" className=" hidden md:block text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>

            {showWorkerOptions && (
              <Link href="/management">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="md:px-6 glow-effect md:py-2 p-2 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 rounded-full text-white font-semibold"
                  title="Zarządzanie produktami"
                >
                  <span className="md:hidden">
                    <Settings className="w-4 h-4" />
                  </span>
                  <span className="hidden md:inline">Ekran zarządzania produktami</span>
                </motion.button>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {/* Android Download Button */}
              <a href="/vape me.apk" download>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 sm:px-4 md:px-6 cursor-pointer bg-gradient-to-r glow-effect from-purple-500 to-pink-500 rounded-full text-white font-semibold text-xs sm:text-sm md:text-base flex items-center gap-1.5 shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                <Image src="/android-logo.svg" alt="Android Logo" width={16} height={16} />

                  <span className="hidden sm:inline">Android</span>
                </motion.button>
              </a>

              {/* iOS Download Button */}
              <a href="/vape me.ipa" download>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 sm:px-4 md:px-6 cursor-pointer bg-gradient-to-r glow-effect from-pink-500 to-purple-500 rounded-full text-white font-semibold text-xs sm:text-sm md:text-base flex items-center gap-1.5 shadow-lg hover:shadow-pink-500/50 transition-shadow"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span className="hidden sm:inline">iOS</span>
                </motion.button>
              </a>
            </div>
          </div>
        </div>
      </motion.nav>
      <AgeVerificationModal />
      {/* Add pt-20 for mobile, pt-24 for tablet and up to account for fixed navbar height */}
      <div className="pt-20 sm:pt-24">{children}</div>
    </main>
  )
}
