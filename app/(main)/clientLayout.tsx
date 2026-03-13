"use client"
import "../../app/globals.css";
import type React from "react"
import { AgeVerificationModal } from "@/components/age-verification"
import Navbar from "@/components/Navbar";
 
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
<main className=" min-h-[100dvh] w-full globalWhite bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] overflow-x-hidden">
      <Navbar />
      <AgeVerificationModal />
      <div className="pt-20 sm:pt-24 w-full">{children}</div>
    </main>
  )
}