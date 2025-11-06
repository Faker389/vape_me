"use client"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Logout() {
  const [success, setSuccess] = useState<boolean>(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  async function signOut() {
    if (!auth) return
    await auth.signOut()
    setSuccess(true)
  }
  useEffect(() => {
    if (isReady) {
      signOut()
    }
  }, [isReady])

  useEffect(() => {
    if (success) {
      window.location.href = "/"
    }
  }, [success])

  if (!isReady) {
    return null
  }

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f]">
          {/* Logo in top left */}
          <div className="absolute top-6 left-6 z-20">
            <Image src="/logo.png" alt="Company Logo" width={220} height={140} className="h-24 w-auto cursor-pointer" />
          </div>

          {/* Background floating orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse [animation-delay:2s]"></div>
          </div>
          <div className="">
            <h1 className=" flex flex-row gap-10 text-4xl text-white">
              <Loader2 className="w-12 h-12 animate-spin " /> Wylogowywanie
            </h1>
          </div>
        </div>
      </body>
    </html>
  )
}
