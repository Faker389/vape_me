"use client"
import type React from "react"
import "../../app/globals.css";
import { AgeVerificationModal } from "@/components/age-verification"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { auth } from "@/lib/firebase"

export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [showWorkerOptions, setShowWorkerOptions] = useState<boolean>(false)
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.email === "malgorzatamagryso2.pl@gmail.com") {
        setShowWorkerOptions(true)
      } else {
        setShowWorkerOptions(false)
      }
    })
    return () => unsubscribe()
  },[])
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
      <main className="min-h-screen globalWhite bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] overflow-hidden">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl bg-[#0a0a0f]/80"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="w-12 h-12 rounded-full p-1 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Vape Me Logo"
                  width={110}
                  height={110}
                  className="w-3xs h-2xl mt-[-10px] object-contain"
                />
              </div>
              <span className="text-2xl font-bold gradient-text">Vape me</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <div className="gap-3 flex">
            </div>
            {showWorkerOptions ? (
              <Link href="/management">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 glow-effect py-2 bg-gradient-to-r cursor-pointer from-purple-500 to-pink-500 rounded-full text-white font-semibold"
                >
                  Ekran zarządzania produktami
                </motion.button>
              </Link>
            ) : ""}
            <a href="/vape_me.apk">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 cursor-pointer bg-gradient-to-r glow-effect from-purple-500 to-pink-500 rounded-full text-white font-semibold"
              >
                Pobierz aplikacje
              </motion.button>
            </a>
          </div>
        </div>
      </motion.nav>
        <AgeVerificationModal />
        {children}
        </main>
      </body>
    </html>
  )
}
